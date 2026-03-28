/**
 * Governance Activation Matrix Engine
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Deterministic governance maturity calculation and activation posture mapping.
 * Ported from hexis.center/generator — enhanced with TypeScript types,
 * delta tracking, and structured output for Claude enrichment.
 *
 * Key formulas:
 *   Weighted maturity = (Oversight×1.5 + Monitoring×1.4 + Documentation×1.0) / 3.9
 *   Minimum safeguard: ANY absent dimension caps maturity at Ad Hoc
 *   Urgency index = exposure×1.6 - maturity×0.8
 *
 * This is the DETERMINISTIC layer. Claude enrichment (via matrix-insight
 * API route) provides contextual interpretation on top.
 */

// ━━━ ENUMS ━━━

export const MATURITY_LEVELS = ['absent', 'adhoc', 'structured', 'continuous', 'embedded'] as const;
export type MaturityLevel = typeof MATURITY_LEVELS[number];

export const MATURITY_LABELS: Record<MaturityLevel, string> = {
  absent: 'Absent',
  adhoc: 'Ad Hoc',
  structured: 'Structured',
  continuous: 'Continuous',
  embedded: 'Embedded',
};

export const EXPOSURE_LEVELS = ['low', 'moderate', 'elevated', 'high'] as const;
export type ExposureLevel = typeof EXPOSURE_LEVELS[number];

export const EXPOSURE_LABELS: Record<ExposureLevel, string> = {
  low: 'Low',
  moderate: 'Moderate',
  elevated: 'Elevated',
  high: 'High',
};

export type UrgencyLevel = 'minimal' | 'low' | 'moderate' | 'high' | 'critical';

// ━━━ WEIGHTS ━━━

const WEIGHTS = {
  oversight: 1.5,       // Highest — regulatory authority layer
  monitoring: 1.4,      // Second — operational visibility
  documentation: 1.0,   // Baseline — records/audit trail
} as const;

const WEIGHT_SUM = WEIGHTS.oversight + WEIGHTS.monitoring + WEIGHTS.documentation; // 3.9

const URGENCY_WEIGHTS = {
  exposure: 1.6,   // Dominates — unmanaged risk scales faster
  maturity: 0.8,   // Mitigates — governance matures slower
} as const;

// ━━━ INPUT ━━━

export interface MatrixInput {
  exposure: ExposureLevel;
  oversight: MaturityLevel;
  monitoring: MaturityLevel;
  documentation: MaturityLevel;
  systemName?: string;
}

// ━━━ OUTPUT ━━━

export interface ActivationPosture {
  action: string;
  hint: string;
}

export interface MatrixResult {
  // Computed values
  weightedMaturity: MaturityLevel;
  rawMaturityScore: number;          // 0-4 (before rounding/capping)
  safeguardApplied: boolean;         // Was minimum safeguard triggered?
  safeguardDimensions: string[];     // Which dimensions were absent

  // Urgency
  urgencyIndex: UrgencyLevel;
  urgencyScore: number;              // Raw numeric score

  // Activation posture
  posture: ActivationPosture;
  immediateAction: string;

  // 30-day target
  thirtyDayTarget: {
    oversight: MaturityLevel;
    monitoring: MaturityLevel;
    documentation: MaturityLevel;
    summary: string;
  };

  // Why this position (rule-based reasoning)
  reasoning: {
    regulatorySignal: string;
    maturityGap: string;
    dimensionFlags: string[];
    safeguardNote: string;
  };

  // Input echo (for display + delta comparison)
  input: MatrixInput;
}

// ━━━ POSTURE MAPPING (5×4 grid) ━━━

