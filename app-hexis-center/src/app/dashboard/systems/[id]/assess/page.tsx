/**
 * Governance Assessment Page — ORIENT Step 4: Evaluate
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Server component that fetches system data and renders GovernanceMatrix.
 * Requires: classification (Step 2) completed.
 */

import { notFound, redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GovernanceMatrix } from "@/components/matrix/governance-matrix";
import { ChangeBanner } from "@/components/systems/change-banner";
import { ComplianceAdvisor } from "@/components/advisor/compliance-advisor";
import type { ExposureLevel } from "@/lib/engines/matrix-engine";

export const dynamic = "force-dynamic";

/** Map risk classification to exposure level for matrix input */
function riskToExposure(riskLevel: string): ExposureLevel {
  switch (riskLevel) {
    case "prohibited":
    case "high":
      return "high";
    case "limited":
    case "gpai":
      return "elevated";
    case "minimal":
    default:
      return "low";
  }
}

export default async function AssessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: systemId } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch system (including invalidation status)
  const { data: system } = await supabase
    .from("ai_systems")
    .select("id, name, purpose, organisation_role, invalidated_steps")
    .eq("id", systemId)
    .single();

  if (!system) notFound();

  // Fetch classification (required for Evaluate step)
  const { data: classification } = await supabase
    .from("risk_classifications")
    .select("risk_level, article_references")
    .eq("system_id", systemId)
    .order("classified_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Redirect to classify if no classification yet
  if (!classification) {
    redirect(`/dashboard/systems/${systemId}/classify`);
  }

  // Fetch most recent assessment (for delta comparison)
  const { data: previousAssessment } = await supabase
    .from("assessments")
    .select("*")
    .eq("system_id", systemId)
    .order("assessed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const riskExposure = riskToExposure(classification.risk_level);
  const invalidatedSteps = (system.invalidated_steps as string[]) ?? [];

  return (
    <>
      <ChangeBanner
        systemId={systemId}
        currentStep="evaluate"
        invalidatedSteps={invalidatedSteps}
        sourceStep="identify"
      />
      <GovernanceMatrix
        systemId={system.id}
        systemName={system.name}
        riskLevel={classification.risk_level}
        riskExposure={riskExposure}
        previousAssessment={previousAssessment}
      />
      <ComplianceAdvisor
        systemId={system.id}
        orientStep="evaluate"
        contextHint={`System "${system.name}" — ${classification.risk_level} risk, exposure: ${riskExposure}${previousAssessment ? ", has previous assessment for comparison" : ", first assessment"}`}
      />
    </>
  );
}
