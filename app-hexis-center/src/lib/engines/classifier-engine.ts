/**
 * EU AI Act Risk Classifier Engine
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Deterministic decision tree for EU AI Act risk classification.
 * Ported from hexis.center/generator — enhanced with TypeScript types,
 * structured output format, and Claude enrichment readiness.
 *
 * This is the DETERMINISTIC layer. Claude enrichment sits on top
 * (via classify-insight API route) and NEVER overrides this output.
 *
 * Decision priority:
 *   1. Prohibited (Art. 5) → early termination
 *   2. Annex III + no exception → HIGH RISK
 *   3. Annex III + exception + Annex I → HIGH RISK (Annex I overrides)
 *   4. Annex III + exception, no Annex I → NOT HIGH-RISK (Art. 6(3))
 *   5. Annex I alone → HIGH RISK
 *   6. GPAI Systemic → GENERAL-PURPOSE AI
 *   7. GPAI Provider → GENERAL-PURPOSE AI
 *   8. Transparency only → LIMITED RISK
 *   9. Default → MINIMAL RISK
 */

// ━━━ ENUMS & TYPES ━━━

export type RiskLevel =
  | 'prohibited'
  | 'high'
  | 'high_art6_3_override' // Annex I overrides Art. 6(3) exception
  | 'not_high_risk'        // Art. 6(3) exception applied
  | 'gpai'
  | 'gpai_systemic'
  | 'limited'
  | 'minimal';

export type ExposureMapping = 'low' | 'moderate' | 'elevated' | 'high';

export type ChecklistRisk = 'minimal' | 'limited' | 'art6_3' | 'gpai' | 'high';

export type ProhibitedPractice =
  | 'social_scoring'
  | 'realtime_biometric'
  | 'emotion_workplace'
  | 'facial_scraping'
  | 'subliminal'
  | 'vulnerability'
  | 'predictive_policing'
  | 'biometric_categorization'
  | 'none';

export type AnnexIIIArea = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Art6Exception =
  | 'narrow_procedural'
  | 'improve_human'
  | 'detect_patterns'
  | 'preparatory'
  | 'none'; // none = no exception OR performs profiling

export type TransparencyCategory =
  | 'deepfake'
  | 'chatbot'
  | 'emotion_biometric'
  | 'public_content'
  | 'none';

export type GPAIRole =
  | 'gpai_provider'
  | 'gpai_systemic'
  | 'gpai_deployer'
  | 'none';

export const ANNEX_III_LABELS: Record<AnnexIIIArea, string> = {
  1: 'Biometrics',
  2: 'Critical infrastructure',
  3: 'Education and vocational training',
  4: 'Employment and worker management',
  5: 'Essential private and public services',
  6: 'Law enforcement',
  7: 'Migration, asylum and border control',
  8: 'Administration of justice and democratic processes',
};

// ━━━ PROHIBITED PRACTICES ━━━

export const PROHIBITED_PRACTICES: Record<Exclude<ProhibitedPractice, 'none'>, {
  label: string;
  article: string;
}> = {
  social_scoring: { label: 'Social scoring based on social behavior or personality', article: 'Art. 5(1)(c)' },
  realtime_biometric: { label: 'Real-time biometric identification in public spaces', article: 'Art. 5(1)(h)' },
  emotion_workplace: { label: 'Emotion recognition in workplace or education', article: 'Art. 5(1)(f)' },
  facial_scraping: { label: 'Untargeted facial image scraping for databases', article: 'Art. 5(1)(e)' },
  subliminal: { label: 'Subliminal manipulation or deceptive techniques', article: 'Art. 5(1)(a)' },
  vulnerability: { label: 'Exploitation of age, disability, or socioeconomic vulnerability', article: 'Art. 5(1)(b)' },
  predictive_policing: { label: 'Predictive policing based solely on profiling', article: 'Art. 5(1)(d)' },
  biometric_categorization: { label: 'Biometric categorization deducing race, religion, sexuality', article: 'Art. 5(1)(g)' },
};

