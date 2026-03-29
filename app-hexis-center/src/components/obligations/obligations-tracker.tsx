"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, Badge, Button, Separator, Progress } from "@/components/ui";
import { getCategoryLabel, getCategoryOrder } from "@/lib/engines/obligation-engine";
import type { Database } from "@/types/database";

// ━━━ TYPES ━━━

type Obligation = Database["public"]["Tables"]["obligations"]["Row"];
type ObligationStatus = "not_started" | "in_progress" | "completed" | "not_applicable";

interface GuidanceResponse {
  guidance: {
    summary: string;
    steps: { step: number; action: string; details: string }[];
    evidence_suggestions: string[];
    common_pitfalls: string[];
    sme_tip: string;
    confidence: string;
  } | null;
  cached: boolean;
  meta: { engine: string; model?: string; latencyMs: number };
}

interface Props {
  systemId: string;
  systemName: string;
  organisationRole: string;
  riskLevel: string | null;
  initialObligations: Obligation[];
  hasClassification: boolean;
}

// ━━━ STATUS CONFIG ━━━

const STATUS_CONFIG: Record<
  ObligationStatus,
  { label: string; dot: string; bg: string }
> = {
  not_started: { label: "Not Started", dot: "bg-muted-foreground/40", bg: "" },
  in_progress: { label: "In Progress", dot: "bg-primary", bg: "border-l-2 border-l-primary" },
  completed: { label: "Completed", dot: "bg-green-500", bg: "border-l-2 border-l-green-500 opacity-75" },
  not_applicable: { label: "N/A", dot: "bg-muted-foreground/20", bg: "opacity-50" },
};