const POSTURES: Record<MaturityLevel, Record<ExposureLevel, ActivationPosture>> = {
  absent: {
    low:      { action: 'Define Governance Scope',           hint: 'Map system boundaries & impact' },
    moderate: { action: 'Initiate Minimum Governance',       hint: 'Establish ownership & basic controls' },
    elevated: { action: 'Assign Risk Owner Immediately',     hint: 'Structure accountability before next cycle' },
    high:     { action: 'Intervene — Suspend or Constrain',  hint: 'Do not operate without oversight layer' },
  },
  adhoc: {
    low:      { action: 'Begin Light Structuring',           hint: 'Document existing practices' },
    moderate: { action: 'Define Repeatable Processes',       hint: 'Assign ownership, start documentation' },
    elevated: { action: 'Formalize Oversight Structure',     hint: 'Set roles, review cadence & escalation path' },
    high:     { action: 'Activate Formal Governance Now',    hint: 'Mandate human oversight at every decision point' },
  },
  structured: {
    low:      { action: 'Observe & Stabilize',               hint: 'Confirm coverage at periodic review' },
    moderate: { action: 'Define & Track Metrics',            hint: 'Build monitoring baseline' },
    elevated: { action: 'Activate Monitoring Cadence',       hint: 'Schedule regular review cycles' },
    high:     { action: 'Intensify Monitoring & Clarify Roles', hint: 'Define escalation path & decision authority' },
  },
  continuous: {
    low:      { action: 'Run Periodic Checks',               hint: 'Verify controls remain efficient' },
    moderate: { action: 'Optimize Coverage & Efficiency',    hint: 'Review scope against system changes' },
    elevated: { action: 'Track Performance & Detect Drift',  hint: 'Enable automated drift alerting' },
    high:     { action: 'Run Audit & Stress Test',           hint: 'Review bias signals & failure modes' },
  },
  embedded: {
    low:      { action: 'Maintain Standard Operations',      hint: 'No immediate action required' },
    moderate: { action: 'Maintain & Schedule Reassessment',  hint: 'Annual review against regulatory updates' },
    elevated: { action: 'Sustain & Verify Regulatory Alignment', hint: 'Check for scope or context changes' },
    high:     { action: 'Maintain Continuous Assurance',     hint: 'Commission external audit annually' },
  },
};

// ━━━ IMMEDIATE ACTIONS ━━━

const IMMEDIATE_ACTIONS: Record<MaturityLevel, Record<ExposureLevel, string>> = {
  absent: {
    low:      'Define system scope and assign an accountable governance owner.',
    moderate: 'Establish basic oversight roles and document the system purpose.',
    elevated: 'Structure accountability before next operating cycle. Establish oversight layer prior to continued system use.',
    high:     'Suspend or constrain system operation until governance layer is in place.',
  },
  adhoc: {
    low:      'Document existing processes and assign review ownership.',
    moderate: 'Standardize review cadence and escalation path.',
    elevated: 'Formalize roles and review cadence. Ensure escalation path is documented and tested.',
    high:     'Mandate human review at every model decision point immediately.',
  },
  structured: {
    low:      'Maintain documentation currency. Schedule periodic reviews.',
    moderate: 'Introduce basic performance metrics and review triggers.',
    elevated: 'Activate scheduled monitoring cadence. Assign metric ownership.',
    high:     'Escalate to senior oversight. Initiate intensive review cycle.',
  },
  continuous: {
    low:      'Continue standard operations. Review annually.',
    moderate: 'Verify monitoring coverage and update baselines.',
    elevated: 'Enable automated alerting. Review performance against baseline.',
    high:     'Commission external audit. Test failure modes and bias signals.',
  },
  embedded: {
    low:      'Maintain current posture. Monitor regulatory changes.',
    moderate: 'Verify continued alignment with evolving standards.',
    elevated: 'Verify regulatory alignment. Check for scope or context changes.',
    high:     'Engage external auditor for annual assurance review.',
  },
};

// ━━━ REASONING SIGNALS ━━━

const REG_SIGNALS: Record<ExposureLevel, string> = {
  high: 'Under EU AI Act Annex III, this system category is designated high-risk, requiring traceable oversight, human review mechanisms, and documented accountability chains.',
  elevated: 'Systems at this exposure level carry direct human impact. EU AI Act Article 14 mandates effective human oversight, and ISO/IEC 42001 requires documented governance accountability.',
  moderate: 'At moderate exposure, governance structures should be preventive rather than reactive. NIST AI RMF Govern function recommends defined roles and review cycles before incidents occur.',
  low: 'Low exposure reduces urgency but does not eliminate governance obligations. Foundational documentation and scope definition establish the baseline for future oversight.',
};

