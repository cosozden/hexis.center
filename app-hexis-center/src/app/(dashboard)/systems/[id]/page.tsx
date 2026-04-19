import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * System Detail — ORIENT step hub
 * Shows system info card + ORIENT step progress with navigation links.
 * Each step card shows completion status and links to the step page.
 */

const RISK_BADGE: Record<string, { label: string; className: string }> = {
  prohibited: { label: 'Prohibited', className: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  high: { label: 'High Risk', className: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
  limited: { label: 'Limited Risk', className: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  gpai: { label: 'GPAI', className: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
  minimal: { label: 'Minimal Risk', className: 'bg-green-500/10 text-green-400 border border-green-500/20' },
};

interface OrientStep {
  letter: string;
  name: string;
  description: string;
  href: string;
  status: 'completed' | 'available' | 'locked';
  detail?: string;
}

export default async function SystemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch system
  const { data: system } = await supabase
    .from('ai_systems')
    .select('*')
    .eq('id', id)
    .single();

  if (!system) notFound();

  // Fetch related data in parallel
  const [classificationRes, obligationsRes, assessmentRes, actionsRes] = await Promise.all([
    supabase
      .from('risk_classifications')
      .select('risk_level, article_references, classified_at')
      .eq('system_id', id)
      .order('classified_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('obligations')
      .select('id, status')
      .eq('system_id', id),
    supabase
      .from('assessments')
      .select('activation_posture, urgency_index, assessed_at')
      .eq('system_id', id)
      .order('assessed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('actions')
      .select('id, status')
      .eq('system_id', id),
  ]);

  const classification = classificationRes.data;
  const obligations = obligationsRes.data ?? [];
  const assessment = assessmentRes.data;
  const actions = actionsRes.data ?? [];

  const badge = classification ? RISK_BADGE[classification.risk_level] : null;
  const oblCompleted = obligations.filter(o => o.status === 'completed').length;
  const actCompleted = actions.filter(a => a.status === 'done').length;

  // Build ORIENT steps with status
  const steps: OrientStep[] = [
    {
      letter: 'O',
      name: 'Observe',
      description: 'Register and describe your AI system',
      href: `/dashboard/systems/${id}`,
      status: 'completed', // If system exists, Observe is done
      detail: system.purpose ? `"${system.purpose.slice(0, 60)}${system.purpose.length > 60 ? '...' : ''}"` : 'System registered',
    },
    {
      letter: 'R',
      name: 'Risk',
      description: 'Classify risk level per EU AI Act',
      href: `/dashboard/systems/${id}/classify`,
      status: classification ? 'completed' : 'available',
      detail: classification
        ? `${classification.risk_level} risk — ${(classification.article_references as string[] ?? []).length} articles`
        : 'Not classified yet',
    },
    {
      letter: 'I',
      name: 'Identify',
      description: 'Map applicable legal obligations',
      href: `/dashboard/systems/${id}/obligations`,
      status: obligations.length > 0 ? (oblCompleted === obligations.length ? 'completed' : 'available') : (classification ? 'available' : 'locked'),
      detail: obligations.length > 0
        ? `${oblCompleted}/${obligations.length} completed`
        : classification ? 'Ready to map obligations' : 'Complete Risk step first',
    },
    {
      letter: 'E',
      name: 'Evaluate',
      description: 'Assess current governance maturity',
      href: `/dashboard/systems/${id}/assess`,
      status: assessment ? 'completed' : (classification ? 'available' : 'locked'),
      detail: assessment
        ? `${assessment.activation_posture} — urgency ${assessment.urgency_index}`
        : classification ? 'Ready to assess' : 'Complete Risk step first',
    },
    {
      letter: 'N',
      name: 'Navigate',
      description: 'Build your compliance action plan',
      href: `/dashboard/systems/${id}/roadmap`,
      status: actions.length > 0 ? (actCompleted === actions.length ? 'completed' : 'available') : (assessment ? 'available' : 'locked'),
      detail: actions.length > 0
        ? `${actCompleted}/${actions.length} actions completed`
        : assessment ? 'Ready to generate plan' : 'Complete Evaluate step first',
    },
    {
      letter: 'T',
      name: 'Track',
      description: 'Monitor compliance progress',
      href: '/dashboard',
      status: actions.length > 0 ? 'available' : 'locked',
      detail: actions.length > 0 ? 'View dashboard' : 'Complete Navigate step first',
    },
  ];

  // Find next actionable step
  const nextStep = steps.find(s => s.status === 'available' && s.letter !== 'O');

  return (
    <div className="max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-dark-sub mb-6">
        <Link href="/dashboard/systems" className="hover:text-dark-type transition-colors">
          AI Systems
        </Link>
        <span>/</span>
        <span className="text-dark-type">{system.name}</span>
      </div>

      {/* System info card */}
      <div className="hexis-card mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl text-dark-type">{system.name}</h1>
              {badge && (
                <span className={`text-xs px-2 py-0.5 ${badge.className}`}>
                  {badge.label}
                </span>
              )}
            </div>
            {system.purpose && (
              <p className="text-dark-sub mt-2 max-w-2xl">{system.purpose}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div>
            <p className="label-upper mb-1">Role</p>
            <p className="text-sm text-dark-type">{system.organisation_role}</p>
          </div>
          <div>
            <p className="label-upper mb-1">Status</p>
            <p className="text-sm text-dark-type">{system.deployment_status}</p>
          </div>
          <div>
            <p className="label-upper mb-1">EU Market</p>
            <p className="text-sm text-dark-type">{system.eu_market ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="label-upper mb-1">Personal Data</p>
            <p className="text-sm text-dark-type">
              {system.processes_personal_data ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>

      {/* Next step CTA */}
      {nextStep && (
        <div className="hexis-card mb-8 border-l-2 border-l-brass">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-upper mb-1">Next Step</p>
              <p className="text-dark-type">
                <span className="font-heading text-brass mr-2">{nextStep.letter}</span>
                {nextStep.name} — {nextStep.description}
              </p>
            </div>
            <Link href={nextStep.href} className="hexis-btn hexis-btn-primary">
              Continue
            </Link>
          </div>
        </div>
      )}

      {/* ORIENT steps */}
      <div className="mb-4">
        <p className="label-upper mb-4">ORIENT Progress</p>
      </div>

      <div className="space-y-2">
        {steps.map(step => {
          const isLocked = step.status === 'locked';
          const isCompleted = step.status === 'completed';

          const Wrapper = isLocked ? 'div' : Link;
          const wrapperProps = isLocked
            ? {}
            : { href: step.href };

          return (
            <Wrapper
              key={step.letter}
              {...wrapperProps as Record<string, unknown>}
              className={`hexis-card flex items-center gap-4 transition-colors ${
                isLocked
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:border-border2 cursor-pointer'
              } ${isCompleted ? 'border-l-2 border-l-green-500/50' : ''}`}
            >
              {/* Step letter */}
              <div className={`w-10 h-10 flex items-center justify-center border ${
                isCompleted ? 'border-green-500/30 text-green-400' :
                isLocked ? 'border-border text-dark-sub' :
                'border-brass/30 text-brass'
              }`}>
                <span className="font-heading text-lg">{step.letter}</span>
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-dark-type font-medium">{step.name}</p>
                  {isCompleted && (
                    <span className="text-xs text-green-400">completed</span>
                  )}
                </div>
                <p className="text-sm text-dark-sub">{step.detail || step.description}</p>
              </div>

              {/* Arrow */}
              {!isLocked && (
                <span className="text-dark-sub text-sm shrink-0">&rarr;</span>
              )}
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