// ━━━ OBLIGATION SETS ━━━

export const HIGH_RISK_OBLIGATIONS = [
  { title: 'Risk management system', article: 'Art. 9' },
  { title: 'Data governance and management', article: 'Art. 10' },
  { title: 'Technical documentation', article: 'Art. 11' },
  { title: 'Record-keeping and logging', article: 'Art. 12' },
  { title: 'Transparency and provision of information to deployers', article: 'Art. 13' },
  { title: 'Human oversight measures', article: 'Art. 14' },
  { title: 'Accuracy, robustness and cybersecurity', article: 'Art. 15' },
  { title: 'Conformity assessment before placing on market', article: 'Art. 43' },
] as const;

export const TRANSPARENCY_OBLIGATIONS = [
  { title: 'Inform persons they are interacting with an AI system', article: 'Art. 50(1)' },
  { title: 'Mark AI-generated content as artificially generated', article: 'Art. 50(2)' },
  { title: 'Disclose emotion recognition or biometric categorisation', article: 'Art. 50(3)' },
  { title: 'Label deepfake content with machine-readable disclosure', article: 'Art. 50(4)' },
] as const;

/**
 * Per-category transparency obligation mapping (Bug A fix).
 * The wizard's Step 4 asks which Art. 50 trigger applies — the engine
 * should return only the matching sub-paragraph, not all four.
 *
 * EUR-Lex Article 50 (Regulation (EU) 2024/1689):
 *   50(1) — provider obligation: chatbot disclosure
 *   50(2) — provider obligation: synthetic-content marking
 *   50(3) — deployer obligation: emotion recognition / biometric categorisation disclosure
 *   50(4) — deployer obligation: deepfake / artistic-content disclosure
 */
export const TRANSPARENCY_OBLIGATIONS_BY_CATEGORY: Record<
  Exclude<TransparencyCategory, 'none'>,
  { title: string; article: string }
> = {
  chatbot:           { title: 'Inform persons they are interacting with an AI system', article: 'Art. 50(1)' },
  public_content:    { title: 'Mark AI-generated content as artificially generated',  article: 'Art. 50(2)' },
  emotion_biometric: { title: 'Disclose emotion recognition or biometric categorisation', article: 'Art. 50(3)' },
  deepfake:          { title: 'Label deepfake content with machine-readable disclosure', article: 'Art. 50(4)' },
};

/**
 * Article 4 — AI Literacy obligation (Bug C fix).
 * Applies to every provider AND deployer of an AI system, regardless of
 * risk level, since 2 February 2025. Must be present in every classifier
 * output.
 */
export const AI_LITERACY_OBLIGATION = {
  title: 'Ensure sufficient AI literacy of staff operating or using the AI system',
  article: 'Art. 4',
} as const;

export const GPAI_OBLIGATIONS = [
  { title: 'Technical documentation for the model', article: 'Art. 53(1)(a)' },
  { title: 'Information and documentation to downstream providers', article: 'Art. 53(1)(b)' },
  { title: 'Copyright policy and compliance', article: 'Art. 53(1)(c)' },
  { title: 'Publish summary of training content', article: 'Art. 53(1)(d)' },
] as const;

export const GPAI_SYSTEMIC_OBLIGATIONS = [
  ...GPAI_OBLIGATIONS,
  { title: 'Model evaluation including adversarial testing', article: 'Art. 55(1)(a)' },
  { title: 'Assess and mitigate systemic risks', article: 'Art. 55(1)(b)' },
  { title: 'Track, document and report serious incidents', article: 'Art. 55(1)(c)' },
  { title: 'Ensure adequate level of cybersecurity', article: 'Art. 55(1)(d)' },
] as const;