const MATURITY_GAP: Record<MaturityLevel, string> = {
  absent: 'No governance layer is currently in place. This creates an accountability vacuum where risk decisions are made without defined authority or review mechanisms.',
  adhoc: 'Governance exists but is reactive and person-dependent. Without repeatable processes, coverage is inconsistent and gaps emerge under operational pressure.',
  structured: 'Processes are defined but monitoring is not yet continuous. The system operates within a governance framework, but drift and emerging risks may go undetected between review cycles.',
  continuous: 'Monitoring is active but stress-tested infrequently. The system operates strongly; remaining risk lies in edge cases and regulatory evolution.',
  embedded: 'Governance is deeply integrated. Ongoing obligation is to maintain alignment as the system, context, and regulatory environment evolve.',
};

// ━━━ CORE FUNCTIONS ━━━

/**
 * Compute weighted maturity from three governance dimensions.
 * Applies minimum safeguard principle: any absent dimension caps at Ad Hoc.
 */
export function computeWeightedMaturity(
  oversight: MaturityLevel,
  monitoring: MaturityLevel,
  documentation: MaturityLevel,
): { maturity: MaturityLevel; rawScore: number; safeguardApplied: boolean; absentDimensions: string[] } {
  const dims = { oversight, monitoring, documentation };
  const absentDimensions: string[] = [];

  if (oversight === 'absent') absentDimensions.push('oversight');
  if (monitoring === 'absent') absentDimensions.push('monitoring');
  if (documentation === 'absent') absentDimensions.push('documentation');

  const hasAbsent = absentDimensions.length > 0;

  const rawScore = (
    MATURITY_LEVELS.indexOf(dims.oversight) * WEIGHTS.oversight +
    MATURITY_LEVELS.indexOf(dims.monitoring) * WEIGHTS.monitoring +
    MATURITY_LEVELS.indexOf(dims.documentation) * WEIGHTS.documentation
  ) / WEIGHT_SUM;

  const roundedIndex = Math.round(Math.max(0, Math.min(4, rawScore)));
  const computed = MATURITY_LEVELS[roundedIndex];

  // Minimum safeguard principle
  const safeguardApplied = hasAbsent && MATURITY_LEVELS.indexOf(computed) > 1;
  const maturity = safeguardApplied ? 'adhoc' : computed;

  return { maturity, rawScore, safeguardApplied, absentDimensions };
}

/**
 * Calculate urgency index from maturity × exposure.
 * Exposure dominates (1.6), maturity mitigates (0.8).
 */
export function computeUrgency(
  maturity: MaturityLevel,
  exposure: ExposureLevel,
): { level: UrgencyLevel; score: number } {
  const mIdx = MATURITY_LEVELS.indexOf(maturity);
  const eIdx = EXPOSURE_LEVELS.indexOf(exposure);

  const score = eIdx * URGENCY_WEIGHTS.exposure - mIdx * URGENCY_WEIGHTS.maturity;

  let level: UrgencyLevel;
  if (score >= 4.5) level = 'critical';
  else if (score >= 3) level = 'high';
  else if (score >= 1.5) level = 'moderate';
  else if (score >= 0.5) level = 'low';
  else level = 'minimal';

  return { level, score };
}

/**
 * Compute 30-day target: advance each dimension one level (capped at embedded).
 */
export function computeThirtyDayTarget(
  oversight: MaturityLevel,
  monitoring: MaturityLevel,
  documentation: MaturityLevel,
): { oversight: MaturityLevel; monitoring: MaturityLevel; documentation: MaturityLevel; summary: string } {
  const advance = (level: MaturityLevel): MaturityLevel => {
    const idx = MATURITY_LEVELS.indexOf(level);
    return MATURITY_LEVELS[Math.min(4, idx + 1)];
  };

  const target = {
    oversight: advance(oversight),
    monitoring: advance(monitoring),
    documentation: advance(documentation),
  };

  const summary = `Oversight: ${MATURITY_LABELS[target.oversight]} · Monitoring: ${MATURITY_LABELS[target.monitoring]} · Documentation: ${MATURITY_LABELS[target.documentation]}`;

  return { ...target, summary };
}

/**
 * Generate rule-based dimension flags for absent dimensions.
 */
function getDimensionFlags(
  oversight: MaturityLevel,
  monitoring: MaturityLevel,
  documentation: MaturityLevel,
): string[] {
  const flags: string[] = [];

  if (monitoring === 'absent') {
    flags.push('The absence of monitoring creates operational blindness — the system cannot detect performance degradation, bias emergence, or drift in real time.');
  }
  if (oversight === 'absent') {
    flags.push('Without a defined oversight structure, there is no accountable party to authorize decisions or respond to incidents.');
  }
  if (documentation === 'absent') {
    flags.push('Missing documentation undermines audit readiness and prevents regulators or reviewers from reconstructing decision logic.');
  }

  return flags;
}

