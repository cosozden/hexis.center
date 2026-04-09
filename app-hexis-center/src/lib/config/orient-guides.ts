// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ORIENT Step Guides
// Starting guides for each ORIENT step in the SaaS platform
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { OrientStep } from './invalidation-config';

export interface OrientGuide {
  step: OrientStep;
  /** Display label */
  title: string;
  /** Short description shown in step header */
  subtitle: string;
  /** Why this step matters — shown in info panel */
  whyItMatters: string;
  /** Practical tips for completing this step */
  tips: string[];
  /** Estimated time to complete (minutes) */
  estimatedMinutes: number;
  /** EU AI Act articles most relevant to this step */
  keyArticles: string[];
  /** Dashboard route for this step */
  route: string;
  /** Icon name (lucide-react) */
  icon: string;
}

export const ORIENT_GUIDES: Record<OrientStep, OrientGuide> = {
  observe: {
    step: 'observe',
    title: 'Observe',
    subtitle: 'Identify the AI system, role, and context',
    whyItMatters:
      'Everything starts with understanding what your AI system does, who it serves, and where it operates. Accurate observation prevents misclassification downstream.',
    tips: [
      'Be specific about the intended purpose — vague descriptions lead to incorrect risk classification.',
      'Identify whether you are a provider, deployer, or both — obligations differ significantly.',
      'Note if the system processes personal data (GDPR/KVKK crossover).',
      'Confirm EU market presence — the AI Act applies to systems placed on or used in the EU market.',
    ],
    estimatedMinutes: 10,
    keyArticles: ['Art. 3 (Definitions)', 'Art. 6 (Classification rules)'],
    route: '/dashboard/systems/[id]',
    icon: 'Eye',
  },

  risk: {
    step: 'risk',
    title: 'Risk',
    subtitle: 'Classify risk level per EU AI Act',
    whyItMatters:
      'Risk classification determines your entire compliance obligation set. A high-risk system has ~40 specific requirements; a minimal-risk system may have none.',
    tips: [
      'Start with prohibited practices check (Art. 5) — if your system falls here, it cannot be deployed.',
      'Check Annex I (product safety) and Annex III (standalone high-risk) separately.',
      'Don\'t forget Art. 6(3) exceptions — some Annex III systems may escape high-risk if they meet all four conditions.',
      'Transparency obligations (Art. 50) apply regardless of risk level for certain system types.',
    ],
    estimatedMinutes: 15,
    keyArticles: [
      'Art. 5 (Prohibited practices)',
      'Art. 6 (Classification)',
      'Art. 50 (Transparency)',
      'Arts. 51–56 (GPAI)',
    ],
    route: '/dashboard/systems/[id]/classify',
    icon: 'ShieldAlert',
  },

  identify: {
    step: 'identify',
    title: 'Identify',
    subtitle: 'Map applicable legal obligations',
    whyItMatters:
      'Each risk level triggers specific obligations. Missing one could mean non-compliance — fines up to €35M or 7% of global turnover.',
    tips: [
      'Obligations differ by role: providers have technical documentation duties, deployers have oversight duties.',
      'High-risk systems have the most obligations — prioritize by deadline proximity.',
      'Some obligations have specific deadlines (Aug 2026 for Annex III, Aug 2027 for Annex I).',
      'Track obligation status from the start — "not started" is the most dangerous status.',
    ],
    estimatedMinutes: 20,
    keyArticles: [
      'Arts. 8–15 (High-risk requirements)',
      'Art. 26 (Deployer obligations)',
      'Art. 50 (Transparency obligations)',
    ],
    route: '/dashboard/systems/[id]/obligations',
    icon: 'FileCheck',
  },

  evaluate: {
    step: 'evaluate',
    title: 'Evaluate',
    subtitle: 'Assess current compliance gaps',
    whyItMatters:
      'The governance activation matrix reveals where you are versus where you need to be. It quantifies your gap across three dimensions: oversight, monitoring, and documentation.',
    tips: [
      'Be honest about current maturity levels — over-estimating creates false confidence.',
      'The minimum safeguard principle means one "Absent" dimension caps your overall maturity at Ad Hoc.',
      'Higher risk exposure amplifies urgency — a small gap in a high-risk system is worse than a large gap in a minimal-risk one.',
      'Use the gap analysis to prioritize: close "Absent" gaps before optimizing "Structured" dimensions.',
    ],
    estimatedMinutes: 15,
    keyArticles: [
      'Art. 9 (Risk management)',
      'Art. 13 (Transparency to users)',
      'Art. 14 (Human oversight)',
      'Art. 17 (Quality management)',
    ],
    route: '/dashboard/systems/[id]/assess',
    icon: 'BarChart3',
  },

  navigate: {
    step: 'navigate',
    title: 'Navigate',
    subtitle: 'Chart path from findings to action',
    whyItMatters:
      'Assessment without action is theater. Navigate turns your gap analysis into a prioritized, deadline-aware action plan that you can actually execute.',
    tips: [
      'Critical actions (blocking compliance) should be scheduled within 30 days.',
      'Link each action to the obligation it addresses — this creates an audit trail.',
      'Consider dependencies: some actions require others to complete first.',
      'Assign owners and due dates — unassigned actions don\'t get done.',
    ],
    estimatedMinutes: 25,
    keyArticles: [
      'Art. 72 (Post-market monitoring)',
      'Art. 43 (Conformity assessment)',
      'Art. 49 (Registration)',
    ],
    route: '/dashboard/systems/[id]/roadmap',
    icon: 'Route',
  },

  track: {
    step: 'track',
    title: 'Track',
    subtitle: 'Set deadlines and review triggers',
    whyItMatters:
      'Compliance is not a one-time event. Track monitors your progress, generates compliance snapshots, and produces reports for different audiences — board, DPO, and auditor.',
    tips: [
      'Take regular snapshots to build a compliance trend — auditors love seeing improvement over time.',
      'Generate board-level reports quarterly and DPO reports monthly.',
      'Set review triggers for regulatory changes, system updates, or incident responses.',
      'A declining score is an early warning — investigate before it becomes a compliance gap.',
    ],
    estimatedMinutes: 10,
    keyArticles: [
      'Art. 72 (Post-market monitoring)',
      'Art. 62 (Reporting serious incidents)',
      'Art. 61 (Post-market monitoring plan)',
    ],
    route: '/dashboard/systems/[id]/track',
    icon: 'Activity',
  },
};

/**
 * Get guide for a specific ORIENT step.
 */
export function getOrientGuide(step: OrientStep): OrientGuide {
  return ORIENT_GUIDES[step];
}

/**
 * Get all guides in ORIENT order.
 */
export function getAllGuides(): OrientGuide[] {
  return [
    ORIENT_GUIDES.observe,
    ORIENT_GUIDES.risk,
    ORIENT_GUIDES.identify,
    ORIENT_GUIDES.evaluate,
    ORIENT_GUIDES.navigate,
    ORIENT_GUIDES.track,
  ];
}

/**
 * Get the next incomplete step based on system data.
 * Returns null if all steps are complete.
 */
export function getNextStep(completedSteps: OrientStep[]): OrientStep | null {
  const allSteps: OrientStep[] = [
    'observe',
    'risk',
    'identify',
    'evaluate',
    'navigate',
    'track',
  ];
  return allSteps.find((step) => !completedSteps.includes(step)) ?? null;
}