export const ART6_3_OBLIGATIONS = [
  { title: 'Document Art. 6(3) assessment before placing on market', article: 'Art. 6(4)' },
  { title: 'Register system in EU database with Art. 6(3) assessment', article: 'Art. 49(2)' },
  { title: 'Voluntary codes of conduct encouraged', article: 'Art. 95' },
  { title: 'Monitor regulatory developments for reclassification triggers', article: '' },
] as const;

export const MINIMAL_OBLIGATIONS = [
  { title: 'Voluntary codes of conduct encouraged', article: 'Art. 95' },
  { title: 'Consider implementing transparency measures', article: '' },
  { title: 'Monitor EU AI Act regulatory developments for reclassification triggers', article: '' },
] as const;

// ━━━ INPUT ━━━

export interface ClassificationInput {
  // Step 1: Prohibited practices
  prohibitedPractice: ProhibitedPractice;

  // Step 2: Annex I (product safety)
  isAnnexI: boolean;

  // Step 3: Annex III domain
  annexIIIArea: AnnexIIIArea | null;

  // Step 3b: Art. 6(3) exception
  art6Exception: Art6Exception;

  // Step 4: Transparency
  transparencyCategory: TransparencyCategory;

  // Step 5: GPAI
  gpaiRole: GPAIRole;

  // Step 6: FRIA
  hasFRIA: boolean;

  // Observe context (optional — for KVKK and enrichment)
  observe?: {
    systemName?: string;
    hasPersonalData?: boolean;
    kvkkCategories?: string[];
    kvkkHasSpecialCategory?: boolean;
    euMarket?: boolean;
    organisationRole?: 'provider' | 'deployer' | 'distributor' | 'importer';
  };
}

// ━━━ OUTPUT ━━━

export interface Obligation {
  title: string;
  article: string;
}

export interface ClassificationResult {
  // Core classification
  riskLevel: RiskLevel;
  displayLevel: string;         // Human-readable: "HIGH RISK", "LIMITED RISK", etc.
  category: string;             // e.g. "Annex III — Area 4"
  articleReferences: string[];  // e.g. ["Art. 6(2)", "Annex III Area 4"]

  // Enforcement
  deadline: string | null;      // ISO date: "2026-08-02"
  deadlineLabel: string | null; // "2 August 2026"
  penalty: string | null;       // Penalty text

  // Obligations
  obligations: Obligation[];
  supplementary: string[];      // Additional notes, caveats

  // Mapping outputs (feed into matrix + checklist)
  exposureMapping: ExposureMapping;
  checklistRisk: ChecklistRisk;

  // Metadata for Claude enrichment
  classificationPath: {
    prohibitedPractice: ProhibitedPractice;
    isAnnexI: boolean;
    annexIIIArea: AnnexIIIArea | null;
    art6Exception: Art6Exception;
    transparencyCategory: TransparencyCategory;
    gpaiRole: GPAIRole;
    hasFRIA: boolean;
  };

  // KVKK context (if personal data present)
  kvkk?: {
    scope: 'full' | 'partial' | 'minimal';
    warnings: string[];
  };
}

// ━━━ PENALTIES ━━━
// Art. 99 paragraph mapping (verified against Regulation (EU) 2024/1689):
//   99(3) — prohibited practices (Art. 5)            → €35M / 7%
//   99(4) — non-compliance with any other provision  → €15M / 3%   ← high-risk, transparency, GPAI
//   99(5) — supply of incorrect information to       → €7.5M / 1%
//          notified bodies / competent authorities

const PENALTY = {
  prohibited: 'Up to €35 million or 7% of total worldwide annual turnover, whichever is higher (Art. 99(3))',
  nonCompliance: 'Up to €15 million or 3% of total worldwide annual turnover, whichever is higher (Art. 99(4))',
  incorrectInfo: 'Up to €7.5 million or 1% of total worldwide annual turnover, whichever is higher (Art. 99(5))',
} as const;

// ━━━ DEADLINES ━━━

