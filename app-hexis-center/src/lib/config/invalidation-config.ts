// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ORIENT Invalidation Config
// Deterministic Layer (Layer 1) of 3-layer invalidation system
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// When an ORIENT step changes, downstream steps may become stale.
// This config defines the deterministic impact map:
//   Layer 1: This file — hard rules, always applied
//   Layer 2: Claude evaluation — "Is this change significant?" (API)
//   Layer 3: UI banner — "This step may be outdated" notification
//

export type OrientStep =
  | 'observe'
  | 'risk'
  | 'identify'
  | 'evaluate'
  | 'navigate'
  | 'track';

export interface InvalidationRule {
  /** The step that changed */
  source: OrientStep;
  /** Steps that become potentially stale when source changes */
  invalidates: OrientStep[];
  /** Severity: 'hard' = always invalidate, 'soft' = show warning only */
  severity: 'hard' | 'soft';
  /** Human-readable reason for the invalidation */
  reason: string;
}

/**
 * ORIENT step invalidation map.
 *
 * Read as: "When [source] changes, [invalidates] steps may be stale."
 *
 * Design principle: Earlier steps have broader impact.
 * Observe changes ripple through everything; Track changes are terminal.
 */
export const INVALIDATION_RULES: InvalidationRule[] = [
  // ── Observe: System identity changed ──
  {
    source: 'observe',
    invalidates: ['risk', 'identify', 'evaluate', 'navigate', 'track'],
    severity: 'hard',
    reason:
      'System description, purpose, or context changed — risk classification and all downstream analysis may no longer apply.',
  },

  // ── Risk: Classification changed ──
  {
    source: 'risk',
    invalidates: ['identify', 'evaluate', 'navigate', 'track'],
    severity: 'hard',
    reason:
      'Risk level changed — obligations, gap assessment, action plan, and compliance score need re-evaluation.',
  },

  // ── Identify: Obligations updated ──
  {
    source: 'identify',
    invalidates: ['evaluate', 'navigate', 'track'],
    severity: 'hard',
    reason:
      'Obligation set changed — maturity assessment, action plan, and compliance score may be based on outdated requirements.',
  },

  // ── Evaluate: Assessment updated ──
  {
    source: 'evaluate',
    invalidates: ['navigate', 'track'],
    severity: 'soft',
    reason:
      'Maturity assessment changed — action priorities and compliance score may need adjustment.',
  },

  // ── Navigate: Action plan updated ──
  {
    source: 'navigate',
    invalidates: ['track'],
    severity: 'soft',
    reason:
      'Action plan changed — compliance score and report reflect outdated roadmap.',
  },

  // ── Track: Terminal step, no downstream impact ──
  // (no entry needed — Track changes don't invalidate anything)
];

/**
 * Get steps invalidated by a change to the given source step.
 */
export function getInvalidatedSteps(source: OrientStep): OrientStep[] {
  const rule = INVALIDATION_RULES.find((r) => r.source === source);
  return rule?.invalidates ?? [];
}

/**
 * Check if a specific step is invalidated by a source change.
 */
export function isStepInvalidated(
  source: OrientStep,
  target: OrientStep
): boolean {
  return getInvalidatedSteps(source).includes(target);
}

/**
 * Get the severity of invalidation between two steps.
 * Returns null if no invalidation relationship exists.
 */
export function getInvalidationSeverity(
  source: OrientStep,
  target: OrientStep
): 'hard' | 'soft' | null {
  const rule = INVALIDATION_RULES.find((r) => r.source === source);
  if (!rule || !rule.invalidates.includes(target)) return null;
  return rule.severity;
}

/**
 * Get human-readable reason for why a step is invalidated.
 */
export function getInvalidationReason(
  source: OrientStep
): string | null {
  const rule = INVALIDATION_RULES.find((r) => r.source === source);
  return rule?.reason ?? null;
}

/**
 * ORIENT step ordering (for comparison and iteration).
 */
export const ORIENT_STEP_ORDER: OrientStep[] = [
  'observe',
  'risk',
  'identify',
  'evaluate',
  'navigate',
  'track',
];

/**
 * Get the index of a step in the ORIENT sequence (0-based).
 */
export function getStepIndex(step: OrientStep): number {
  return ORIENT_STEP_ORDER.indexOf(step);
}
