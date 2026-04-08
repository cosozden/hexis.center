import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Card, Badge, Button } from '@/components/ui';

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

/**
 * Dashboard — AI Governance Overview
 * Shows: metrics, recent systems, ORIENT flow, empty state
 */
export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  // Get system count
  const { count: systemCount } = await supabase
    .from('ai_systems')
    .select('*', { count: 'exact', head: true });

  // Get recent systems (up to 5) with latest classification
  const { data: recentSystems } = await supabase
    .from('ai_systems')
    .select('id, name, purpose, organisation_role, deployment_status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch classifications for recent systems
  const recentIds = (recentSystems || []).map((s) => s.id);
  let recentClassifications: Record<string, string> = {};
  if (recentIds.length > 0) {
    const { data: classData } = await supabase
      .from('risk_classifications')
      .select('system_id, risk_level')
      .in('system_id', recentIds)
      .order('classified_at', { ascending: false });

    if (classData) {
      for (const c of classData) {
        if (!recentClassifications[c.system_id]) {
          recentClassifications[c.system_id] = c.risk_level;
        }
      }
    }
  }

  // Count obligations across all systems
  const { count: totalObligations } = await supabase
    .from('obligations')
    .select('*', { count: 'exact', head: true });

  const { count: completedObligations } = await supabase
    .from('obligations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  const total = systemCount ?? 0;
  const oblTotal = totalObligations ?? 0;
  const oblDone = completedObligations ?? 0;

  return (
    <div className="max-w-5xl">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl text-foreground border-b border-primary pb-2 inline-block">
          AI Governance Overview
        </h1>
        <p className="text-muted-foreground mt-3">
          Track your EU AI Act compliance across all systems.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/dashboard/systems">
          <Card featured className="p-6 hover:border-primary/40 transition-colors cursor-pointer">
            <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-2">AI Systems</p>
            <p className="font-heading text-3xl text-primary">
              {total}
            </p>
            <p className="text-sm text-muted-foreground mt-1">registered</p>
          </Card>
        </Link>

        <Card featured className="p-6">
          <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-2">Obligations</p>
          {oblTotal > 0 ? (
            <>
              <p className="font-heading text-3xl text-primary">
                {oblDone}/{oblTotal}
              </p>
              <p className="text-sm text-muted-foreground mt-1">completed</p>
            </>
          ) : (
            <>
              <p className="font-heading text-3xl text-primary">&mdash;</p>
              <p className="text-sm text-muted-foreground mt-1">classify a system to see obligations</p>
            </>
          )}
        </Card>

        <Card featured className="p-6">
          <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-2">Next Deadline</p>
          <p className="font-heading text-xl text-foreground">
            2 Aug 2026
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Annex III high-risk obligations
          </p>
        </Card>
      </div>

      {/* Empty state — call to action */}
      {total === 0 && (
        <Card accent className="text-center py-12 px-6 mb-8">
          <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">Getting Started</p>
          <h3 className="font-heading text-xl text-foreground mb-2">
            Register your first AI system
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Start with the ORIENT flow: describe your AI system and we will guide
            you through risk classification, obligations, and compliance planning.
          </p>
          <Link href="/dashboard/systems/new">
            <Button size="lg">Register AI System</Button>
          </Link>
        </Card>
      )}

      {/* Recent systems */}
      {total > 0 && recentSystems && recentSystems.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
              Recent Systems
            </p>
            <Link
              href="/dashboard/systems"
              className="text-xs text-primary hover:underline"
            >
              View all ({total})
            </Link>
          </div>

          <div className="space-y-2">
            {recentSystems.map((system) => {
              const riskLevel = recentClassifications[system.id];
              const riskInfo = riskLevel ? RISK_BADGE[riskLevel] : null;

              return (
                <Link
                  key={system.id}
                  href={`/dashboard/systems/${system.id}`}
                  className="block group"
                >
                  <Card className="p-4 transition-colors duration-150 hover:border-primary/40">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {system.name}
                        </h3>
                        {riskInfo ? (
                          <Badge variant={riskInfo.variant}>{riskInfo.label}</Badge>
                        ) : (
                          <Badge>Unclassified</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(system.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ORIENT flow explanation */}
      <div className="mt-8">
        <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-4">How It Works</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { letter: 'O', name: 'Observe', desc: 'Register your AI system' },
            { letter: 'R', name: 'Risk', desc: 'Classify risk level' },
            { letter: 'I', name: 'Identify', desc: 'Map obligations' },
            { letter: 'E', name: 'Evaluate', desc: 'Assess maturity' },
            { letter: 'N', name: 'Navigate', desc: 'Plan your actions' },
            { letter: 'T', name: 'Track', desc: 'Monitor progress' },
          ].map((step) => (
            <Card key={step.letter} className="text-center py-4 px-2">
              <span className="font-heading text-2xl text-primary">
                {step.letter}
              </span>
              <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mt-2">{step.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
