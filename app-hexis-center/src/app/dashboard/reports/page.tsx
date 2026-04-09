/**
 * Reports Page — ORIENT Step 6: Track
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Lists all systems with their compliance scores
 * and links to per-system track pages for report generation.
 */

import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, Badge, Button } from "@/components/ui";

export const dynamic = "force-dynamic";

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

export default async function ReportsPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch all systems for the current user's org
  const { data: systems } = await supabase
    .from("ai_systems")
    .select("id, name, purpose")
    .order("created_at", { ascending: false });

  if (!systems || systems.length === 0) {
    return (
      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="font-heading text-2xl text-foreground border-b border-primary pb-2 inline-block">
            Reports
          </h1>
          <p className="text-muted-foreground mt-3">
            Generate compliance reports for your organisation.
          </p>
        </div>
        <Card accent className="text-center py-12 px-6">
          <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
            No Systems
          </p>
          <h3 className="font-heading text-xl text-foreground mb-2">
            Register your first AI system
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            Start with ORIENT Step 1 to register an AI system, then work through
            the compliance steps to generate reports.
          </p>
          <Link href="/dashboard/systems/new">
            <Button size="sm">Register AI System</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Fetch latest classification + snapshot for each system
  const systemIds = systems.map((s) => s.id);

  const [classificationsRes, snapshotsRes, actionsCountRes] = await Promise.all([
    supabase
      .from("risk_classifications")
      .select("system_id, risk_level")
      .in("system_id", systemIds)
      .order("classified_at", { ascending: false }),
    supabase
      .from("compliance_snapshots")
      .select("system_id, score, snapshot_at")
      .in("system_id", systemIds)
      .order("snapshot_at", { ascending: false }),
    supabase
      .from("actions")
      .select("system_id", { count: "exact" })
      .in("system_id", systemIds),
  ]);

  // Build lookup maps (latest per system)
  const classificationMap = new Map<string, string>();
  for (const c of (classificationsRes.data ?? []) as Array<{ system_id: string; risk_level: string }>) {
    if (!classificationMap.has(c.system_id)) {
      classificationMap.set(c.system_id, c.risk_level);
    }
  }

  const snapshotMap = new Map<string, { score: number; snapshot_at: string }>();
  for (const s of (snapshotsRes.data ?? []) as Array<{ system_id: string; score: number; snapshot_at: string }>) {
    if (!snapshotMap.has(s.system_id)) {
      snapshotMap.set(s.system_id, { score: s.score, snapshot_at: s.snapshot_at });
    }
  }

  // Check which systems have completed Navigate (have actions)
  const actionsSet = new Set<string>();
  for (const a of (actionsCountRes.data ?? []) as Array<{ system_id: string }>) {
    actionsSet.add(a.system_id);
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl text-foreground border-b border-primary pb-2 inline-block">
          Reports
        </h1>
        <p className="text-muted-foreground mt-3">
          Generate compliance reports for your organisation&apos;s AI systems.
        </p>
      </div>

      <div className="space-y-3">
        {(systems as Array<{ id: string; name: string; purpose: string | null }>).map((system) => {
          const riskLevel = classificationMap.get(system.id);
          const snapshot = snapshotMap.get(system.id);
          const hasActions = actionsSet.has(system.id);
          const riskInfo = riskLevel ? RISK_BADGE[riskLevel] : null;

          return (
            <Card key={system.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-heading text-base text-foreground">
                      {system.name}
                    </h3>
                    {riskInfo && (
                      <Badge variant={riskInfo.variant}>{riskInfo.label}</Badge>
                    )}
                  </div>
                  {system.purpose && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {system.purpose}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {snapshot && (
                      <span>
                        Score: <span className="text-foreground font-heading">{snapshot.score}</span>/100
                        {" · "}
                        {new Date(snapshot.snapshot_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    )}
                    {!snapshot && !hasActions && (
                      <span>Complete ORIENT steps to generate reports</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {hasActions ? (
                    <Link href={`/dashboard/systems/${system.id}/track`}>
                      <Button size="sm" variant={snapshot ? "outline" : "default"}>
                        {snapshot ? "View Tracker" : "Start Tracking"}
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/dashboard/systems/${system.id}`}>
                      <Button size="sm" variant="outline">
                        Continue Setup
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
