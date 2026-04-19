import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ActionPlan } from '@/components/roadmap/action-plan';

/**
 * Roadmap Page — ORIENT Step 5: Navigate
 * Server Component wrapper for the Action Plan generator.
 * Fetches system, risk classification, and existing actions.
 */

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch system + classification + assessment + actions in parallel
  const [systemRes, classificationRes, assessmentRes, actionsRes] = await Promise.all([
    supabase
      .from('ai_systems')
      .select('id, name, organisation_role')
      .eq('id', id)
      .single(),
    supabase
      .from('risk_classifications')
      .select('risk_level')
      .eq('system_id', id)
      .order('classified_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('assessments')
      .select('activation_posture, urgency_index, assessed_at')
      .eq('system_id', id)
      .order('assessed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('actions')
      .select('*')
      .eq('system_id', id)
      .order('sort_order', { ascending: true }),
  ]);

  const system = systemRes.data;
  if (!system) notFound();

  const classification = classificationRes.data;
  const assessment = assessmentRes.data;
  const actions = actionsRes.data ?? [];

  // Need at least Evaluate step completed
  if (!assessment) {
    return (
      <div className="max-w-4xl">
        <div className="flex items-center gap-2 text-sm text-dark-sub mb-6">
          <Link href="/dashboard/systems" className="hover:text-dark-type transition-colors">
            AI Systems
          </Link>
          <span>/</span>
          <Link href={`/dashboard/systems/${id}`} className="hover:text-dark-type transition-colors">
            {system.name}
          </Link>
          <span>/</span>
          <span className="text-dark-type">Navigate</span>
        </div>

        <div className="hexis-card text-center py-12">
          <p className="label-upper mb-3">Evaluation Required</p>
          <h3 className="font-heading text-xl text-dark-type mb-2">
            Complete the Evaluate step first
          </h3>
          <p className="text-dark-sub max-w-md mx-auto mb-6">
            The action plan generator needs your governance maturity assessment
            to create a prioritized roadmap.
          </p>
          <Link href={`/dashboard/systems/${id}/assess`} className="hexis-btn hexis-btn-primary">
            Start Assessment
          </Link>
        </div>
      </div>
    );
  }

  // Build plan summary from existing actions metadata (if available)
  const planSummary = actions.length > 0
    ? {
        executiveSummary: '', // Stored in first action's ai_reasoning or separate table
        criticalPath: '',
        resourceEstimate: null,
      }
    : null;

  return (
    <div className="max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-dark-sub mb-6">
        <Link href="/dashboard/systems" className="hover:text-dark-type transition-colors">
          AI Systems
        </Link>
        <span>/</span>
        <Link
          href={`/dashboard/systems/${id}`}
          className="hover:text-dark-type transition-colors"
        >
          {system.name}
        </Link>
        <span>/</span>
        <span className="text-dark-type">Navigate</span>
      </div>

      <ActionPlan
        systemId={id}
        systemName={system.name}
        riskLevel={classification?.risk_level ?? 'minimal'}
        initialActions={actions}
        initialPlan={planSummary}
      />
    </div>
  );
}