const RISK_BADGE: Record<string, { label: string; className: string }> = {
  prohibited: { label: "Prohibited", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  high: { label: "High Risk", className: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  limited: { label: "Limited Risk", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  gpai: { label: "GPAI", className: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  minimal: { label: "Minimal Risk", className: "bg-green-500/10 text-green-400 border-green-500/20" },
};

const ROLE_LABEL: Record<string, string> = {
  provider: "Provider",
  deployer: "Deployer",
  both: "Provider & Deployer",
};

// ━━━ COMPONENT ━━━

export function ObligationsTracker({
  systemId,
  systemName,
  organisationRole,
  riskLevel,
  initialObligations,
  hasClassification,
}: Props) {
  const [obligations, setObligations] = useState<Obligation[]>(initialObligations);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [guidanceLoading, setGuidanceLoading] = useState<string | null>(null);
  const [guidanceData, setGuidanceData] = useState<Record<string, GuidanceResponse["guidance"]>>({});

  // ── Auto-seed on first visit ──
  useEffect(() => {
    if (hasClassification && obligations.length === 0 && !seeding) {
      seedObligations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seedObligations = useCallback(async (force = false) => {
    setSeeding(true);
    setError(null);
    try {
      const resp = await fetch("/api/obligations/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemId, force }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || "Failed to create obligations");
        return;
      }
      setObligations(data.obligations);
    } catch {
      setError("Network error — please try again");
    } finally {
      setSeeding(false);
    }
  }, [systemId]);

  const updateStatus = useCallback(async (obligationId: string, status: ObligationStatus) => {
    // Optimistic update
    setObligations((prev) =>
      prev.map((o) =>
        o.id === obligationId
          ? { ...o, status, completed_at: status === "completed" ? new Date().toISOString() : null }
          : o,
      ),
    );

    try {
      const resp = await fetch(`/api/obligations/${obligationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!resp.ok) {
        // Revert on error
        setObligations((prev) =>
          prev.map((o) =>
            o.id === obligationId ? { ...o, status: "not_started", completed_at: null } : o,
          ),
        );
      }
    } catch {
      // Revert on network error
      setObligations((prev) =>
        prev.map((o) =>
          o.id === obligationId ? { ...o, status: "not_started", completed_at: null } : o,
        ),
      );
    }
  }, []);

  const updateNotes = useCallback(async (obligationId: string, notes: string) => {
    try {
      await fetch(`/api/obligations/${obligationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evidence_notes: notes }),
      });
      setObligations((prev) =>
        prev.map((o) => (o.id === obligationId ? { ...o, evidence_notes: notes } : o)),
      );
    } catch {
      // Silent fail for notes — non-critical
    }
  }, []);

  const getGuidance = useCallback(async (obligationId: string) => {
    setGuidanceLoading(obligationId);
    try {
      const resp = await fetch("/api/ai/obligation-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ obligationId }),
      });
      const data: GuidanceResponse = await resp.json();
      if (data.guidance) {
        setGuidanceData((prev) => ({ ...prev, [obligationId]: data.guidance }));
      }
    } catch {
      // Silent fail
    } finally {
      setGuidanceLoading(null);
    }
  }, []);

  // ── Stats ──
  const total = obligations.length;
  const completed = obligations.filter((o) => o.status === "completed").length;
  const inProgress = obligations.filter((o) => o.status === "in_progress").length;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // ── Group by category ──
  const grouped = groupByCategory(obligations);

  // ── No classification state ──
  if (!hasClassification) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Classification Required
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Complete the Risk Classification before mapping obligations.
          </p>
          <Link href={`/dashboard/systems/${systemId}/classify`}>
            <Button>Classify Risk Level</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-semibold text-foreground">
              Obligation Mapping
            </h1>
            {riskLevel && RISK_BADGE[riskLevel] && (
              <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border rounded ${RISK_BADGE[riskLevel].className}`}>
                {RISK_BADGE[riskLevel].label}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {systemName} · {ROLE_LABEL[organisationRole] || organisationRole}
          </p>
        </div>
        <Link href={`/dashboard/systems/${systemId}`}>
          <Button variant="outline" size="sm">
            ← Back to System
          </Button>
        </Link>
      </div>

      {/* ── Progress bar ── */}
      {total > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {completed}/{total} completed
            </span>
            <span className="text-sm text-muted-foreground">{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-2" />
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            <span>{inProgress} in progress</span>
            <span>{total - completed - inProgress} remaining</span>
          </div>
        </Card>
      )}

      {/* ── Error state ── */}
      {error && (
        <Card className="p-4 border-red-500/20 bg-red-500/5">
          <p className="text-sm text-red-400">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => seedObligations()}
          >
            Retry
          </Button>
        </Card>
      )}

      {/* ── Loading state ── */}
      {seeding && (
        <Card className="p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-48 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Generating obligations based on your risk classification...
            </p>
          </div>
        </Card>
      )}

      {/* ── Obligations grouped by category ── */}
      {grouped.map(({ category, label, items }) => (
        <div key={category}>
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
            {label}
          </h2>
          <div className="space-y-2">
            {items.map((obligation) => (
              <ObligationRow
                key={obligation.id}
                obligation={obligation}
                isExpanded={expandedId === obligation.id}
                onToggle={() =>
                  setExpandedId(expandedId === obligation.id ? null : obligation.id)
                }
                onStatusChange={(status) => updateStatus(obligation.id, status)}
                onNotesChange={(notes) => updateNotes(obligation.id, notes)}
                onGetGuidance={() => getGuidance(obligation.id)}
                guidanceLoading={guidanceLoading === obligation.id}
                guidance={guidanceData[obligation.id] ?? null}
              />
            ))}
          </div>
        </div>
      ))}

      {/* ── Actions ── */}
      {total > 0 && (
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => seedObligations(true)}
            disabled={seeding}
          >
            Re-generate Obligations
          </Button>
          <Link href={`/dashboard/systems/${systemId}`}>
            <Button size="sm">Back to System Details</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

// ━━━ OBLIGATION ROW ━━━

function ObligationRow({
  obligation,
  isExpanded,
  onToggle,
  onStatusChange,
  onNotesChange,
  onGetGuidance,
  guidanceLoading,
  guidance,
}: {
  obligation: Obligation;
  isExpanded: boolean;
  onToggle: () => void;
  onStatusChange: (status: ObligationStatus) => void;
  onNotesChange: (notes: string) => void;
  onGetGuidance: () => void;
  guidanceLoading: boolean;
  guidance: GuidanceResponse["guidance"] | null;
}) {
  const status = obligation.status as ObligationStatus;
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.not_started;
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(obligation.evidence_notes ?? "");

  return (
    <Card className={`transition-all ${config.bg}`}>
      {/* ── Collapsed row ── */}
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex items-center gap-3"
      >
        {/* Status dot */}
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${config.dot}`} />

        {/* Title + article */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {obligation.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {obligation.article_reference}
            {obligation.applies_to !== "all" && (
              <span className="ml-2 text-[10px] uppercase tracking-wider opacity-60">
                {obligation.applies_to}
              </span>
            )}
          </p>
        </div>

        {/* Status badge */}
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
          {config.label}
        </span>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Expanded content ── */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <Separator />

          {/* Description */}
          {obligation.description && (
            <p className="text-sm text-muted-foreground">{obligation.description}</p>
          )}

          {/* Deadline */}
          {obligation.deadline && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Deadline:</span>{" "}
              {new Date(obligation.deadline).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {obligation.deadline_source && (
                <span className="opacity-60"> — {obligation.deadline_source}</span>
              )}
            </div>
          )}

          {/* Status selector */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Status
            </p>
            <div className="flex gap-2">
              {(
                ["not_started", "in_progress", "completed", "not_applicable"] as ObligationStatus[]
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  className={`px-3 py-1.5 text-xs rounded transition-colors ${
                    status === s
                      ? "bg-foreground text-background font-medium"
                      : "bg-card hover:bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-muted-foreground">
                Evidence / Notes
              </p>
              {!editingNotes && (
                <button
                  onClick={() => setEditingNotes(true)}
                  className="text-xs text-primary hover:underline"
                >
                  {obligation.evidence_notes ? "Edit" : "Add notes"}
                </button>
              )}
            </div>
            {editingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  className="w-full p-2 text-sm bg-background border border-border rounded min-h-[80px] text-foreground placeholder:text-muted-foreground"
                  placeholder="Document evidence, links to documentation, or implementation notes..."
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      onNotesChange(notesValue);
                      setEditingNotes(false);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNotesValue(obligation.evidence_notes ?? "");
                      setEditingNotes(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              obligation.evidence_notes && (
                <p className="text-sm text-muted-foreground bg-card p-2 rounded border border-border">
                  {obligation.evidence_notes}
                </p>
              )
            )}
          </div>

          {/* Get Guidance button */}
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={onGetGuidance}
              disabled={guidanceLoading}
            >
              {guidanceLoading
                ? "Getting guidance..."
                : guidance
                  ? "Refresh Guidance"
                  : "Get Guidance"}
            </Button>
          </div>

          {/* Guidance card */}
          {guidance && (
            <GuidanceCard guidance={guidance} />
          )}
        </div>
      )}
    </Card>
  );
}

// ━━━ GUIDANCE CARD ━━━

function GuidanceCard({
  guidance,
}: {
  guidance: NonNullable<GuidanceResponse["guidance"]>;
}) {
  return (
    <Card className="p-4 bg-primary/5 border-primary/10">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-[10px] text-primary font-bold">AI</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Implementation Guidance
        </span>
        {guidance.confidence === "seek_specialist" && (
          <span className="text-[10px] px-1.5 py-0.5 bg-orange-500/10 text-orange-400 rounded">
            Specialist recommended
          </span>
        )}
      </div>

      {/* Summary */}
      <p className="text-sm text-foreground mb-4">{guidance.summary}</p>

      {/* Steps */}
      {guidance.steps.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Implementation Steps
          </p>
          <ol className="space-y-2">
            {guidance.steps.map((s) => (
              <li key={s.step} className="text-sm">
                <span className="font-medium text-foreground">
                  {s.step}. {s.action}
                </span>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {s.details}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Evidence suggestions */}
      {guidance.evidence_suggestions.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Evidence to Keep
          </p>
          <ul className="space-y-1">
            {guidance.evidence_suggestions.map((e, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-primary mt-0.5">•</span>
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Common pitfalls */}
      {guidance.common_pitfalls.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Common Pitfalls
          </p>
          <ul className="space-y-1">
            {guidance.common_pitfalls.map((p, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-orange-400 mt-0.5">⚠</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SME Tip */}
      {guidance.sme_tip && (
        <div className="p-2 bg-primary/5 rounded border border-primary/10">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-primary">SME Tip:</span>{" "}
            {guidance.sme_tip}
          </p>
        </div>
      )}
    </Card>
  );
}

// ━━━ HELPERS ━━━

function groupByCategory(obligations: Obligation[]) {
  const map = new Map<string, Obligation[]>();
  for (const o of obligations) {
    const cat = o.category;
    const existing = map.get(cat) ?? [];
    existing.push(o);
    map.set(cat, existing);
  }

  return Array.from(map.entries())
    .map(([category, items]) => ({
      category,
      label: getCategoryLabel(category as Parameters<typeof getCategoryLabel>[0]),
      items,
    }))
    .sort(
      (a, b) =>
        getCategoryOrder(a.category as Parameters<typeof getCategoryOrder>[0]) -
        getCategoryOrder(b.category as Parameters<typeof getCategoryOrder>[0]),
    );
}
