import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, Badge, Button, Separator } from "@/components/ui";

export const dynamic = "force-dynamic";

// ━━━ RISK BADGE ━━━

const RISK_BADGE: Record<
  string,
  { label: string; variant: "prohibited" | "high" | "limited" | "gpai" | "minimal" }
> = {
  prohibited: { label: "Prohibited", variant: "prohibited" },
  high: { label: "High Risk", variant: "high" },
  limited: { label: "Limited Risk", variant: "limited" },
  gpai: { label: "GPAI", variant: "gpai" },
  minimal: { label: "Minimal Risk", variant: "minimal" },
};

const ROLE_LABEL: Record<string, string> = {
  provider: "Provider",
  deployer: "Deployer",
  both: "Provider & Deployer",
};

const STATUS_LABEL: Record<string, string> = {
  planning: "Planning",
  development: "Development",
  testing: "Testing",
  production: "Production",
  retired: "Retired",
};

// ━━━ ORIENT STEPS ━━━

interface OrientStep {
  letter: string;
  name: string;
  hint: string;
  status: "done" | "next" | "locked";
}

function buildOrientSteps(hasClassification: boolean, hasObligations: boolean): OrientStep[] {
  return [
    {
      letter: "O",
      name: "Observe",
      hint: "System registered",
      status: "done",
    },
    {
      letter: "R",
      name: "Risk",
      hint: hasClassification ? "Classified" : "Classify risk level",
      status: hasClassification ? "done" : "next",
    },
    {
      letter: "I",
      name: "Identify",
      hint: hasObligations ? "Obligations mapped" : "Map obligations",
      status: hasObligations ? "done" : hasClassification ? "next" : "locked",
    },
    {
      letter: "E",
      name: "Evaluate",
      hint: "Assess gaps",
      status: hasObligations ? "next" : "locked",
    },
    {
      letter: "N",
      name: "Navigate",
      hint: "Plan actions",
      status: "locked",
    },
    {
      letter: "T",
      name: "Track",
      hint: "Monitor progress",
      status: "locked",
    },
  ];
}

// ━━━ PAGE ━━━

export default async function SystemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: system } = await supabase
    .from("ai_systems")
    .select("*")
    .eq("id", id)
    .single();

  if (!system) notFound();

  const { data: classification } = await supabase
    .from("risk_classifications")
    .select("*")
    .eq("system_id", id)
    .order("classified_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Fetch obligation count for ORIENT progress
  const { count: obligationCount } = await supabase
    .from("obligations")
    .select("id", { count: "exact", head: true })
    .eq("system_id", id);

  const hasClassification = !!classification;
  const hasObligations = (obligationCount ?? 0) > 0;
  const steps = buildOrientSteps(hasClassification, hasObligations);
  const riskInfo = classification ? RISK_BADGE[classification.risk_level] : null;
  const completedCount = steps.filter((s) => s.status === "done").length;

  return (
    <div className="max-w-3xl">
      {/* Back link */}
      <Link
        href="/dashboard/systems"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; All Systems
      </Link>

      {/* System name + badge */}
      <div className="mt-3 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-2xl text-foreground">
            {system.name}
          </h1>
          {riskInfo && (
            <Badge variant={riskInfo.variant}>{riskInfo.label}</Badge>
          )}
        </div>
        {system.purpose && (
          <p className="text-sm text-muted-foreground mt-2">
            {system.purpose}
          </p>
        )}
      </div>

      {/* ━━━ ORIENT PROGRESS ━━━ */}
      <div className="mb-8">
        <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
          Compliance Progress &mdash; {completedCount} of 6
        </p>

        <div className="flex gap-1">
          {steps.map((step) => (
            <div
              key={step.letter}
              className={`flex-1 border p-3 ${
                step.status === "done"
                  ? "border-primary bg-primary/5"
                  : step.status === "next"
                    ? "border-primary/40"
                    : "border-border opacity-40"
              }`}
            >
              <span
                className={`font-heading text-base ${
                  step.status === "done"
                    ? "text-primary"
                    : step.status === "next"
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {step.letter}
              </span>
              <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground mt-1">
                {step.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ━━━ NEXT ACTION ━━━ */}
      {!hasClassification ? (
        <Card accent className="p-5 mb-8">
          <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-2">
            Next Step
          </p>
          <p className="text-sm text-foreground mb-1">
            Classify your system&apos;s risk level under the EU AI Act.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            The risk classifier will walk you through Articles 5, 6, and 50 to determine
            your obligations and deadlines.
          </p>
          <Link href={`/dashboard/systems/${system.id}/classify`}>
            <Button size="sm">Start Risk Classification</Button>
          </Link>
        </Card>
      ) : (
        <Card accent className="p-5 mb-8">
          <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-2">
            Next Step
          </p>
          <p className="text-sm text-foreground mb-1">
            Identify your legal obligations based on the classification result.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Map specific EU AI Act articles and requirements to your system based on
            your risk level and organisation role.
          </p>
          <Link href={`/dashboard/systems/${system.id}/obligations`}>
            <Button size="sm">Map Obligations</Button>
          </Link>
        </Card>
      )}

      {/* ━━━ CLASSIFICATION RESULT ━━━ */}
      {classification && (
        <Card className="p-5 mb-6">
          <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
            Risk Classification Result
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex gap-3">
              <span className="text-muted-foreground w-24 shrink-0">Level</span>
              {riskInfo && <Badge variant={riskInfo.variant}>{riskInfo.label}</Badge>}
            </div>

            {Array.isArray(classification.article_references) &&
              classification.article_references.length > 0 && (
                <div className="flex gap-3">
                  <span className="text-muted-foreground w-24 shrink-0">Articles</span>
                  <span className="text-foreground">
                    {classification.article_references.join(", ")}
                  </span>
                </div>
              )}

            {classification.exception_applied && classification.exception_details && (
              <div className="flex gap-3">
                <span className="text-muted-foreground w-24 shrink-0">Exception</span>
                <span className="text-foreground">{classification.exception_details}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ━━━ SYSTEM INFO ━━━ */}
      <Card className="p-5">
        <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
          System Information
        </p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Role</p>
            <p className="text-foreground">
              {ROLE_LABEL[system.organisation_role] || system.organisation_role}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-foreground">
              {STATUS_LABEL[system.deployment_status] || system.deployment_status}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">EU Market</p>
            <p className="text-foreground">{system.eu_market ? "Yes" : "No"}</p>
          </div>

          {system.provider && (
            <div>
              <p className="text-xs text-muted-foreground">Provider</p>
              <p className="text-foreground">{system.provider}</p>
            </div>
          )}

          {system.deployment_type && (
            <div>
              <p className="text-xs text-muted-foreground">Deployment</p>
              <p className="text-foreground capitalize">{system.deployment_type}</p>
            </div>
          )}

          {system.responsible_person && (
            <div>
              <p className="text-xs text-muted-foreground">Responsible</p>
              <p className="text-foreground">{system.responsible_person}</p>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <p className="text-xs text-muted-foreground">
          Registered{" "}
          {new Date(system.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </Card>
    </div>
  );
}
