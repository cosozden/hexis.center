/**
 * Action Plan / Roadmap Page — ORIENT Step 5: Navigate
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Server component that fetches all context and renders
 * the ActionPlan client component.
 *
 * Redirects to:
 * - /classify if no classification
 * - /obligations if no obligations
 * - /assess if no assessment
 */

import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ActionPlan } from "@/components/roadmap/action-plan";
import { ChangeBanner } from "@/components/systems/change-banner";

export const dynamic = "force-dynamic";

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch system (including invalidation status)
  const { data: system } = await supabase
    .from("ai_systems")
    .select("id, name, purpose, invalidated_steps")
    .eq("id", id)
    .single();

  if (!system) notFound();

  // Fetch classification
  const { data: classification } = await supabase
    .from("risk_classifications")
    .select("risk_level")
    .eq("system_id", id)
    .order("classified_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!classification) {
    redirect(`/dashboard/systems/${id}/classify`);
  }

  // Check obligations exist
  const { count: obligationCount } = await supabase
    .from("obligations")
    .select("id", { count: "exact", head: true })
    .eq("system_id", id);

  if ((obligationCount ?? 0) === 0) {
    redirect(`/dashboard/systems/${id}/obligations`);
  }

  // Check assessment exists
  const { data: assessment } = await supabase
    .from("assessments")
    .select("id")
    .eq("system_id", id)
    .order("assessed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!assessment) {
    redirect(`/dashboard/systems/${id}/assess`);
  }

  // Fetch existing actions (if plan was already generated)
  const { data: actions } = await supabase
    .from("actions")
    .select("id, title, description, priority, status, estimated_hours, dimension_impact, ai_reasoning, sort_order")
    .eq("system_id", id)
    .order("sort_order", { ascending: true });

  const invalidatedSteps = (system.invalidated_steps as string[]) ?? [];

  return (
    <>
      <ChangeBanner
        systemId={system.id}
        currentStep="navigate"
        invalidatedSteps={invalidatedSteps}
        sourceStep="evaluate"
      />
      <ActionPlan
        systemId={system.id}
        systemName={system.name}
        riskLevel={classification.risk_level}
        initialActions={actions ?? []}
        initialPlan={null}
      />
    </>
  );
}
