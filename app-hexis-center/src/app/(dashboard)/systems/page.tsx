import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * AI Systems — Inventory list
 * Shows all registered AI systems with risk level badges and ORIENT progress.
 */

const RISK_BADGE: Record<string, { label: string; className: string }> = {
  prohibited: { label: 'Prohibited', className: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  high: { label: 'High Risk', className: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
  limited: { label: 'Limited', className: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  gpai: { label: 'GPAI', className: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
  minimal: { label: 'Minimal', className: 'bg-green-500/10 text-green-400 border border-green-500/20' },
};

const STATUS_DOT: Record<string, string> = {
  planning: 'bg-dark-sub/40',
  development: 'bg-blue-400',
  testing: 'bg-yellow-400',
  production: 'bg-green-400',
  retired: 'bg-dark-sub/20',
};

export default async function SystemsPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch all systems with their latest classification
  const { data: systems } = await supabase
    .from('ai_systems')
    .select('id, name, purpose, organisation_role, deployment_status, created_at, updated_at')
    .order('updated_at', { ascending: false });

  // Fetch latest classification for each system
  const systemIds = (systems ?? []).map(s => s.id);
  const { data: classifications } = systemIds.length > 0
    ? await supabase
        .from('risk_classifications')
        .select('system_id, risk_level')
        .in('system_id', systemIds)
        .order('classified_at', { ascending: false })
    : { data: [] };

  // Deduplicate to latest per system
  const latestClassification = new Map<string, string>();
  for (const c of classifications ?? []) {
    if (!latestClassification.has(c.system_id)) {
      latestClassification.set(c.system_id, c.risk_level);
    }
  }

  // Fetch obligation counts per system
  const { data: obligationCounts } = systemIds.length > 0
    ? await supabase
        .from('obligations')
        .select('system_id, status')
        .in('system_id', systemIds)
    : { data: [] };

  const obligationStats = new Map<string, { total: number; completed: number }>();
  for (const o of obligationCounts ?? []) {
    const stats = obligationStats.get(o.system_id) ?? { total: 0, completed: 0 };
    stats.total++;
    if (o.status === 'completed') stats.completed++;
    obligationStats.set(o.system_id, stats);
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl text-dark-type">AI Systems</h1>
          <p className="text-dark-sub mt-1">
            {(systems ?? []).length} system{(systems ?? []).length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <Link href="/dashboard/systems/new" className="hexis-btn hexis-btn-primary">
          Register System
        </Link>
      </div>

      {/* Empty state */}
      {(systems ?? []).length === 0 && (
        <div className="hexis-card text-center py-12">
          <p className="label-upper mb-3">No Systems Yet</p>
          <h3 className="font-heading text-xl text-dark-type mb-2">
            Register your first AI system
          </h3>
          <p className="text-dark-sub max-w-md mx-auto mb-6">
            Describe your AI system and follow the ORIENT flow to classify risk,
            identify obligations, and build your compliance roadmap.
          </p>
          <Link href="/dashboard/systems/new" className="hexis-btn hexis-btn-primary">
            Get Started
          </Link>
        </div>
      )}

      {/* System cards */}
      <div className="space-y-3">
        {(systems ?? []).map(system => {
          const riskLevel = latestClassification.get(system.id);
          const badge = riskLevel ? RISK_BADGE[riskLevel] : null;
          const stats = obligationStats.get(system.id);
          const statusDot = STATUS_DOT[system.deployment_status] ?? 'bg-dark-sub/40';

          return (
            <Link
              key={system.id}
              href={`/dashboard/systems/${system.id}`}
              className="hexis-card block hover:border-border2 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-heading text-lg text-dark-type truncate">
                      {system.name}
                    </h3>
                    {badge && (
                      <span className={`text-xs px-2 py-0.5 ${badge.className}`}>
                        {badge.label}
                      </span>
                    )}
                    {!riskLevel && (
                      <span className="text-xs px-2 py-0.5 bg-dark-sub/10 text-dark-sub border border-border">
                        Not Classified
                      </span>
                    )}
                  </div>

                  {system.purpose && (
                    <p className="text-sm text-dark-sub line-clamp-1 mb-2">
                      {system.purpose}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-dark-sub">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                      {system.deployment_status}
                    </span>
                    <span>{system.organisation_role}</span>
                    {stats && (
                      <span>
                        {stats.completed}/{stats.total} obligations
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-dark-sub text-sm ml-4 shrink-0">
                  &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
