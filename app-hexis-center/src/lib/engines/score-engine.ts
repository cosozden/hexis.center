/**
 * Score Engine — Deterministic Compliance Score Calculator
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ORIENT Step 6: Track
 *
 * Calculates a 0–100 compliance score from:
 * - Obligation completion (weighted by risk level)
 * - Action plan progress
 * - Governance maturity (from assessment)
 * - ORIENT step completion
 *
 * Hybrid pattern: Engine calculates score → Claude interprets for reports.
 */

// ━━━ TYPES ━━━

export interface ScoreInput {
  /** Risk classification level */
  riskLevel: string;
  /** Obligation counts */
  obligations: {
    total: number;
    completed: number;
    inProgress: number;
    notApplicable: number;
  };
  /** Action plan counts */
  actions: {
    total: number;
    completed: number;
    inProgress: number;
  };
  /** Latest governance assessment (0–4 per dimension) */
  assessment: {
    oversightLevel: number;
    monitoringLevel: number;
    documentationLevel: number;
  } | null;
  /** Which ORIENT steps are completed */
  orientSteps: {
    observe: boolean;
    risk: boolean;
    identify: boolean;
    evaluate: boolean;
    navigate: boolean;
    track: boolean;
  };
}

export interface ComplianceScore {
  /** Overall score 0–100 */
  overall: number;
  /** Component scores */
  components: {
    obligations: number;      // 0–100, weight 40%
    actions: number;          // 0–100, weight 25%
    governance: number;       // 0–100, weight 20%
    orientProgress: number;   // 0–100, weight 15%
  };
  /** Score interpretation */
  level: 'critical' | 'low' | 'developing' | 'adequate' | 'strong';
  /** One-line summary */
  summary: string;
  /** Deadline context */
  deadlineStatus: {
    label: string;
    daysLeft: number | null;
    urgent: boolean;
  } | null;
}

export interface SnapshotData {
  score: number;
  obligationsTotal: number;
  obligationsCompleted: number;
  actionsTotal: number;
  actionsCompleted: number;
  metadata: {
    riskLevel: string;
    components: ComplianceScore['components'];
    level: ComplianceScore['level'];
  };
}

// ━━━ WEIGHTS ━━━

const WEIGHTS = {
  obligations: 0.40,
  actions: 0.25,
  governance: 0.20,
  orientProgress: 0.15,
} as const;

// Risk multiplier — higher risk means obligations weigh more
const RISK_OBLIGATION_BOOST: Record<string, number> = {
  prohibited: 1.3,
  high: 1.2,
  limited: 1.0,
  gpai: 1.1,
  minimal: 0.9,
};

// ━━━ SCORE LEVELS ━━━

function scoreToLevel(score: number): ComplianceScore['level'] {
  if (score >= 80) return 'strong';
  if (score >= 60) return 'adequate';
  if (score >= 40) return 'developing';
  if (score >= 20) return 'low';
  return 'critical';
}

function levelSummary(level: ComplianceScore['level'], riskLevel: string): string {
  const summaries: Record<ComplianceScore['level'], string> = {
    critical: `Critical compliance gaps for a ${riskLevel}-risk system. Immediate action required.`,
    low: `Low compliance maturity. Fundamental governance structures need to be established.`,
    developing: `Compliance program developing. Key obligations and governance gaps remain.`,
    adequate: `Adequate compliance posture. Continue closing remaining gaps and monitoring.`,
    strong: `Strong compliance position. Focus on continuous improvement and monitoring.`,
  };
  return summaries[level];
}

// ━━━ DEADLINE ━━━

const DEADLINES: Record<string, { date: string; label: string }> = {
  prohibited: { date: '2025-02-02', label: 'Prohibited practices' },
  gpai: { date: '2025-08-02', label: 'GPAI obligations' },
  high: { date: '2026-08-02', label: 'High-risk Annex III' },
};

