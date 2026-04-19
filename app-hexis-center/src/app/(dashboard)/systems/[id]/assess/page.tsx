import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { GovernanceMatrix } from '@/components/matrix/governance-matrix';
import type { ExposureLevel } from '@/lib/engines/matrix-engine';

/**
 * Assess Page — ORIENT Step 4: Evaluate
 * Server Component wrapper for the Governance Activation Matrix.
 * Fetches system, classification (for risk exposure), and previous assessment.
 */

// Map risk_level → ExposureLevel for the matrix
const RISK_TO_EXPOSURE: Record<string, ExposureLevel> = {
  prohibited: 'high',
  high: 'high',
  limited: 'moderate',
  gpai: 'elevated',
  minimal: 'low',
};

export default async function AssessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch system + classification + latest assessment in parallel
  const [systemRes, classificationRes, assessmentRes] = await Promise.all([
    supabase
      .from('ai_systems')
      .select('id, name, organisation_role')
      .eq('id', id)
      .single(),
    supabase
      .from('risk_classifications')
      .select('risk_level, classified_at')
      .eq('system_id', id)
      .order('classified_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('assessments')
      .select('id, oversight_level, monitoring_level, documentation_level, weighted_maturity, activation_posture, urgency_index, risk_exposure, ai_insight, assessed_at')
      .eq('system_id', id)
      .order('assessed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const system = systemRes.data;
  if (!system) notFound();

  const classification = classificationRes.data;
  const assessment = assessmentRes.data;

  // Risk classification required for the matrix
  if (!classification) {
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
          <span className="text-dark-type">Evaluate</span>
        </div>

        <div className="hexis-card text-center py-12">
          <p className="label-upper mb-3">Risk Classification Required</p>
          <h3 className="font-heading text-xl text-dark-type mb-2">
            Complete the Risk step first
          </h3>
          <p className="text-dark-sub max-w-md mx-auto mb-6">
            The Governance Activation Matrix needs a risk classification
            to determine the appropriate exposure level.
          </p>
          <Link href={`/dashboard/systems/${id}/classify`} className="hexis-btn hexis-btn-primary">
            Classify Risk
          </Link>
        </div>
      </div>
    );
  }

  const riskExposure = RISK_TO_EXPOSURE[classification.risk_level] ?? 'moderate';

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
        <span className="text-dark-type">Evaluate</span>
      </div>

      <GovernanceMatrix
        systemId={id}
        systemName={system.name}
        riskLevel={classification.risk_level}
        riskExposure={riskExposure}
        previousAssessment={assessment}
      />
    </div>
  );
}
