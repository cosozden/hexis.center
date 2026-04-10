import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, Button } from "@/components/ui";
import { RiskClassifierWizard } from "@/components/classifier/risk-classifier-wizard";
import { ComplianceAdvisor } from "@/components/advisor/compliance-advisor";

export const dynamic = "force-dynamic";

/**
 * Risk Classification Page — ORIENT Step 2 (Risk)
 * Full interactive wizard powered by classifier-engine.ts (deterministic).
 */
export default async function ClassifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: system } = await supabase
    .from("ai_systems")
    .select("id, name")
    .eq("id", id)
    .single();

  if (!system) notFound();

  // Check if already classified
  const { data: classification } = await supabase
    .from("risk_classifications")
    .select("id, risk_level")
    .eq("system_id", id)
    .order("classified_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="max-w-2xl">
      <Link
        href={`/dashboard/systems/${id}`}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; Back to {system.name}
      </Link>

      <div className="mt-4">
        {classification ? (
          // Already classified — show result + option to reclassify
          <Card className="p-6">
            <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-2">
              Already Classified
            </p>
            <p className="text-sm text-foreground mb-1">
              This system has been classified as{" "}
              <span className="font-semibold capitalize">
                {classification.risk_level}
              </span>{" "}
              risk.
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              You can proceed to map your legal obligations or reclassify.
            </p>
            <div className="flex gap-3">
              <Link href={`/dashboard/systems/${id}/obligations`}>
                <Button size="sm">Map Obligations</Button>
              </Link>
              <Link href={`/dashboard/systems/${id}`}>
                <Button variant="outline" size="sm">
                  Back to System
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          // Not classified — show wizard
          <RiskClassifierWizard systemId={system.id} systemName={system.name} />
        )}
      </div>

      <ComplianceAdvisor
        systemId={system.id}
        orientStep="risk"
        contextHint={
          classification
            ? `System "${system.name}" classified as ${classification.risk_level} risk`
            : `User is classifying system "${system.name}" — risk level not yet determined`
        }
      />
    </div>
  );
}