const DEADLINE = {
  prohibited: { iso: '2025-02-02', label: '2 February 2025 (in force)' },
  annexIII: { iso: '2026-08-02', label: '2 August 2026' },
  annexI: { iso: '2027-08-02', label: '2 August 2027' },
  gpai: { iso: '2025-08-02', label: '2 August 2025 (in force)' },
  transparency: { iso: '2026-08-02', label: '2 August 2026' },
} as const;

// ━━━ MAIN CLASSIFIER ━━━

/**
 * Classify an AI system's risk level under the EU AI Act.
 * Pure function — no side effects, no API calls. Fully deterministic.
 */
export function classifyRisk(input: ClassificationInput): ClassificationResult {
  const { prohibitedPractice, isAnnexI, annexIIIArea, art6Exception, transparencyCategory, gpaiRole, hasFRIA } = input;

  // ── Step 1: Prohibited check (early termination) ──
  if (prohibitedPractice !== 'none') {
    const practice = PROHIBITED_PRACTICES[prohibitedPractice];
    return buildResult({
      riskLevel: 'prohibited',
      displayLevel: 'PROHIBITED (Unacceptable Risk)',
      category: `Prohibited Practice — ${practice.article}`,
      articleReferences: ['Article 5', practice.article],
      deadline: DEADLINE.prohibited.iso,
      deadlineLabel: DEADLINE.prohibited.label,
      penalty: PENALTY.prohibited,
      obligations: [{ title: 'System cannot be placed on or used in the EU market', article: 'Art. 5' }],
      supplementary: [`Prohibited practice: ${practice.label}`],
      exposureMapping: 'high',
      checklistRisk: 'high',
      input,
    });
  }

  const isAnnexIII = annexIIIArea !== null;
  const hasArt6Exception = isAnnexIII && art6Exception !== 'none';
  const hasTransparency = transparencyCategory !== 'none';
  const isGPAI = gpaiRole === 'gpai_provider';
  const isGPAISystemic = gpaiRole === 'gpai_systemic';
  const isGPAIDeployer = gpaiRole === 'gpai_deployer';

  const supplementary: string[] = [];

  // ── Scenario 1: Annex III, no exception → HIGH RISK ──
  if (isAnnexIII && !hasArt6Exception) {
    if (isAnnexI) {
      supplementary.push('Also covered by Annex I product safety legislation (Art. 6(1)) — additional deadline 2 August 2027');
    }
    appendCrossCutting(supplementary, { hasTransparency, hasFRIA, isAnnexI, isAnnexIII, isGPAI, isGPAISystemic, isGPAIDeployer, riskLevel: 'high' });

    return buildResult({
      riskLevel: 'high',
      displayLevel: 'HIGH RISK',
      category: `Annex III — Area ${annexIIIArea} (${ANNEX_III_LABELS[annexIIIArea!]})`,
      articleReferences: [`Article 6(2)`, `Annex III Area ${annexIIIArea}`],
      deadline: DEADLINE.annexIII.iso,
      deadlineLabel: DEADLINE.annexIII.label,
      penalty: PENALTY.nonCompliance,
      obligations: [...HIGH_RISK_OBLIGATIONS],
      supplementary,
      exposureMapping: 'high',
      checklistRisk: 'high',
      input,
    });
  }

  // ── Scenario 2: Annex III WITH exception ──
  if (isAnnexIII && hasArt6Exception) {
    // Critical: Annex I OVERRIDES the exception
    if (isAnnexI) {
      supplementary.push('Art. 6(3) exception applies to Annex III only — Annex I product safety obligations remain HIGH RISK');
      supplementary.push('If system subsequently performs profiling, Annex III high-risk obligations also apply (Art. 6(3) last paragraph)');
      appendCrossCutting(supplementary, { hasTransparency, hasFRIA, isAnnexI, isAnnexIII, isGPAI, isGPAISystemic, isGPAIDeployer, riskLevel: 'high' });

      return buildResult({
        riskLevel: 'high_art6_3_override',
        displayLevel: 'HIGH RISK',
        category: `Annex I + Annex III Area ${annexIIIArea} (Art. 6(3) exception on Annex III only)`,
        articleReferences: ['Article 6(1)', 'Article 6(3)', `Annex I + Annex III Area ${annexIIIArea}`],
        deadline: DEADLINE.annexIII.iso,
        deadlineLabel: DEADLINE.annexIII.label,
        penalty: PENALTY.nonCompliance,
        obligations: [
          ...HIGH_RISK_OBLIGATIONS,
          { title: 'Document Art. 6(3) assessment for Annex III component', article: 'Art. 6(4)' },
        ],
        supplementary,
        exposureMapping: 'high',
        checklistRisk: 'high',
        input,
      });
    }

    // Exception applies — NOT high-risk
    supplementary.push('Art. 6(3) exception applied — provider must document this assessment and update if conditions change');
    supplementary.push('If system subsequently performs profiling, it automatically becomes high-risk (Art. 6(3) last paragraph)');
    appendCrossCutting(supplementary, { hasTransparency, hasFRIA, isAnnexI, isAnnexIII, isGPAI, isGPAISystemic, isGPAIDeployer, riskLevel: 'not_high_risk' });

    return buildResult({
      riskLevel: 'not_high_risk',
      displayLevel: 'NOT HIGH-RISK (Art. 6(3) Exception)',
      category: `Annex III Area ${annexIIIArea} — Exception Applied`,
      articleReferences: ['Article 6(3)', `Annex III Area ${annexIIIArea}`],
      deadline: DEADLINE.annexIII.iso,
      deadlineLabel: DEADLINE.annexIII.label,
      penalty: PENALTY.nonCompliance,
      obligations: [...ART6_3_OBLIGATIONS],
      supplementary,
      exposureMapping: 'moderate',
      checklistRisk: 'art6_3',
      input,
    });
  }

  // ── Scenario 3: Annex I alone → HIGH RISK ──
  if (isAnnexI) {
    appendCrossCutting(supplementary, { hasTransparency, hasFRIA, isAnnexI, isAnnexIII, isGPAI, isGPAISystemic, isGPAIDeployer, riskLevel: 'high' });

    return buildResult({
      riskLevel: 'high',
      displayLevel: 'HIGH RISK',
      category: 'Annex I — Product Safety Legislation',
      articleReferences: ['Article 6(1)', 'Annex I'],
      deadline: DEADLINE.annexI.iso,
      deadlineLabel: DEADLINE.annexI.label,
      penalty: PENALTY.nonCompliance,
      obligations: [...HIGH_RISK_OBLIGATIONS],
      supplementary,
      exposureMapping: 'high',
      checklistRisk: 'high',
      input,
    });
  }

  // ── Scenario 4: GPAI Systemic ──
  if (isGPAISystemic) {
    appendCrossCutting(supplementary, { hasTransparency, hasFRIA, isAnnexI, isAnnexIII, isGPAI: false, isGPAISystemic: true, isGPAIDeployer, riskLevel: 'gpai_systemic' });

    return buildResult({
      riskLevel: 'gpai_systemic',
      displayLevel: 'GENERAL-PURPOSE AI (Systemic Risk)',
      category: 'Systemic Risk — Chapter V',
      articleReferences: ['Articles 51–55'],
      deadline: DEADLINE.gpai.iso,
      deadlineLabel: DEADLINE.gpai.label,
      penalty: PENALTY.nonCompliance,
      obligations: [...GPAI_SYSTEMIC_OBLIGATIONS],
      supplementary,
      exposureMapping: 'high',
      checklistRisk: 'gpai',
      input,
    });
  }

  // ── Scenario 5: GPAI Provider ──
  if (isGPAI) {
    appendCrossCutting(supplementary, { hasTransparency, hasFRIA, isAnnexI, isAnnexIII, isGPAI: true, isGPAISystemic: false, isGPAIDeployer, riskLevel: 'gpai' });

    return buildResult({
      riskLevel: 'gpai',
      displayLevel: 'GENERAL-PURPOSE AI',
      category: 'Provider Obligations — Chapter V',
      articleReferences: ['Articles 51–53'],
      deadline: DEADLINE.gpai.iso,
      deadlineLabel: DEADLINE.gpai.label,
      penalty: PENALTY.nonCompliance,
      obligations: [...GPAI_OBLIGATIONS],
      supplementary,
      exposureMapping: 'elevated',
      checklistRisk: 'gpai',
      input,
    });
  }

  // ── Scenario 6: Transparency only → LIMITED RISK ──
  if (hasTransparency) {
    if (isGPAIDeployer) {
      supplementary.push('GPAI model provider bears separate obligations under Art. 51–53');
    }

    return buildResult({
      riskLevel: 'limited',
      displayLevel: 'LIMITED RISK',
      category: 'Transparency Obligations',
      articleReferences: ['Article 50'],
      deadline: DEADLINE.transparency.iso,
      deadlineLabel: DEADLINE.transparency.label,
      penalty: PENALTY.nonCompliance,
      obligations: transparencyObligationsFor(transparencyCategory),
      supplementary,
      exposureMapping: 'moderate',
      checklistRisk: 'limited',
      input,
    });
  }

  // ── Scenario 7: Minimal risk (default) ──
  if (isGPAIDeployer) {
    supplementary.push('GPAI model provider bears separate obligations under Art. 51–53');
  }

  return buildResult({
    riskLevel: 'minimal',
    displayLevel: 'MINIMAL RISK',
    category: 'Voluntary Compliance',
    articleReferences: ['Article 95'],
    deadline: null,
    deadlineLabel: null,
    penalty: null,
    obligations: [...MINIMAL_OBLIGATIONS],
    supplementary,
    exposureMapping: 'low',
    checklistRisk: 'minimal',
    input,
  });
}

