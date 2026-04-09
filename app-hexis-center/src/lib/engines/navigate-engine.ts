/**
 * Navigate Engine — Deterministic Action Plan Generator
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ORIENT Step 5: Navigate
 *
 * Collects all data from previous ORIENT steps and generates
 * a structured context object for Claude to build the action plan.
 *
 * This engine does NOT generate actions itself — it:
 * 1. Aggregates system, risk, obligation, and assessment data
 * 2. Computes priority signals (deadline proximity, urgency, gaps)
 * 3. Identifies quick wins vs. structural changes
 * 4. Provides the structured context that Claude needs to generate
 *    an intelligent, prioritized action plan
 *
 * Hybrid pattern: Engine provides structure → Claude provides intelligence
 */

import {
  generateMatrix,
  MATURITY_LEVELS,
  type MaturityLevel,
  type ExposureLevel,
  type MatrixResult,
} from './matrix-engine';

// ━━━ TYPES ━━━

export interface ObligationSummary {
  id: string;
  title: string;
  articleReference: string;
  category: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'not_applicable';
  deadline: string | null;
  appliesTo: string;
}

export interface AssessmentSummary {
  oversightLevel: number;
  monitoringLevel: number;
  documentationLevel: number;
  weightedMaturity: string;
  activationPosture: string;
  urgencyIndex: number;
  riskExposure: ExposureLevel;
}

export interface SystemContext {
  id: string;
  name: string;
  purpose: string | null;
  organisationRole: string;
  euMarket: boolean;
  deploymentStatus: string;
}

export interface NavigateInput {
  system: SystemContext;
  riskLevel: string;
  articleReferences: string[];
  obligations: ObligationSummary[];
  assessment: AssessmentSummary;
}

export interface PrioritySignal {
  type: 'deadline' | 'urgency' | 'gap' | 'quick_win' | 'dependency';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

export interface NavigateContext {
  /** System summary for Claude */
  systemSummary: string;
  /** Risk and classification context */
  riskSummary: string;
  /** Obligation completion stats */
  obligationStats: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    notApplicable: number;
    completionRate: number;
    /** Obligations grouped by category with status */
    byCategory: Record<string, { total: number; completed: number }>;
    /** Not-started obligations sorted by deadline proximity */
    pendingByDeadline: ObligationSummary[];
  };
  /** Assessment and gap analysis context */
  gapAnalysis: {
    matrixResult: MatrixResult;
    weakestDimension: string;
    strongestDimension: string;
    dimensionGaps: { dimension: string; level: number; label: string }[];
  };
  /** Priority signals for Claude to consider */
  prioritySignals: PrioritySignal[];
  /** Formatted context string for the Claude prompt */
  formattedContext: string;
}

// ━━━ DEADLINE HELPERS ━━━

const EU_AI_ACT_DEADLINES: Record<string, { date: string; label: string }> = {
  prohibited: { date: '2025-02-02', label: 'Prohibited practices (in force)' },
  gpai: { date: '2025-08-02', label: 'GPAI obligations (in force)' },
  annex_iii: { date: '2026-08-02', label: 'High-risk Annex III' },
  annex_i: { date: '2027-08-02', label: 'High-risk Annex I' },
};

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getApplicableDeadline(riskLevel: string): { date: string; label: string; daysLeft: number } | null {
  let key: string;
  switch (riskLevel) {
    case 'prohibited': key = 'prohibited'; break;
    case 'high': key = 'annex_iii'; break;
    case 'gpai': key = 'gpai'; break;
    default: return null;
  }
  const deadline = EU_AI_ACT_DEADLINES[key];
  return { ...deadline, daysLeft: daysUntil(deadline.date) };
}

// ━━━ DIMENSION ANALYSIS ━━━

const DIMENSION_LABELS: Record<string, string> = {
  oversight: 'Oversight',
  monitoring: 'Monitoring',
  documentation: 'Documentation',
};

function analyzeDimensions(assessment: AssessmentSummary) {
  const dims = [
    { dimension: 'oversight', level: assessment.oversightLevel },
    { dimension: 'monitoring', level: assessment.monitoringLevel },
    { dimension: 'documentation', level: assessment.documentationLevel },
  ];

  const sorted = [...dims].sort((a, b) => a.level - b.level);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];

  return {
    weakestDimension: DIMENSION_LABELS[weakest.dimension],
    strongestDimension: DIMENSION_LABELS[strongest.dimension],
    dimensionGaps: dims.map((d) => ({
      dimension: DIMENSION_LABELS[d.dimension],
      level: d.level,
      label: MATURITY_LEVELS[d.level] ?? 'absent',
    })),
  };
}

// ━━━ PRIORITY SIGNALS ━━━

