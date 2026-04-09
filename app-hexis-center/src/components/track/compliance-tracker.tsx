/**
 * Compliance Tracker — ORIENT Step 6: Track
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Displays compliance score, component breakdown,
 * snapshot history, and report generation.
 *
 * Hybrid pattern: Deterministic score (score-engine) +
 * Claude report generation (generate-report API).
 *
 * UI: Hexis Web Palette dark theme. No border-radius, no shadows.
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Card, Badge, Button, Separator, Progress } from "@/components/ui";

// ━━━ TYPES ━━━

interface ComplianceScore {
  overall: number;
  components: {
    obligations: number;
    actions: number;
    governance: number;
    orientProgress: number;
  };
  level: "critical" | "low" | "developing" | "adequate" | "strong";
  summary: string;
  deadlineStatus: {
    label: string;
    daysLeft: number | null;
    urgent: boolean;
  } | null;
}

interface Snapshot {
  id: string;
  score: number;
  obligations_total: number;
  obligations_completed: number;
  actions_total: number;
  actions_completed: number;
  metadata: Record<string, unknown>;
  snapshot_at: string;
}

interface Report {
  audience: string;
  title: string;
  executive_summary: string;
  key_metrics: Array<{
    label: string;
    value: string;
    trend?: string;
  }>;
  risk_highlights?: string[];
  recommendations: string[];
  next_review_date?: string;
}

interface Props {
  systemId: string;
  systemName: string;
  riskLevel: string;
  initialScore: ComplianceScore | null;
  initialSnapshots: Snapshot[];
}

// ━━━ HELPERS ━━━

const LEVEL_COLORS: Record<string, string> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/30",
  low: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  developing: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  adequate: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  strong: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

const LEVEL_LABELS: Record<string, string> = {
  critical: "Critical",
  low: "Low",
  developing: "Developing",
  adequate: "Adequate",
  strong: "Strong",
};

const AUDIENCE_LABELS: Record<string, { label: string; description: string }> = {
  board: {
    label: "Board Summary",
    description: "1-page executive summary with risk focus",
  },
  dpo: {
    label: "DPO Report",
    description: "Detailed obligation tracking and gap analysis",
  },
  auditor: {
    label: "Auditor Report",
    description: "Article-referenced evidence documentation",
  },
};

const TREND_ICON: Record<string, string> = {
  improving: "↑",
  stable: "→",
  declining: "↓",
};

// ━━━ COMPONENT ━━━

export function ComplianceTracker({
  systemId,
  systemName,
  riskLevel,
  initialScore,
  initialSnapshots,
}: Props) {
  const [score, setScore] = useState<ComplianceScore | null>(initialScore);
  const [snapshots, setSnapshots] = useState<Snapshot[]>(initialSnapshots);
  const [report, setReport] = useState<Report | null>(null);
  const [snapshotLoading, setSnapshotLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState<string>("board");
  const [error, setError] = useState<string | null>(null);

  // ━━━ CREATE SNAPSHOT ━━━

  const createSnapshot = useCallback(async () => {
    setSnapshotLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/snapshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create snapshot");
      }
      const data = await res.json();
      setScore(data.score);
      setSnapshots((prev) => [data.snapshot, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create snapshot");
    } finally {
      setSnapshotLoading(false);
    }
  }, [systemId]);

  // Auto-snapshot on first load if no snapshots exist
  useEffect(() => {
    if (snapshots.length === 0 && !snapshotLoading && !score) {
      createSnapshot();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ━━━ GENERATE REPORT ━━━

  const generateReport = useCallback(async () => {
    setReportLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemId, audience: selectedAudience }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate report");
      }
      const data = await res.json();
      setReport(data.report);
      // Update score from report response (fresh calculation)
      if (data.score) setScore(data.score);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate report");
    } finally {
      setReportLoading(false);
    }
  }, [systemId, selectedAudience]);

  // ━━━ RENDER: NO SCORE YET ━━━

  if (!score && snapshotLoading) {
    return (
      <div className="max-w-3xl">
        <Link
          href={`/dashboard/systems/${systemId}`}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; {systemName}
        </Link>
        <div className="mt-3 mb-8">
          <h1 className="font-heading text-2xl text-foreground">
            Compliance Tracker
          </h1>
        </div>
        <Card accent className="p-8 text-center">
          <p className="text-sm text-muted-foreground animate-pulse">
            Calculating compliance score...
          </p>
        </Card>
      </div>
    );
  }

  // ━━━ RENDER: MAIN ━━━

  return (
    <div className="max-w-3xl">
      {/* Back link */}
      <Link
        href={`/dashboard/systems/${systemId}`}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; {systemName}
      </Link>

      {/* Header */}
      <div className="mt-3 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-2xl text-foreground">
            Compliance Tracker
          </h1>
          <Badge variant={riskLevel as 'high' | 'limited' | 'gpai' | 'minimal' | 'prohibited'}>
            {riskLevel}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          ORIENT Step 6 &mdash; Monitor your compliance progress and generate reports.
        </p>
      </div>

      {/* Error display */}
      {error && (
        <Card className="p-4 mb-6 border-red-500/30 bg-red-500/5">
          <p className="text-sm text-red-400">{error}</p>
        </Card>
      )}

      {/* ━━━ COMPLIANCE SCORE ━━━ */}
      {score && (
        <Card accent className="p-5 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-2">
                Compliance Score
              </p>
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-4xl text-foreground">
                  {score.overall}
                </span>
                <span className="text-muted-foreground text-sm">/100</span>
                <span
                  className={`text-xs px-2 py-0.5 border ${LEVEL_COLORS[score.level]}`}
                >
                  {LEVEL_LABELS[score.level]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {score.summary}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={createSnapshot}
              disabled={snapshotLoading}
            >
              {snapshotLoading ? "Saving..." : "Save Snapshot"}
            </Button>
          </div>

          {/* Deadline warning */}
          {score.deadlineStatus && (
            <div
              className={`text-xs px-3 py-2 mb-4 border ${
                score.deadlineStatus.urgent
                  ? "border-red-500/30 bg-red-500/5 text-red-400"
                  : "border-yellow-500/30 bg-yellow-500/5 text-yellow-400"
              }`}
            >
              {score.deadlineStatus.label} &mdash;{" "}
              {score.deadlineStatus.daysLeft !== null
                ? score.deadlineStatus.daysLeft > 0
                  ? `${score.deadlineStatus.daysLeft} days remaining`
                  : "Deadline passed"
                : "No deadline set"}
              {score.deadlineStatus.urgent && " — Action required"}
            </div>
          )}

          {/* Component breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <ComponentBar
              label="Obligations"
              value={score.components.obligations}
              weight="40%"
            />
            <ComponentBar
              label="Actions"
              value={score.components.actions}
              weight="25%"
            />
            <ComponentBar
              label="Governance"
              value={score.components.governance}
              weight="20%"
            />
            <ComponentBar
              label="ORIENT Progress"
              value={score.components.orientProgress}
              weight="15%"
            />
          </div>
        </Card>
      )}

      {/* ━━━ SNAPSHOT HISTORY ━━━ */}
      {snapshots.length > 0 && (
        <Card className="p-5 mb-6">
          <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
            Score History
          </p>
          <div className="space-y-2">
            {snapshots.slice(0, 10).map((snap) => (
              <div
                key={snap.id}
                className="flex items-center justify-between text-sm border-b border-border last:border-0 pb-2 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span className="font-heading text-lg text-foreground w-10">
                    {snap.score}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Obligations: {snap.obligations_completed}/{snap.obligations_total}
                    {" · "}
                    Actions: {snap.actions_completed}/{snap.actions_total}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(snap.snapshot_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
          {snapshots.length > 10 && (
            <p className="text-xs text-muted-foreground mt-2">
              Showing latest 10 of {snapshots.length} snapshots
            </p>
          )}
        </Card>
      )}

      <Separator className="my-6" />

      {/* ━━━ REPORT GENERATION ━━━ */}
      <div className="mb-6">
        <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
          Generate Report
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Same compliance data, adapted for different audiences.
          Claude generates a structured report based on your ORIENT data.
        </p>

        {/* Audience selector */}
        <div className="flex gap-2 mb-4">
          {Object.entries(AUDIENCE_LABELS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedAudience(key);
                setReport(null);
              }}
              className={`text-xs px-3 py-1.5 border transition-colors ${
                selectedAudience === key
                  ? "border-primary text-primary bg-primary/5"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          {AUDIENCE_LABELS[selectedAudience]?.description}
        </p>

        <Button
          size="sm"
          onClick={generateReport}
          disabled={reportLoading}
        >
          {reportLoading
            ? "Generating report..."
            : `Generate ${AUDIENCE_LABELS[selectedAudience]?.label}`}
        </Button>
      </div>

      {/* ━━━ REPORT DISPLAY ━━━ */}
      {report && (
        <Card accent className="p-5 mb-6">
          <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-2">
            {AUDIENCE_LABELS[report.audience]?.label || report.audience}
          </p>
          <h3 className="font-heading text-lg text-foreground mb-3">
            {report.title}
          </h3>

          {/* Executive summary */}
          <p className="text-sm text-foreground/90 mb-4 leading-relaxed">
            {report.executive_summary}
          </p>

          {/* Key metrics */}
          {report.key_metrics && report.key_metrics.length > 0 && (
            <>
              <Separator className="my-4" />
              <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-3">
                Key Metrics
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {report.key_metrics.map((metric, i) => (
                  <div key={i} className="border border-border p-3">
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-lg text-foreground">
                        {metric.value}
                      </span>
                      {metric.trend && (
                        <span
                          className={`text-xs ${
                            metric.trend === "improving"
                              ? "text-emerald-400"
                              : metric.trend === "declining"
                                ? "text-red-400"
                                : "text-muted-foreground"
                          }`}
                        >
                          {TREND_ICON[metric.trend]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Risk highlights */}
          {report.risk_highlights && report.risk_highlights.length > 0 && (
            <>
              <Separator className="my-4" />
              <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-3">
                Risk Highlights
              </p>
              <div className="space-y-2 mb-4">
                {report.risk_highlights.map((risk, i) => (
                  <div key={i} className="text-sm text-foreground/90 pl-3 border-l-2 border-red-500/30">
                    {risk}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Recommendations */}
          {report.recommendations && report.recommendations.length > 0 && (
            <>
              <Separator className="my-4" />
              <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-3">
                Recommendations
              </p>
              <div className="space-y-2 mb-4">
                {report.recommendations.map((rec, i) => (
                  <div key={i} className="text-sm text-foreground/90 pl-3 border-l-2 border-primary/30">
                    <span className="text-primary font-heading mr-2">{i + 1}.</span>
                    {rec}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Next review date */}
          {report.next_review_date && (
            <p className="text-xs text-muted-foreground mt-4">
              Suggested next review: {report.next_review_date}
            </p>
          )}
        </Card>
      )}

      {/* ━━━ NAVIGATION ━━━ */}
      <div className="flex items-center justify-between mt-8">
        <Link
          href={`/dashboard/systems/${systemId}/roadmap`}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Action Plan
        </Link>
        <Link
          href={`/dashboard/systems/${systemId}`}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          System Overview &rarr;
        </Link>
      </div>
    </div>
  );
}

// ━━━ SUB-COMPONENTS ━━━

function ComponentBar({
  label,
  value,
  weight,
}: {
  label: string;
  value: number;
  weight: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs text-foreground">
          {Math.round(value)}{" "}
          <span className="text-muted-foreground">({weight})</span>
        </span>
      </div>
      <div className="h-1.5 bg-border">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}