// ━━━ HELPERS ━━━

/**
 * Bug A fix: return only the Art. 50 sub-paragraph(s) that match the
 * transparency category the user selected in Step 4. Previously the
 * engine dumped all four sub-paragraphs unconditionally.
 *
 * If category is 'none' (engine should not call this in that case but
 * defensive), returns an empty array. Multi-select support: when
 * `transparencyCategory` becomes an array in a future revision, switch
 * this to `.flatMap()`.
 */
function transparencyObligationsFor(category: TransparencyCategory): Obligation[] {
  if (category === 'none') return [];
  return [{ ...TRANSPARENCY_OBLIGATIONS_BY_CATEGORY[category] }];
}

interface BuildResultArgs {
  riskLevel: RiskLevel;
  displayLevel: string;
  category: string;
  articleReferences: string[];
  deadline: string | null;
  deadlineLabel: string | null;
  penalty: string | null;
  obligations: Obligation[];
  supplementary: string[];
  exposureMapping: ExposureMapping;
  checklistRisk: ChecklistRisk;
  input: ClassificationInput;
}

function buildResult(args: BuildResultArgs): ClassificationResult {
  // Bug C fix: Art. 4 (AI literacy) applies to every provider/deployer of
  // an AI system regardless of risk level. Prepend it if not already
  // present in the supplied obligations array.
  const obligationsWithLiteracy = args.obligations.some(
    (o) => o.article === AI_LITERACY_OBLIGATION.article
  )
    ? args.obligations
    : [{ ...AI_LITERACY_OBLIGATION }, ...args.obligations];

  const result: ClassificationResult = {
    riskLevel: args.riskLevel,
    displayLevel: args.displayLevel,
    category: args.category,
    articleReferences: args.articleReferences,
    deadline: args.deadline,
    deadlineLabel: args.deadlineLabel,
    penalty: args.penalty,
    obligations: obligationsWithLiteracy,
    supplementary: args.supplementary,
    exposureMapping: args.exposureMapping,
    checklistRisk: args.checklistRisk,
    classificationPath: {
      prohibitedPractice: args.input.prohibitedPractice,
      isAnnexI: args.input.isAnnexI,
      annexIIIArea: args.input.annexIIIArea,
      art6Exception: args.input.art6Exception,
      transparencyCategory: args.input.transparencyCategory,
      gpaiRole: args.input.gpaiRole,
      hasFRIA: args.input.hasFRIA,
    },
  };

  // Attach KVKK context if personal data is present
  if (args.input.observe?.hasPersonalData) {
    const kvkkWarnings: string[] = [];
    const hasSpecial = args.input.observe.kvkkHasSpecialCategory;

    if (hasSpecial) {
      kvkkWarnings.push('Special category personal data detected — enhanced protection required (KVKK Art. 6)');
    }
    kvkkWarnings.push('KVKK Art. 12 technical and administrative measures apply');
    kvkkWarnings.push('KVKK Art. 11 automated individual decision-making rights apply');

    result.kvkk = {
      scope: hasSpecial ? 'full' : 'partial',
      warnings: kvkkWarnings,
    };
  }

  return result;
}