function computePrioritySignals(input: NavigateInput): PrioritySignal[] {
  const signals: PrioritySignal[] = [];
  const { assessment, obligations, riskLevel } = input;

  // 1. Deadline proximity
  const deadline = getApplicableDeadline(riskLevel);
  if (deadline) {
    if (deadline.daysLeft < 0) {
      signals.push({
        type: 'deadline',
        severity: 'critical',
        description: `${deadline.label} deadline has PASSED (${Math.abs(deadline.daysLeft)} days ago). Immediate compliance action required.`,
      });
    } else if (deadline.daysLeft < 90) {
      signals.push({
        type: 'deadline',
        severity: 'critical',
        description: `${deadline.label} deadline in ${deadline.daysLeft} days. Time-critical compliance window.`,
      });
    } else if (deadline.daysLeft < 180) {
      signals.push({
        type: 'deadline',
        severity: 'high',
        description: `${deadline.label} deadline in ${deadline.daysLeft} days. Plan and begin implementation now.`,
      });
    } else if (deadline.daysLeft < 365) {
      signals.push({
        type: 'deadline',
        severity: 'medium',
        description: `${deadline.label} deadline in ${deadline.daysLeft} days. Start planning.`,
      });
    }
  }

  // 2. Urgency from assessment
  if (assessment.urgencyIndex >= 4.5) {
    signals.push({
      type: 'urgency',
      severity: 'critical',
      description: 'Critical urgency index. Governance maturity far below risk exposure requirements.',
    });
  } else if (assessment.urgencyIndex >= 3.0) {
    signals.push({
      type: 'urgency',
      severity: 'high',
      description: 'High urgency index. Significant governance gaps relative to risk level.',
    });
  }

  // 3. Absent dimensions
  const dims = [
    { name: 'Oversight', level: assessment.oversightLevel },
    { name: 'Monitoring', level: assessment.monitoringLevel },
    { name: 'Documentation', level: assessment.documentationLevel },
  ];
  for (const dim of dims) {
    if (dim.level === 0) {
      signals.push({
        type: 'gap',
        severity: riskLevel === 'high' || riskLevel === 'prohibited' ? 'critical' : 'high',
        description: `${dim.name} is completely absent. This is a fundamental governance gap.`,
      });
    }
  }

  // 4. Quick wins — obligations that are easy to complete
  const notStarted = obligations.filter((o) => o.status === 'not_started');
  const transparencyObs = notStarted.filter((o) => o.category === 'transparency');
  if (transparencyObs.length > 0) {
    signals.push({
      type: 'quick_win',
      severity: 'medium',
      description: `${transparencyObs.length} transparency obligation(s) not started — typically quick to implement.`,
    });
  }

  // 5. High completion potential
  const inProgress = obligations.filter((o) => o.status === 'in_progress');
  if (inProgress.length > 0) {
    signals.push({
      type: 'quick_win',
      severity: 'medium',
      description: `${inProgress.length} obligation(s) already in progress — prioritize completion.`,
    });
  }

  // 6. Low obligation completion with high risk
  const completionRate = obligations.length > 0
    ? obligations.filter((o) => o.status === 'completed').length / obligations.length
    : 0;
  if (completionRate < 0.2 && (riskLevel === 'high' || riskLevel === 'prohibited')) {
    signals.push({
      type: 'dependency',
      severity: 'critical',
      description: `Only ${Math.round(completionRate * 100)}% of obligations completed for a ${riskLevel}-risk system. Major compliance gap.`,
    });
  }

  return signals.sort((a, b) => {
    const sev = { critical: 0, high: 1, medium: 2, low: 3 };
    return sev[a.severity] - sev[b.severity];
  });
}

// ━━━ OBLIGATION STATS ━━━

function computeObligationStats(obligations: ObligationSummary[]) {
  const total = obligations.length;
  const completed = obligations.filter((o) => o.status === 'completed').length;
  const inProgress = obligations.filter((o) => o.status === 'in_progress').length;
  const notStarted = obligations.filter((o) => o.status === 'not_started').length;
  const notApplicable = obligations.filter((o) => o.status === 'not_applicable').length;
  const applicable = total - notApplicable;
  const completionRate = applicable > 0 ? completed / applicable : 0;

  // Group by category
  const byCategory: Record<string, { total: number; completed: number }> = {};
  for (const ob of obligations) {
    if (!byCategory[ob.category]) {
      byCategory[ob.category] = { total: 0, completed: 0 };
    }
    byCategory[ob.category].total++;
    if (ob.status === 'completed') {
      byCategory[ob.category].completed++;
    }
  }

  // Sort pending by deadline
  const pendingByDeadline = obligations
    .filter((o) => o.status === 'not_started' || o.status === 'in_progress')
    .sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

  return {
    total,
    completed,
    inProgress,
    notStarted,
    notApplicable,
    completionRate,
    byCategory,
    pendingByDeadline,
  };
}

