import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Dashboard — Track (Step 6) overview
 * Shows: compliance score, system count, upcoming deadlines, recent activity
 */
export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  // Get system count
  const { count: systemCount } = await supabase
    .from('ai_systems')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="max-w-5xl">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl text-dark-type">
          AI Governance Overview
        </h1>
        <p className="text-dark-sub mt-1">
          Track your EU AI Act compliance across all systems.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="hexis-card">
          <p className="label-upper mb-2">AI Systems</p>
          <p className="font-heading text-3xl text-dark-type">
            {systemCount ?? 0}
          </p>
          <p className="text-sm text-dark-sub mt-1">registered</p>
        </div>

        <div className="hexis-card">
          <p className="label-upper mb-2">Compliance Score</p>
          <p className="font-heading text-3xl text-dark-type">—</p>
          <p className="text-sm text-dark-sub mt-1">
            complete a system assessment to see your score
          </p>
        </div>

        <div className="hexis-card">
          <p className="label-upper mb-2">Next Deadline</p>
          <p className="font-heading text-xl text-dark-type">
            2 Aug 2026
          </p>
          <p className="text-sm text-dark-sub mt-1">
            Annex III high-risk obligations
          </p>
        </div>
      </div>

      {/* Empty state — call to action */}
      {(systemCount ?? 0) === 0 && (
        <div className="hexis-card text-center py-12">
          <p className="label-upper mb-3">Getting Started</p>
          <h3 className="font-heading text-xl text-dark-type mb-2">
            Register your first AI system
          </h3>
          <p className="text-dark-sub max-w-md mx-auto mb-6">
            Start with the ORIENT flow: describe your AI system and we will guide
            you through risk classification, obligations, and compliance planning.
          </p>
          <a href="/dashboard/systems/new" className="hexis-btn-primary hexis-btn">
            Register AI System
          </a>
        </div>
      )}

      {/* ORIENT flow explanation */}
      <div className="mt-8">
        <p className="label-upper mb-4">How It Works</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { letter: 'O', name: 'Observe', desc: 'Register your AI system' },
            { letter: 'R', name: 'Risk', desc: 'Classify risk level' },
            { letter: 'I', name: 'Identify', desc: 'Map obligations' },
            { letter: 'E', name: 'Evaluate', desc: 'Assess maturity' },
            { letter: 'N', name: 'Navigate', desc: 'Plan your actions' },
            { letter: 'T', name: 'Track', desc: 'Monitor progress' },
          ].map((step) => (
            <div key={step.letter} className="hexis-card text-center py-4">
              <span className="font-heading text-2xl text-brass">
                {step.letter}
              </span>
              <p className="label-upper mt-2">{step.name}</p>
              <p className="text-xs text-dark-sub mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