// ━━━ MAIN FUNCTION ━━━

/**
 * Generate the full Governance Activation Matrix result.
 * Pure function — no side effects, no API calls. Fully deterministic.
 */
export function generateMatrix(input: MatrixInput): MatrixResult {
  const { exposure, oversight, monitoring, documentation } = input;

  // 1. Weighted maturity
  const maturityResult = computeWeightedMaturity(oversight, monitoring, documentation);

  // 2. Urgency
  const urgencyResult = computeUrgency(maturityResult.maturity, exposure);

  // 3. Activation posture
  const posture = POSTURES[maturityResult.maturity][exposure];
  const immediateAction = IMMEDIATE_ACTIONS[maturityResult.maturity][exposure]
    || 'Review governance posture and assign accountable owner.';

  // 4. 30-day target
  const thirtyDayTarget = computeThirtyDayTarget(oversight, monitoring, documentation);

  // 5. Reasoning (rule-based)
  const dimensionFlags = getDimensionFlags(oversight, monitoring, documentation);
  const safeguardNote = maturityResult.safeguardApplied
    ? 'Overall maturity has been capped at Ad Hoc by the minimum safeguard principle — a critical governance gap in one or more dimensions prevents a higher rating despite partial coverage elsewhere.'
    : '';

  return {
    weightedMaturity: maturityResult.maturity,
    rawMaturityScore: maturityResult.rawScore,
    safeguardApplied: maturityResult.safeguardApplied,
    safeguardDimensions: maturityResult.absentDimensions,
    urgencyIndex: urgencyResult.level,
    urgencyScore: urgencyResult.score,
    posture,
    immediateAction,
    thirtyDayTarget,
    reasoning: {
      regulatorySignal: REG_SIGNALS[exposure],
      maturityGap: MATURITY_GAP[maturityResult.maturity],
      dimensionFlags,
      safeguardNote,
    },
    input,
  };
}

// ━━━ DELTA COMPARISON ━━━

export interface MatrixDelta {
  maturityChange: number;           // -4 to +4
  urgencyChange: string;            // "improved" | "unchanged" | "worsened"
  dimensionChanges: {
    oversight: number;
    monitoring: number;
    documentation: number;
  };
  summary: string;
}

/**
 * Compare two matrix results to produce a delta summary.
 * Useful for Track stage — showing progress over time.
 */
export function computeDelta(previous: MatrixResult, current: MatrixResult): MatrixDelta {
  const prevIdx = MATURITY_LEVELS.indexOf(previous.weightedMaturity);
  const currIdx = MATURITY_LEVELS.indexOf(current.weightedMaturity);
  const maturityChange = currIdx - prevIdx;

  const prevUrgency = ['minimal', 'low', 'moderate', 'high', 'critical'].indexOf(previous.urgencyIndex);
  const currUrgency = ['minimal', 'low', 'moderate', 'high', 'critical'].indexOf(current.urgencyIndex);
  const urgencyDelta = currUrgency - prevUrgency;
  const urgencyChange = urgencyDelta < 0 ? 'improved' : urgencyDelta > 0 ? 'worsened' : 'unchanged';

  const dimensionChanges = {
    oversight: MATURITY_LEVELS.indexOf(current.input.oversight) - MATURITY_LEVELS.indexOf(previous.input.oversight),
    monitoring: MATURITY_LEVELS.indexOf(current.input.monitoring) - MATURITY_LEVELS.indexOf(previous.input.monitoring),
    documentation: MATURITY_LEVELS.indexOf(current.input.documentation) - MATURITY_LEVELS.indexOf(previous.input.documentation),
  };

  const parts: string[] = [];
  if (maturityChange > 0) parts.push(`Maturity improved by ${maturityChange} level(s)`);
  else if (maturityChange < 0) parts.push(`Maturity declined by ${Math.abs(maturityChange)} level(s)`);
  else parts.push('Overall maturity unchanged');

  if (urgencyChange === 'improved') parts.push('urgency reduced');
  else if (urgencyChange === 'worsened') parts.push('urgency increased');

  return {
    maturityChange,
    urgencyChange,
    dimensionChanges,
    summary: parts.join('; ') + '.',
  };
}
