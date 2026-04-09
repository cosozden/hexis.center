/**
 * Action Plan — Interactive Roadmap UI
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ORIENT Step 5: Navigate
 *
 * Displays the Claude-generated action plan with:
 * - Executive summary + critical path
 * - Prioritized action list with status toggles
 * - Resource estimate
 * - Regenerate with user constraints
 *
 * UI: Hexis Web Palette dark theme. No border-radius, no shadows.
 */

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Card, Badge, Button, Separator } from "@/components/ui";

// ━━━ TYPES ━━━

interface Action {
  id: string;
  title: string;
  description: string | null;
  priority: "critical" | "high" | "medium" | "low";
  status: "todo" | "in_progress" | "done";
  estimated_hours: number | null;
  dimension_impact: string[];
  ai_reasoning: string | null;
  sort_order: number;
}

interface PlanSummary {
  executiveSummary: string;
  criticalPath: string;
  resourceEstimate: {
    total_hours?: number;
    suggested_timeline_weeks?: number;
    team_size_recommendation?: string;
  } | null;
}

interface Props {
  systemId: string;
  systemName: string;
  riskLevel: string;
  /** Existing actions (if plan was already generated) */
  initialActions: Action[];
  /** Existing plan summary (stored in first generation) */
  initialPlan: PlanSummary | null;
}

// ━━━ HELPERS ━━━

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/30",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

const STATUS_CYCLE: Record<string, "todo" | "in_progress" | "done"> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
};

const DIMENSION_LABELS: Record<string, string> = {
  oversight: "Oversight",
  monitoring: "Monitoring",
  documentation: "Documentation",
};

// ━━━ MAIN COMPONENT ━━━

