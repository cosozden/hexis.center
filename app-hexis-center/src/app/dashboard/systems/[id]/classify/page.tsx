/**
 * Risk Classification Page (Stub)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ORIENT Step 2 (Risk) — Classify risk level per EU AI Act.
 *
 * TODO: Implement full classification wizard (Art. 5, 6, 50, 51–56).
 * This stub ensures the /classify route resolves while the wizard is being built.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, Button } from "@/components/ui";

export const dynamic = "force-dynamic";

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

      <h1 className="font-heading text-2xl text-foreground mt-3 mb-6">
        Risk Classification
      </h1>

      {classification ? (
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
            You can proceed to map your legal obligations in the Identify stage.
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
        <Card className="p-6">
          <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-2">
            Coming Soon
          </p>
          <p className="text-sm text-foreground mb-1">
            The interactive Risk Classification Wizard is under development.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            It will walk you through EU AI Act Articles 5, 6, and 50 to determine
            your system&apos;s risk level, applicable obligations, and compliance deadlines.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            In the meantime, you can use the{" "}
            <a
              href="https://hexis.center/generator/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              hexis.center Risk Classifier
            </a>{" "}
            to determine your risk level.
          </p>
          <Link href={`/dashboard/systems/${id}`}>
            <Button variant="outline" size="sm">
              Back to System
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