function getDeadlineStatus(riskLevel: string): ComplianceScore['deadlineStatus'] {
  const deadline = DEADLINES[riskLevel];
  if (!deadline) return null;

  const now = new Date();
  const target = new Date(deadline.date);
  const daysLeft = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    label: deadline.label,
    daysLeft,
    urgent: daysLeft < 90,
  };
}

// ━━━ COMPONENT CALCULATIONS ━━━

function calcObligationScore(input: ScoreInput): number {
  const { total, completed, notApplicable } = input.obligations;
  const applicable = total - notApplicable;
  if (applicable === 0) return 100; // No obligations = fully compliant

  const inProgressCredit = input.obligations.inProgress * 0.3; // Partial credit
  const effectiveCompleted = completed + inProgressCredit;
  const raw = (effectiveCompleted / applicable) * 100;

  // Apply risk boost
  const boost = RISK_OBLIGATION_BOOST[input.riskLevel] ?? 1.0;
  // For high risk, low completion hurts more (boost amplifies gap from 100)
  const gap = 100 - raw;
  const boostedGap = gap * boost;
  return Math.max(0, Math.min(100, 100 - boostedGap));
}

function calcActionScore(input: ScoreInput): number {
  const { total, completed, inProgress } = input.actions;
  if (total === 0) return 0; // No actions generated yet

  const inProgressCredit = inProgress * 0.3;
  const effectiveCompleted = completed + inProgressCredit;
  return Math.min(100, (effectiveCompleted / total) * 100);
}

function calcGovernanceScore(input: ScoreInput): number {
  if (!input.assessment) return 0;

  const { oversightLevel, monitoringLevel, documentationLevel } = input.assessment;
  // Weighted average matching matrix-engine weights
  const weighted = (oversightLevel * 1.5 + monitoringLevel * 1.4 + documentationLevel * 1.0) / 3.9;
  // Scale from 0–4 to 0–100
  return (weighted / 4) * 100;
}

function calcOrientScore(input: ScoreInput): number {
  const steps = input.orientSteps;
  const completed = [
    steps.observe,
    steps.risk,
    steps.identify,
    steps.evaluate,
    steps.navigate,
    steps.track,
  ].filter(Boolean).length;
  return (completed / 6) * 100;
}

// ━━━ MAIN FUNCTION ━━━

/**
 * Calculate the overall compliance score from all ORIENT data.
 */
export function calculateComplianceScore(input: ScoreInput): ComplianceScore {
  const components = {
    obligations: Math.round(calcObligationScore(input) * 10) / 10,
    actions: Math.round(calcActionScore(input) * 10) / 10,
    governance: Math.round(calcGovernanceScore(input) * 10) / 10,
    orientProgress: Math.round(calcOrientScore(input) * 10) / 10,
  };

  const overall = Math.round(
    components.obligations * WEIGHTS.obligations +
    components.actions * WEIGHTS.actions +
    components.governance * WEIGHTS.governance +
    components.orientProgress * WEIGHTS.orientProgress
  );

  const level = scoreToLevel(overall);

  return {
    overall,
    components,
    level,
    summary: levelSummary(level, input.riskLevel),
    deadlineStatus: getDeadlineStatus(input.riskLevel),
  };
}

/**
 * Prepare data for a compliance_snapshots DB insert.
 */
export function buildSnapshotData(input: ScoreInput): SnapshotData {
  const score = calculateComplianceScore(input);
  return {
    score: score.overall,
    obligationsTotal: input.obligations.total,
    obligationsCompleted: input.obligations.completed,
    actionsTotal: input.actions.total,
    actionsCompleted: input.actions.completed,
    metadata: {
      riskLevel: input.riskLevel,
      components: score.components,
      level: score.level,
    },
  };
}

// ━━━ EXPORTS ━━━

export {
  WEIGHTS,
  scoreToLevel,
  getDeadlineStatus,
  calcObligationScore,
  calcActionScore,
  calcGovernanceScore,
  calcOrientScore,
};
