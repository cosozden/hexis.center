import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ObligationsTracker } from '@/components/obligations/obligations-tracker';

/**
 * Obligations Page — ORIENT Step 3: Identify
 * Server Component wrapper that fetches system data + obligations
 * and passes them to the interactive ObligationsTracker client component.
 */

export default async function ObligationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch system + classification + obligations in parallel
  const [systemRes, classificationRes, obligationsRes] = await Promise.all([
    supabase
      .from('ai_systems')
      .select('id, name, organisation_role, eu_market, processes_personal_data')
      .eq('id', id)
      .single(),
    supabase
      .from('risk_classifications')
      .select('risk_level, article_references, classified_at')
      .eq('system_id', id)
      .order('classified_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('obligations')
      .select('*')
      .eq('system_id', id)
      .order('sort_order', { ascending: true }),
  ]);

  const system = systemRes.data;
  if (!system) notFound();

  const classification = classificationRes.data;
  const obligations = obligationsRes.data ?? [];

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
        <span className="text-dark-type">Identify</span>
      </div>

      {/* No classification warning */}
      {!classification && (
        <div className="hexis-card mb-6 border-l-2 border-l-orange-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-type font-medium">Risk classification required</p>
              <p className="text-sm text-dark-sub mt-1">
                Complete the Risk step first to identify applicable obligations.
              </p>
            </div>
            <Link
              href={`/dashboard/systems/${id}/classify`}
              className="hexis-btn hexis-btn-primary"
            >
              Classify Risk
            </Link>
          </div>
        </div>
      )}

      <ObligationsTracker
        systemId={id}
        systemName={system.name}
        organisationRole={system.organisation_role ?? 'deployer'}
        riskLevel={classification?.risk_level ?? null}
        initialObligations={obligations}
        hasClassification={!!classification}
      />
    </div>
  );
}