interface CrossCuttingContext {
  hasTransparency: boolean;
  hasFRIA: boolean;
  isAnnexI: boolean;
  isAnnexIII: boolean;
  isGPAI: boolean;
  isGPAISystemic: boolean;
  isGPAIDeployer: boolean;
  riskLevel: string;
}

/**
 * Append cross-cutting obligations that apply across multiple scenarios.
 * Mutates the supplementary array.
 */
function appendCrossCutting(supplementary: string[], ctx: CrossCuttingContext): void {
  if (ctx.hasTransparency && ctx.riskLevel !== 'limited') {
    supplementary.push('Transparency obligations also apply (Art. 50)');
  }
  if (ctx.hasFRIA && (ctx.isAnnexI || ctx.isAnnexIII)) {
    supplementary.push('Fundamental Rights Impact Assessment required before deployment (Art. 27)');
  }
  if ((ctx.isGPAI || ctx.isGPAISystemic) && (ctx.isAnnexI || ctx.isAnnexIII)) {
    supplementary.push('GPAI provider obligations also apply (Art. 51–53)');
  }
  if (ctx.isGPAIDeployer) {
    supplementary.push('GPAI model provider bears separate obligations under Art. 51–53');
  }
}

// ━━━ SKIP WIZARD MAPPING ━━━

