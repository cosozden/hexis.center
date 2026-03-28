import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Systems — HEXIS",
  description: "View and manage your registered AI systems.",
};

// ━━━ RISK BADGE CONFIG ━━━

const RISK_BADGE: Record<
  string,
  { label: string; variant: "prohibited" | "high" | "limited" | "gpai" | "minimal" | "default" }
> = {
  prohibited: { label: "Prohibited", variant: "prohibited" },
  high: { label: "High Risk", variant: "high" },
  limited: { label: "Limited Risk", variant: "limited" },
  gpai: { label: "GPAI", variant: "gpai" },
  minimal: { label: "Minimal Risk", variant: "minimal" },
};

const STATUS_LABEL: Record<string, string> = {
  planning: "Planning",
  development: "Development",
  testing: "Testing",
  production: "Production",
};

// ━━━ PAGE ━━━

export default async function SystemsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: systems, error } = await supabase
    .from("ai_systems")
    .select("id, name, purpose, risk_level, deployment_status, organisation_role, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl text-foreground">
            AI Systems
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Your registered AI systems and their compliance status.
          </p>
        </div>
        <Link
          href="/dashboard/systems/new"
          className="inline-flex items-center justify-center h-10 px-5 bg-primary text-primary-foreground font-medium text-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Register System
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className="border border-destructive/30 bg-destructive/5 p-4 mb-6">
          <p className="text-sm text-destructive">
            Failed to load systems. Please try again.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!error && (!systems || systems.length === 0) && (
        <div className="border border-border bg-card p-12 text-center">
          <p className="label-upper text-brass mb-3">No Systems Yet</p>
          <h3 className="font-heading text-xl text-foreground mb-2">
            Register your first AI system
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Start with the ORIENT flow: describe your AI system and we will
            guide you through risk classification, obligations, and compliance
            planning.
          </p>
          <Link
            href="/dashboard/systems/new"
            className="inline-flex items-center justify-center h-10 px-6 bg-primary text-primary-foreground font-medium text-sm transition-colors hover:bg-primary/90"
          >
            Register AI System
          </Link>
        </div>
      )}

      {/* System cards */}
      {systems && systems.length > 0 && (
        <div className="space-y-3">
          {systems.map((system) => {
            const riskInfo = system.risk_level
              ? RISK_BADGE[system.risk_level] || null
              : null;

            return (
              <Link
                key={system.id}
                href={`/dashboard/systems/${system.id}`}
                className="block border border-border bg-card p-5 transition-colors hover:bg-card-hover group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-heading text-lg text-foreground truncate group-hover:text-primary transition-colors">
                        {system.name}
                      </h3>
                      {riskInfo && (
                        <Badge variant={riskInfo.variant}>
                          {riskInfo.label}
                        </Badge>
                      )}
                    </div>
                    {system.purpose && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {system.purpose}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    {system.deployment_status && (
                      <p className="text-xs text-muted-foreground">
                        {STATUS_LABEL[system.deployment_status] || system.deployment_status}
                      </p>
                    )}
                    {system.organisation_role && (
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                        {system.organisation_role}
                      </p>
                    )}
                  </div>
                </div>

                {/* ORIENT progress indicator — placeholder */}
                <div className="mt-3 flex items-center gap-1">
                  {["O", "R", "I", "E", "N", "T"].map((letter, i) => (
                    <div
                      key={letter}
                      className={`w-6 h-6 flex items-center justify-center text-[10px] font-heading border ${
                        i === 0
                          ? "border-primary text-primary bg-primary/10"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {letter}
                    </div>
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">
                    Step 1 of 6
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
