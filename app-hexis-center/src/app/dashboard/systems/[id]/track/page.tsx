/**
 * Compliance Tracker Page — ORIENT Step 6: Track
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Server component that fetches all context and renders
 * the ComplianceTracker client component.
 *
 * Prerequisite chain:
 * - Classification required (Step 2)
 * - Obligations required (Step 3)
 * - Assessment required (Step 4)
 * - Actions required (Step 5)
 */

import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ComplianceTracker } from "@/components/track/compliance-tracker";
import {
  calculateComplianceScore,
  type ScoreInput,
} from "@/lib/engines/score-engine";

export const dynamic = "force-dynamic";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch system
  const { data: system } = await supabase
    .from("ai_systems")
    .select("id, name, purpose")
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
  const { data: obligations } = await supabase
    .from("obligations")
    .select("id, status")
    .eq("system_id", id);

  if (!obligations || obligations.length === 0) {
    redirect(`/dashboard/systems/${id}/obligations`);
  }

  // Check assessment exists
  const { data: assessment } = await supabase
    .from("assessments")
    .select("oversight_level, monitoring_level, documentation_level")
    .eq("system_id", id)
    .order("assessed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!assessment) {
    redirect(`/dashboard/systems/${id}/assess`);
  }

  // Check actions exist
  const { data: actions } = await supabase
    .from("actions")
    .select("id, status")
    .eq("system_id", id);

  if (!actions || actions.length === 0) {
    redirect(`/dashboard/systems/${id}/roadmap`);
  }

  // Calculate initial score
  const obligationsTyped = obligations as Array<{ id: string; status: string }>;
  const actionsTyped = actions as Array<{ id: string; status: string }>;
  const assessmentTyped = assessment as {
    oversight_level: number;
    monitoring_level: number;
    documentation_level: number;
  };

  const scoreInput: ScoreInput = {
    riskLevel: classification.risk_level,
    obligations: {
      total: obligationsTyped.length,
      completed: obligationsTyped.filter((o) => o.status === "completed").length,
      inProgress: obligationsTyped.filter((o) => o.status === "in_progress").length,
      notApplicable: obligationsTyped.filter((o) => o.status === "not_applicable").length,
    },
    actions: {
      total: actionsTyped.length,
      completed: actionsTyped.filter((a) => a.status === "done").length,
      inProgress: actionsTyped.filter((a) => a.status === "in_progress").length,
    },
    assessment: {
      oversightLevel: assessmentTyped.oversight_level,
      monitoringLevel: assessmentTyped.monitoring_level,
      documentationLevel: assessmentTyped.documentation_level,
    },
    orientSteps: {
      observe: true,
      risk: true,
      identify: true,
      evaluate: true,
      navigate: true,
      track: true,
    },
  };

  const initialScore = calculateComplianceScore(scoreInput);

  // Fetch existing snapshots
  const { data: snapshots } = await supabase
    .from("compliance_snapshots")
    .select("id, score, obligations_total, obligations_completed, actions_total, actions_completed, metadata, snapshot_at")
    .eq("system_id", id)
    .order("snapshot_at", { ascending: false })
    .limit(30);

  return (
    <ComplianceTracker
      systemId={system.id}
      systemName={system.name}
      riskLevel={classification.risk_level}
      initialScore={initialScore}
      initialSnapshots={snapshots ?? []}
    />
  );
}