export function ActionPlan({
  systemId,
  systemName,
  riskLevel,
  initialActions,
  initialPlan,
}: Props) {
  const [actions, setActions] = useState<Action[]>(initialActions);
  const [plan, setPlan] = useState<PlanSummary | null>(initialPlan);
  const [generating, setGenerating] = useState(false);
  const [constraints, setConstraints] = useState("");
  const [showConstraints, setShowConstraints] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedAction, setExpandedAction] = useState<string | null>(null);

  // ━━━ GENERATE PLAN ━━━

  const generatePlan = useCallback(
    async (force = false) => {
      setGenerating(true);
      setError(null);

      try {
        const res = await fetch("/api/ai/generate-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemId,
            userConstraints: constraints || undefined,
            force,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to generate plan");
        }

        const data = await res.json();
        setPlan(data.plan);
        setActions(data.actions);
        setShowConstraints(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate plan");
      } finally {
        setGenerating(false);
      }
    },
    [systemId, constraints],
  );

  // ━━━ UPDATE ACTION STATUS ━━━

  const toggleStatus = async (action: Action) => {
    const newStatus = STATUS_CYCLE[action.status];

    // Optimistic update
    setActions((prev) =>
      prev.map((a) =>
        a.id === action.id ? { ...a, status: newStatus } : a,
      ),
    );

    try {
      const res = await fetch(`/api/actions/${action.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Revert on failure
        setActions((prev) =>
          prev.map((a) =>
            a.id === action.id ? { ...a, status: action.status } : a,
          ),
        );
      }
    } catch {
      // Revert on failure
      setActions((prev) =>
        prev.map((a) =>
          a.id === action.id ? { ...a, status: action.status } : a,
        ),
      );
    }
  };

  // ━━━ STATS ━━━

  const totalActions = actions.length;
  const doneCount = actions.filter((a) => a.status === "done").length;
  const progressPercent = totalActions > 0 ? Math.round((doneCount / totalActions) * 100) : 0;
  const totalHours = actions.reduce((sum, a) => sum + (a.estimated_hours || 0), 0);

  // ━━━ NO PLAN YET ━━━

  if (!plan && actions.length === 0) {
    return (
      <div className="max-w-4xl">
        <Link
          href={`/dashboard/systems/${systemId}`}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; {systemName}
        </Link>

        <div className="mt-3 mb-8">
          <h1 className="font-heading text-2xl text-foreground">Action Plan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate a prioritized compliance roadmap based on your risk
            classification, obligations, and governance assessment.
          </p>
        </div>

        <Card accent className="p-6 mb-4">
          <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
            Navigate &mdash; Step 5
          </p>
          <p className="text-sm text-foreground mb-2">
            Claude will analyze all your ORIENT data and create an intelligent
            action plan with priorities, timelines, and resource estimates.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            You can provide optional constraints (team size, available hours,
            budget) to get a tailored plan.
          </p>

          {/* Optional constraints */}
          <button
            onClick={() => setShowConstraints(!showConstraints)}
            className="text-xs text-primary hover:text-foreground transition-colors mb-3"
            type="button"
          >
            {showConstraints ? "Hide constraints" : "+ Add constraints (optional)"}
          </button>

          {showConstraints && (
            <textarea
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="e.g. 'Team of 2, 10 hours/week available, no external consultants'"
              className="w-full border border-border2 bg-card text-sm text-foreground p-3 mb-4 resize-none h-20 placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
              aria-label="Resource constraints"
            />
          )}

          <Button onClick={() => generatePlan(false)} disabled={generating}>
            {generating ? "Generating Plan..." : "Generate Action Plan"}
          </Button>
        </Card>

        {error && (
          <div className="border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-400">
            {error}
          </div>
        )}
      </div>
    );
  }

  // ━━━ PLAN EXISTS ━━━

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <Link
        href={`/dashboard/systems/${systemId}`}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; {systemName}
      </Link>

      <div className="mt-3 mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl text-foreground">Action Plan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Prioritized compliance roadmap for {systemName}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => generatePlan(true)}
          disabled={generating}
        >
          {generating ? "Regenerating..." : "Regenerate"}
        </Button>
      </div>

      {/* Progress bar */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
            Progress
          </p>
          <span className="text-xs text-foreground">
            {doneCount}/{totalActions} actions ({progressPercent}%)
          </span>
        </div>
        <div className="h-[3px] bg-border2 w-full">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {totalHours > 0 && (
          <p className="text-[10px] text-muted-foreground mt-2">
            Estimated effort: {totalHours} hours total
          </p>
        )}
      </Card>

      {/* Executive Summary */}
      {plan && (
        <Card accent className="p-5 mb-4">
          <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
            Executive Summary
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {plan.executiveSummary}
          </p>

          <Separator className="my-4" />

          <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-2">
            Critical Path
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {plan.criticalPath}
          </p>

          {plan.resourceEstimate && (
            <>
              <Separator className="my-4" />
              <div className="flex gap-6 text-xs">
                {plan.resourceEstimate.total_hours && (
                  <div>
                    <span className="text-muted-foreground">Total hours: </span>
                    <span className="text-foreground">{plan.resourceEstimate.total_hours}h</span>
                  </div>
                )}
                {plan.resourceEstimate.suggested_timeline_weeks && (
                  <div>
                    <span className="text-muted-foreground">Timeline: </span>
                    <span className="text-foreground">
                      {plan.resourceEstimate.suggested_timeline_weeks} weeks
                    </span>
                  </div>
                )}
                {plan.resourceEstimate.team_size_recommendation && (
                  <div>
                    <span className="text-muted-foreground">Team: </span>
                    <span className="text-foreground">
                      {plan.resourceEstimate.team_size_recommendation}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </Card>
      )}

      {/* ━━━ ACTION LIST ━━━ */}
      <div className="mb-4">
        <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
          Actions ({totalActions})
        </p>
      </div>

      <div className="space-y-2 mb-6">
        {actions
          .sort((a, b) => {
            // Sort: critical first, then by sort_order
            const prio = { critical: 0, high: 1, medium: 2, low: 3 };
            const prioDiff = prio[a.priority] - prio[b.priority];
            if (prioDiff !== 0) return prioDiff;
            return a.sort_order - b.sort_order;
          })
          .map((action) => (
            <Card
              key={action.id}
              className={`p-4 transition-colors ${
                action.status === "done" ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Status toggle */}
                <button
                  onClick={() => toggleStatus(action)}
                  className={`mt-0.5 w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors ${
                    action.status === "done"
                      ? "border-primary bg-primary/20 text-primary"
                      : action.status === "in_progress"
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-border2 hover:border-primary/40"
                  }`}
                  type="button"
                  aria-label={`Mark as ${STATUS_CYCLE[action.status]}`}
                >
                  {action.status === "done" && (
                    <span className="text-[10px]">&#10003;</span>
                  )}
                  {action.status === "in_progress" && (
                    <span className="text-[8px] text-yellow-400">&#9679;</span>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-sm font-heading ${
                        action.status === "done"
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}
                    >
                      {action.title}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 border ${PRIORITY_COLORS[action.priority]}`}
                    >
                      {action.priority}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>{STATUS_LABELS[action.status]}</span>
                    {action.estimated_hours && (
                      <span>{action.estimated_hours}h</span>
                    )}
                    {action.dimension_impact.length > 0 && (
                      <span>
                        {action.dimension_impact
                          .map((d) => DIMENSION_LABELS[d] || d)
                          .join(", ")}
                      </span>
                    )}
                  </div>

                  {/* Expandable detail */}
                  <button
                    onClick={() =>
                      setExpandedAction(
                        expandedAction === action.id ? null : action.id,
                      )
                    }
                    className="text-[10px] text-primary/60 hover:text-primary mt-1 transition-colors"
                    type="button"
                  >
                    {expandedAction === action.id ? "Hide detail" : "Show detail"}
                  </button>

                  {expandedAction === action.id && (
                    <div className="mt-3 space-y-2 text-xs">
                      {action.description && (
                        <p className="text-foreground/80">{action.description}</p>
                      )}
                      {action.ai_reasoning && (
                        <div className="border-l-2 border-primary/20 pl-3">
                          <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                            Why this priority
                          </p>
                          <p className="text-foreground/70">{action.ai_reasoning}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
      </div>

      {/* Error */}
      {error && (
        <div className="border border-red-500/30 bg-red-500/5 p-3 mb-4 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/systems/${systemId}`}>
          <Button variant="outline" size="sm">Back to System</Button>
        </Link>
      </div>

      <p className="text-[9px] text-muted-foreground/60 mt-3">
        AI-generated action plan. Not legal advice. Powered by Claude.
      </p>
    </div>
  );
}
