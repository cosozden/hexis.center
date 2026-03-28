import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Card, Button } from '@/components/ui';

export const dynamic = 'force-dynamic';

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
        <h1 className="font-heading text-2xl text-foreground border-b border-primary pb-2 inline-block">
          AI Governance Overview
        </h1>
        <p className="text-muted-foreground mt-3">
          Track your EU AI Act compliance across all systems.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card featured className="p-6">
          <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-2">AI Systems</p>
          <p className="font-heading text-3xl text-primary">
            {systemCount ?? 0}
          </p>
          <p className="text-sm text-muted-foreground mt-1">registered</p>
        </Card>

        <Card featured className="p-6">
          <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-2">Compliance Score</p>
          <p className="font-heading text-3xl text-primary">&mdash;</p>
          <p className="text-sm text-muted-foreground mt-1">
            complete a system assessment to see your score
          </p>
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
      {(systemCount ?? 0) === 0 && (
        <Card accent className="text-center py-12 px-6">
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
