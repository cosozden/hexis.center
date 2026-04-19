import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { RiskClassifierWizard } from '@/components/classifier/risk-classifier-wizard';

/**
 * Classify Page — ORIENT Step 2: Risk
 * Server Component wrapper for the Risk Classifier Wizard.
 * The wizard runs the deterministic classifier + optional Claude enrichment.
 */

export default async function ClassifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch system
  const { data: system } = await supabase
    .from('ai_systems')
    .select('id, name, purpose, organisation_role, eu_market')
    .eq('id', id)
    .single();

  if (!system) notFound();

  // Check if already classified
  const { data: existing } = await supabase
    .from('risk_classifications')
    .select('id, risk_level, classified_at')
    .eq('system_id', id)
    .order('classified_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="max-w-4xl">
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
        <span className="text-dark-type">Risk Classification</span>
      </div>

      {/* Re-classification notice */}
      {existing && (
        <div className="hexis-card mb-6 border-l-2 border-l-brass">
          <p className="text-dark-type font-medium">
            Previously classified as <span className="text-brass">{existing.risk_level}</span>
          </p>
          <p className="text-sm text-dark-sub mt-1">
            Re-running the wizard will create a new classification and may invalidate
            downstream ORIENT steps (Identify, Evaluate, Navigate).
          </p>
        </div>
      )}

      <RiskClassifierWizard
        systemId={id}
        systemName={system.name}
      />
    </div>
  );
}
