/**
 * Governance Activation Matrix — Interactive Assessment UI
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ORIENT Step 4: Evaluate
 *
 * Three sliders (Oversight, Monitoring, Documentation) → Matrix result.
 * Deterministic engine calculates; Claude enriches with gap analysis.
 *
 * UI: Hexis Web Palette dark theme. No border-radius, no shadows.
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Card, Badge, Button, Separator } from "@/components/ui";
import { handleApiError } from "@/lib/api/handle-api-error";
import {
  generateMatrix,
  MATURITY_LEVELS,
  MATURITY_LABELS,
  EXPOSURE_LABELS,
  type MatrixInput,
  type MatrixResult,
  type MaturityLevel,
  type ExposureLevel,
  type UrgencyLevel,
  computeDelta,
  type MatrixDelta,
} from "@/lib/engines/matrix-engine";

// ━━━ TYPES ━━━

interface Assessment {
  id: string;
  oversight_level: number;
  monitoring_level: number;
  documentation_level: number;
  weighted_maturity: number;
  activation_posture: string;
  urgency_index: number;
  risk_exposure: string;
  ai_insight: Record<string, string> | null;
  assessed_at: string;
}

interface Props {
  systemId: string;
  systemName: string;
  riskLevel: string;
  riskExposure: ExposureLevel;
  previousAssessment: Assessment | null;
}

// ━━━ HELPERS ━━━

const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/30",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  moderate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  minimal: "bg-green-500/10 text-green-400 border-green-500/30",
};

const MATURITY_COLORS: Record<MaturityLevel, string> = {
  absent: "bg-[#dedad4]/10 text-[#dedad4]",
  adhoc: "bg-[#c4c2be]/10 text-[#c4c2be]",
  structured: "bg-[#8a8884]/10 text-[#8a8884]",
  continuous: "bg-[#686662]/10 text-[#686662]",
  embedded: "bg-primary/10 text-primary",
};

function indexToLevel(idx: number): MaturityLevel {
  return MATURITY_LEVELS[Math.max(0, Math.min(4, idx))];
}

function levelToIndex(level: MaturityLevel): number {
  return MATURITY_LEVELS.indexOf(level);
}

function mapRiskToExposure(riskLevel: string): ExposureLevel {
  switch (riskLevel) {
    case "prohibited":
    case "high":
      return "high";
    case "limited":
    case "gpai":
      return "elevated";
    case "minimal":
    default:
      return "low";
  }
}

// ━━━ SLIDER COMPONENT ━━━

function MaturitySlider({
  label,
  sublabel,
  value,
  onChange,
  weight,
}: {
  label: string;
  sublabel: string;
  value: number;
  onChange: (v: number) => void;
  weight: number;
}) {
  const level = indexToLevel(value);

  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <span className="text-sm text-foreground font-heading">{label}</span>
          <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground ml-2">
            weight {weight}x
          </span>
        </div>
        <span className={`text-xs px-2 py-0.5 border ${MATURITY_COLORS[level]}`}>
          {MATURITY_LABELS[level]}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-3">{sublabel}</p>

      {/* Slider track */}
      <div className="relative">
        <input
          type="range"
          min={0}
          max={4}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1 appearance-none cursor-pointer
            [&::-webkit-slider-runnable-track]:h-[2px]
            [&::-webkit-slider-runnable-track]:bg-border2
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:bg-brass
            [&::-webkit-slider-thumb]:border
            [&::-webkit-slider-thumb]:border-brass
            [&::-webkit-slider-thumb]:-mt-[5px]
            [&::-moz-range-track]:h-[2px]
            [&::-moz-range-track]:bg-border2
            [&::-moz-range-thumb]:w-3
            [&::-moz-range-thumb]:h-3
            [&::-moz-range-thumb]:bg-brass
            [&::-moz-range-thumb]:border-brass
            [&::-moz-range-thumb]:border-0"
          aria-label={`${label} maturity level`}
        />
        {/* Step labels */}
        <div className="flex justify-between mt-1">
          {MATURITY_LEVELS.map((lvl, i) => (
            <button
              key={lvl}
              onClick={() => onChange(i)}
              className={`text-[8px] uppercase tracking-[0.06em] transition-colors ${
                i === value ? "text-foreground" : "text-muted-foreground/50"
              }`}
              type="button"
            >
              {MATURITY_LABELS[lvl].slice(0, 4)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ━━━ MAIN COMPONENT ━━━

export function GovernanceMatrix({
  systemId,
  systemName,
  riskLevel,
  riskExposure,
  previousAssessment,
}: Props) {
  // Initialize from previous assessment or defaults
  const [oversight, setOversight] = useState(
    previousAssessment?.oversight_level ?? 0
  );
  const [monitoring, setMonitoring] = useState(
    previousAssessment?.monitoring_level ?? 0
  );
  const [documentation, setDocumentation] = useState(
    previousAssessment?.documentation_level ?? 0
  );

  const [result, setResult] = useState<MatrixResult | null>(null);
  const [delta, setDelta] = useState<MatrixDelta | null>(null);
  const [insight, setInsight] = useState<Record<string, string> | null>(
    previousAssessment?.ai_insight ?? null
  );
  const [insightLoading, setInsightLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ━━━ GENERATE MATRIX ━━━

  const generate = useCallback(() => {
    const input: MatrixInput = {
      exposure: riskExposure,
      oversight: indexToLevel(oversight),
      monitoring: indexToLevel(monitoring),
      documentation: indexToLevel(documentation),
      systemName,
    };

    const matrixResult = generateMatrix(input);
    setResult(matrixResult);
    setSaved(false);
    setInsight(null);

    // Compute delta if previous assessment exists
    if (previousAssessment) {
      const prevInput: MatrixInput = {
        exposure: previousAssessment.risk_exposure as ExposureLevel,
        oversight: indexToLevel(previousAssessment.oversight_level),
        monitoring: indexToLevel(previousAssessment.monitoring_level),
        documentation: indexToLevel(previousAssessment.documentation_level),
      };
      const prevResult = generateMatrix(prevInput);
      setDelta(computeDelta(prevResult, matrixResult));
    }
  }, [oversight, monitoring, documentation, riskExposure, systemName, previousAssessment]);

  // Auto-generate on slider change
  useEffect(() => {
    generate();
  }, [generate]);

  // ━━━ GET CLAUDE INSIGHT ━━━

  const getInsight = async () => {
    if (!result) return;

    setInsightLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/matrix-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemId,
          oversight,
          monitoring,
          documentation,
          exposure: riskExposure,
          previousAssessment: previousAssessment
            ? {
                oversight: previousAssessment.oversight_level,
                monitoring: previousAssessment.monitoring_level,
                documentation: previousAssessment.documentation_level,
                exposure: previousAssessment.risk_exposure,
              }
            : null,
        }),
      });

      if (handleApiError(res)) return;

      const data = await res.json();
      setInsight(data.insight);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get insight");
    } finally {
      setInsightLoading(false);
    }
  };

  // ━━━ SAVE ASSESSMENT ━━━

  const save = async () => {
    if (!result) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/assessments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemId,
          oversightLevel: oversight,
          monitoringLevel: monitoring,
          documentationLevel: documentation,
          weightedMaturity: result.rawMaturityScore,
          activationPosture: result.posture.action,
          urgencyIndex: result.urgencyScore,
          riskExposure,
          aiInsight: insight,
        }),
      });

      if (handleApiError(res)) return;

      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <Link
        href={`/dashboard/systems/${systemId}`}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; {systemName}
      </Link>

      <div className="mt-3 mb-8">
        <h1 className="font-heading text-2xl text-foreground">
          Governance Assessment
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Evaluate your governance maturity across three dimensions.
          The matrix engine calculates your activation posture and urgency level.
        </p>
      </div>

      {/* Risk context */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
              Risk Exposure
            </p>
            <p className="text-sm text-foreground mt-0.5">
              {EXPOSURE_LABELS[riskExposure]} &mdash; derived from {riskLevel} risk classification
            </p>
          </div>
          {previousAssessment && (
            <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
              Previous assessment:{" "}
              {new Date(previousAssessment.assessed_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </Card>

      {/* Sliders */}
      <Card className="p-5 mb-6">
        <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-5">
          Governance Dimensions
        </p>

        <MaturitySlider
          label="Oversight"
          sublabel="Human review mechanisms, accountability structures, escalation paths"
          value={oversight}
          onChange={setOversight}
          weight={1.5}
        />

        <MaturitySlider
          label="Monitoring"
          sublabel="Performance tracking, bias detection, drift alerting, incident logging"
          value={monitoring}
          onChange={setMonitoring}
          weight={1.4}
        />

        <MaturitySlider
          label="Documentation"
          sublabel="Technical documentation, audit trail, decision records, data governance"
          value={documentation}
          onChange={setDocumentation}
          weight={1.0}
        />
      </Card>

      {/* ━━━ MATRIX RESULT ━━━ */}
      {result && (
        <>
          {/* Activation Posture */}
          <Card accent className="p-5 mb-4">
            <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
              Activation Posture
            </p>

            <p className="font-heading text-lg text-foreground mb-1">
              {result.posture.action}
            </p>
            <p className="text-sm text-muted-foreground">
              {result.posture.hint}
            </p>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-1">
                  Weighted Maturity
                </p>
                <span
                  className={`inline-block text-xs px-2 py-0.5 border ${
                    MATURITY_COLORS[result.weightedMaturity]
                  }`}
                >
                  {MATURITY_LABELS[result.weightedMaturity]}
                </span>
                {result.safeguardApplied && (
                  <p className="text-[10px] text-yellow-400/80 mt-1">
                    Capped by minimum safeguard ({result.safeguardDimensions.join(", ")} absent)
                  </p>
                )}
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-1">
                  Urgency Index
                </p>
                <span
                  className={`inline-block text-xs px-2 py-0.5 border ${
                    URGENCY_COLORS[result.urgencyIndex]
                  }`}
                >
                  {result.urgencyIndex.charAt(0).toUpperCase() + result.urgencyIndex.slice(1)}
                </span>
              </div>
            </div>
          </Card>

          {/* Immediate Action + 30-day Target */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card className="p-4">
              <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-2">
                Immediate Action
              </p>
              <p className="text-sm text-foreground">{result.immediateAction}</p>
            </Card>

            <Card className="p-4">
              <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-2">
                30-Day Target
              </p>
              <p className="text-sm text-foreground">
                {result.thirtyDayTarget.summary}
              </p>
            </Card>
          </div>

          {/* Why This Position (Rule-based reasoning) */}
          <Card className="p-5 mb-4">
            <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
              Why This Position
            </p>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                  Regulatory Signal
                </p>
                <p className="text-foreground/90">{result.reasoning.regulatorySignal}</p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                  Maturity Assessment
                </p>
                <p className="text-foreground/90">{result.reasoning.maturityGap}</p>
              </div>

              {result.reasoning.dimensionFlags.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                    Dimension Warnings
                  </p>
                  {result.reasoning.dimensionFlags.map((flag, i) => (
                    <p key={i} className="text-foreground/90 text-xs mt-1">
                      {flag}
                    </p>
                  ))}
                </div>
              )}

              {result.reasoning.safeguardNote && (
                <div className="border border-yellow-500/20 bg-yellow-500/5 p-3">
                  <p className="text-[9px] uppercase tracking-[0.08em] text-yellow-400 mb-1">
                    Minimum Safeguard
                  </p>
                  <p className="text-xs text-foreground/80">{result.reasoning.safeguardNote}</p>
                </div>
              )}
            </div>

            <p className="text-[9px] text-muted-foreground/60 mt-3">
              This analysis is generated by rule-based logic. No AI model was used.
            </p>
          </Card>

          {/* Delta (if previous assessment) */}
          {delta && (
            <Card className="p-4 mb-4">
              <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-2">
                Change Since Last Assessment
              </p>
              <p className="text-sm text-foreground">{delta.summary}</p>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>
                  Oversight: {delta.dimensionChanges.oversight > 0 ? "+" : ""}
                  {delta.dimensionChanges.oversight}
                </span>
                <span>
                  Monitoring: {delta.dimensionChanges.monitoring > 0 ? "+" : ""}
                  {delta.dimensionChanges.monitoring}
                </span>
                <span>
                  Documentation: {delta.dimensionChanges.documentation > 0 ? "+" : ""}
                  {delta.dimensionChanges.documentation}
                </span>
              </div>
            </Card>
          )}

          {/* ━━━ CLAUDE INSIGHT ━━━ */}
          <Card className="p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[9px] uppercase tracking-[0.1em] text-primary">
                AI Gap Analysis
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={getInsight}
                disabled={insightLoading}
              >
                {insightLoading
                  ? "Analyzing..."
                  : insight
                    ? "Refresh Analysis"
                    : "Get AI Analysis"}
              </Button>
            </div>

            {!insight && !insightLoading && (
              <p className="text-xs text-muted-foreground">
                Claude will analyze your governance gaps and provide contextual benchmarking,
                regulatory perspective, and a measurable improvement target.
              </p>
            )}

            {insight && (
              <div className="space-y-4 text-sm">
                {insight.critical_gap && (
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                      Critical Gap
                    </p>
                    <p className="text-foreground/90">{insight.critical_gap}</p>
                  </div>
                )}

                {insight.dimension_interaction && (
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                      Dimension Interaction
                    </p>
                    <p className="text-foreground/90">{insight.dimension_interaction}</p>
                  </div>
                )}

                {insight.regulatory_perspective && (
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                      Regulatory Perspective
                    </p>
                    <p className="text-foreground/90">{insight.regulatory_perspective}</p>
                  </div>
                )}

                {insight.contextual_benchmark && (
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                      Contextual Benchmark
                    </p>
                    <p className="text-foreground/90">{insight.contextual_benchmark}</p>
                  </div>
                )}

                {insight.thirty_day_target && (
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                      Measurable 30-Day Target
                    </p>
                    <p className="text-foreground/90">{insight.thirty_day_target}</p>
                  </div>
                )}

                {insight.trend_analysis && (
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground mb-1">
                      Trend Analysis
                    </p>
                    <p className="text-foreground/90">{insight.trend_analysis}</p>
                  </div>
                )}

                <p className="text-[9px] text-muted-foreground/60">
                  AI-assisted analysis. Not legal advice. Powered by Claude.
                </p>
              </div>
            )}
          </Card>

          {/* ━━━ ACTIONS ━━━ */}
          {error && (
            <div className="border border-red-500/30 bg-red-500/5 p-3 mb-4 text-xs text-red-400">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button onClick={save} disabled={saving || saved}>
              {saving ? "Saving..." : saved ? "Saved" : "Save Assessment"}
            </Button>

            {saved && (
              <Link href={`/dashboard/systems/${systemId}`}>
                <Button variant="outline" size="sm">
                  Back to System
                </Button>
              </Link>
            )}
          </div>

          {saved && (
            <p className="text-xs text-muted-foreground mt-2">
              Assessment saved. You can now proceed to the Navigate step to generate an action plan.
            </p>
          )}
        </>
      )}
    </div>
  );
}