// ━━━ FORMAT CONTEXT FOR CLAUDE ━━━

function formatContextForClaude(input: NavigateInput, signals: PrioritySignal[]): string {
  const { system, riskLevel, articleReferences, obligations, assessment } = input;
  const stats = computeObligationStats(obligations);
  const dimAnalysis = analyzeDimensions(assessment);
  const deadline = getApplicableDeadline(riskLevel);

  const lines: string[] = [];

  // System
  lines.push(`System: ${system.name}`);
  lines.push(`Purpose: ${system.purpose || 'Not specified'}`);
  lines.push(`Role: ${system.organisationRole} | EU Market: ${system.euMarket ? 'Yes' : 'No'} | Status: ${system.deploymentStatus}`);
  lines.push('');

  // Risk
  lines.push(`Risk Level: ${riskLevel.toUpperCase()}`);
  lines.push(`Articles: ${articleReferences.join(', ') || 'None'}`);
  if (deadline) {
    lines.push(`Deadline: ${deadline.label} — ${deadline.daysLeft > 0 ? `${deadline.daysLeft} days remaining` : `PASSED ${Math.abs(deadline.daysLeft)} days ago`}`);
  }
  lines.push('');

  // Obligations
  lines.push(`Obligations: ${stats.total} total (${stats.completed} completed, ${stats.inProgress} in progress, ${stats.notStarted} not started, ${stats.notApplicable} N/A)`);
  lines.push(`Completion Rate: ${Math.round(stats.completionRate * 100)}%`);
  if (stats.pendingByDeadline.length > 0) {
    lines.push('Pending obligations (by deadline):');
    for (const ob of stats.pendingByDeadline.slice(0, 10)) {
      lines.push(`  - [${ob.status}] ${ob.title} (${ob.articleReference})${ob.deadline ? ` — due ${ob.deadline}` : ''}`);
    }
  }
  lines.push('');

  // Assessment
  lines.push(`Governance Assessment:`);
  lines.push(`  Oversight: ${dimAnalysis.dimensionGaps[0].label} (${dimAnalysis.dimensionGaps[0].level}/4)`);
  lines.push(`  Monitoring: ${dimAnalysis.dimensionGaps[1].label} (${dimAnalysis.dimensionGaps[1].level}/4)`);
  lines.push(`  Documentation: ${dimAnalysis.dimensionGaps[2].label} (${dimAnalysis.dimensionGaps[2].level}/4)`);
  lines.push(`  Activation Posture: ${assessment.activationPosture}`);
  lines.push(`  Urgency Index: ${assessment.urgencyIndex.toFixed(1)}`);
  lines.push(`  Weakest: ${dimAnalysis.weakestDimension} | Strongest: ${dimAnalysis.strongestDimension}`);
  lines.push('');

  // Priority signals
  if (signals.length > 0) {
    lines.push('Priority Signals:');
    for (const sig of signals) {
      lines.push(`  [${sig.severity.toUpperCase()}] ${sig.description}`);
    }
  }

  return lines.join('\n');
}

// ━━━ MAIN FUNCTION ━━━

/**
 * Generate the full Navigate context from all ORIENT data.
 * This context is passed to Claude for intelligent action plan generation.
 */
export function generateNavigateContext(input: NavigateInput): NavigateContext {
  const { assessment } = input;

  // Run matrix engine for full result
  const matrixResult = generateMatrix({
    exposure: assessment.riskExposure,
    oversight: MATURITY_LEVELS[assessment.oversightLevel] as MaturityLevel,
    monitoring: MATURITY_LEVELS[assessment.monitoringLevel] as MaturityLevel,
    documentation: MATURITY_LEVELS[assessment.documentationLevel] as MaturityLevel,
    systemName: input.system.name,
  });

  const dimAnalysis = analyzeDimensions(assessment);
  const obligationStats = computeObligationStats(input.obligations);
  const prioritySignals = computePrioritySignals(input);
  const formattedContext = formatContextForClaude(input, prioritySignals);

  return {
    systemSummary: `${input.system.name} — ${input.system.purpose || 'No purpose specified'}`,
    riskSummary: `${input.riskLevel} risk (${input.articleReferences.join(', ')})`,
    obligationStats,
    gapAnalysis: {
      matrixResult,
      ...dimAnalysis,
    },
    prioritySignals,
    formattedContext,
  };
}

// ━━━ EXPORTS ━━━

export {
  computePrioritySignals,
  computeObligationStats,
  analyzeDimensions,
  getApplicableDeadline,
  daysUntil,
};