export type SkipLevel =
  | 'prohibited'
  | 'high_risk_annex_iii'
  | 'high_risk_annex_i'
  | 'gpai_systemic'
  | 'gpai_standard'
  | 'transparency'
  | 'minimal';

/**
 * For users who skip the wizard and manually select a risk level.
 * Returns a ClassificationInput that produces the expected result.
 */
export function inputFromSkipLevel(skipLevel: SkipLevel): ClassificationInput {
  const base: ClassificationInput = {
    prohibitedPractice: 'none',
    isAnnexI: false,
    annexIIIArea: null,
    art6Exception: 'none',
    transparencyCategory: 'none',
    gpaiRole: 'none',
    hasFRIA: false,
  };

  switch (skipLevel) {
    case 'prohibited':
      return { ...base, prohibitedPractice: 'social_scoring' }; // any prohibited triggers it
    case 'high_risk_annex_iii':
      return { ...base, annexIIIArea: 4, hasFRIA: true }; // Area 4 (employment) as default
    case 'high_risk_annex_i':
      return { ...base, isAnnexI: true };
    case 'gpai_systemic':
      return { ...base, gpaiRole: 'gpai_systemic' };
    case 'gpai_standard':
      return { ...base, gpaiRole: 'gpai_provider' };
    case 'transparency':
      return { ...base, transparencyCategory: 'chatbot' };
    case 'minimal':
      return base;
  }
}
