import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Card, Badge, Button, Separator } from '@/components/ui';

export const dynamic = 'force-dynamic';

// ━━━ CONSTANTS ━━━

const RISK_BADGE: Record<
  string,
  { label: string; variant: 'prohibited' | 'high' | 'limited' | 'gpai' | 'minimal' }
> = {
  prohibited: { label: 'Prohibited', variant: 'prohibited' },
  high: { label: 'High Risk', variant: 'high' },
  limited: { label: 'Limited Risk', variant: 'limited' },
  gpai: { label: 'GPAI', variant: 'gpai' },
  minimal: { label: 'Minimal Risk', variant: 'minimal' },
};

const STATUS_LABEL: Record<string, string> = {
  planning: 'Planning',
  development: 'Development',
  testing: 'Testing',
  production: 'Production',
  retired: 'Retired',
};

const ROLE_LABEL: Record<string, string> = {
  provider: 'Provider',
  deployer: 'Deployer',
  both: 'Provider & Deployer',
};

// ━━━ ORIENT PROGRESS HELPER ━━━

function getOrientProgress(
  hasClassification: boolean,
  obligationCount: number,
): { completed: number; nextStep: string; nextHref: string } {
  if (!hasClassification) {
    return { completed: 1, nextStep: 'Classify risk', nextHref: 'classify' };
  }
  if (obligationCount === 0) {
    return { completed: 2, nextStep: 'Map obligations', nextHref: 'obligations' };
  }
  return { completed: 3, nextStep: 'Assess maturity', nextHref: 'assess' };
}

// ━━━ PAGE ━━━

/**
 * AI Systems Inventory — list all registered systems
 * Shows risk level, ORIENT progress, status, and quick actions.
 */
export default async function SystemsPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch all systems for this org
  const { data: systems, error } = await supabase
    .from('ai_systems')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch latest risk classification for each system
  const systemIds = (systems || []).map((s) => s.id);
  let classifications: Record<string, { risk_level: string; article_references: string[] }> = {};

  if (systemIds.length > 0) {
    const { data: classData } = await supabase
      .from('risk_classifications')
      .select('system_id, risk_level, article_references')
      .in('system_id', systemIds)
      .order('classified_at', { ascending: false });

    // Keep only the latest classification per system
    if (classData) {
      for (const c of classData) {
        if (!classifications[c.system_id]) {
          classifications[c.system_id] = {
            risk_level: c.risk_level,
            article_references: c.article_references || [],
          };
        }
      }
    }
  }

  // Fetch obligation counts per system
  let obligationCounts: Record<string, number> = {};
  if (systemIds.length > 0) {
    const { data: oblData } = await supabase
      .from('obligations')
      .select('system_id')
      .in('system_id', systemIds);

    if (oblData) {
      for (const o of oblData) {
        obligationCounts[o.system_id] = (obligationCounts[o.system_id] || 0) + 1;
      }
    }
  }

  const systemList = systems || [];

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl text-foreground border-b border-primary pb-2 inline-block">
            AI Systems
          </h1>
          <p className="text-muted-foreground mt-3">
            Your AI system inventory. Each system follows the ORIENT compliance flow.
          </p>
        </div>

        <Link href="/dashboard/systems/new">
          <Button>Register System</Button>
        </Link>
      </div>

      {/* Summary bar */}
      {systemList.length > 0 && (
        <div className="flex gap-6 mb-6 text-sm">
          <div>
            <span className="text-muted-foreground">Total: </span>
            <span className="text-foreground font-medium">{systemList.length}</span>
          </div>
          {Object.entries(
            systemList.reduce<Record<string, number>>((acc, s) => {
              const cl = classifications[s.id];
              const level = cl ? cl.risk_level : 'unclassified';
              acc[level] = (acc[level] || 0) + 1;
              return acc;
            }, {}),
          ).map(([level, count]) => (
            <div key={level}>
              <span className="text-muted-foreground">
                {level === 'unclassified' ? 'Unclassified' : (RISK_BADGE[level]?.label || level)}:{' '}
              </span>
              <span className="text-foreground font-medium">{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {systemList.length === 0 && (
        <Card accent className="text-center py-12 px-6">
          <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
            Getting Started
          </p>
          <h3 className="font-heading text-xl text-foreground mb-2">
            No AI systems registered yet
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Register your first AI system to begin the ORIENT compliance flow.
            Describe your system manually or let our AI advisor extract the details
            from a free-text description.
          </p>
          <Link href="/dashboard/systems/new">
            <Button size="lg">Register Your First System</Button>
          </Link>
        </Card>
      )}

      {/* System list */}
      {systemList.length > 0 && (
        <div className="space-y-3">
          {systemList.map((system) => {
            const cl = classifications[system.id];
            const riskInfo = cl ? RISK_BADGE[cl.risk_level] : null;
            const oblCount = obligationCounts[system.id] || 0;
            const orient = getOrientProgress(!!cl, oblCount);

            return (
              <Link
                key={system.id}
                href={`/dashboard/systems/${system.id}`}
                className="block group"
              >
                <Card className="p-5 transition-colors duration-150 hover:border-primary/40">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: system info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="font-heading text-lg text-foreground group-hover:text-primary transition-colors truncate">
                          {system.name}
                        </h3>
                        {riskInfo && (
                          <Badge variant={riskInfo.variant}>{riskInfo.label}</Badge>
                        )}
                        {!riskInfo && (
                          <Badge>Unclassified</Badge>
                        )}
                      </div>

                      {system.purpose && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {system.purpose}
                        </p>
                      )}

                      {/* Meta row */}
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{ROLE_LABEL[system.organisation_role] || system.organisation_role}</span>
                        <span>{STATUS_LABEL[system.deployment_status] || system.deployment_status}</span>
                        {system.eu_market && <span>EU Market</span>}
                        <span>
                          {new Date(system.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Right: ORIENT progress */}
                    <div className="shrink-0 text-right">
                      <div className="flex gap-0.5 mb-1.5">
                        {['O', 'R', 'I', 'E', 'N', 'T'].map((letter, i) => (
                          <div
                            key={letter}
                            className={`w-5 h-5 flex items-center justify-center text-[9px] font-medium border ${
                              i < orient.completed
                                ? 'border-primary bg-primary/10 text-primary'
                                : i === orient.completed
                                  ? 'border-primary/40 text-foreground'
                                  : 'border-border text-muted-foreground/40'
                            }`}
                          >
                            {letter}
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {orient.completed}/6 &mdash; {orient.nextStep}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Footer hint */}
      {systemList.length > 0 && (
        <p className="text-xs text-muted-foreground mt-6">
          Each system follows the ORIENT flow: Observe, Risk, Identify, Evaluate,
          Navigate, Track. Click a system to continue its compliance journey.
        </p>
      )}
    </div>
  );
}
