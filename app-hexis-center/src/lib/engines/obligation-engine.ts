/**
 * EU AI Act Obligation Engine
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Deterministic obligation mapping based on risk level + organisation role.
 * ORIENT stage: Identify — "Map applicable legal obligations"
 *
 * Data sources (verified via web search, March 2026):
 *   - Article 16: Provider obligations for high-risk AI (items a–j)
 *   - Article 26: Deployer obligations for high-risk AI (paragraphs 1–12)
 *   - Article 50: Transparency obligations (all roles)
 *   - Article 53: GPAI provider obligations
 *   - Article 55: GPAI systemic risk obligations
 *   - Article 95: Voluntary codes of conduct (minimal risk)
 *
 * This is the DETERMINISTIC layer. Claude enrichment ("Get Guidance")
 * sits on top via the obligation-advisor API route and NEVER overrides
 * the obligation list itself.
 */

import type { RiskLevel } from './classifier-engine';

// ━━━ TYPES ━━━

/**
 * Categories must match the CHECK constraint in 001_initial_schema.sql:
 * risk_management, data_governance, transparency, human_oversight,
 * technical_documentation, conformity_assessment, registration,
 * post_market_monitoring, fundamental_rights, general_governance, gpai_obligations
 */
export type ObligationCategory =
  | 'risk_management'
  | 'data_governance'
  | 'transparency'
  | 'human_oversight'
  | 'technical_documentation'
  | 'conformity_assessment'
  | 'registration'
  | 'post_market_monitoring'
  | 'fundamental_rights'
  | 'general_governance'
  | 'gpai_obligations';

export type ObligationStatus = 'not_started' | 'in_progress' | 'completed';

export type OrganisationRole = 'provider' | 'deployer' | 'both';

export interface ObligationSeed {
  /** Unique key for upsert — e.g. "provider_art9_risk_management" */
  obligationKey: string;
  /** Display title */
  title: string;
  /** EU AI Act article reference */
  article: string;
  /** Short description of what this obligation requires */
  description: string;
  /** Grouping category */
  category: ObligationCategory;
  /** Which role this obligation applies to */
  appliesTo: 'provider' | 'deployer' | 'all';
}

// ━━━ HIGH-RISK: PROVIDER OBLIGATIONS (Art. 16 → Art. 9–15, 17–20, 43, 47–49) ━━━

const HIGH_RISK_PROVIDER: ObligationSeed[] = [
  {
    obligationKey: 'provider_art9_risk_management',
    title: 'Risk Management System',
    article: 'Art. 9',
    description:
      'Establish, implement, document and maintain a risk management system throughout the lifecycle of the high-risk AI system. Includes identification, analysis, estimation and evaluation of risks.',
    category: 'risk_management',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'provider_art10_data_governance',
    title: 'Data Governance and Management',
    article: 'Art. 10',
    description:
      'Develop training, validation and testing data sets subject to appropriate data governance and management practices — relevance, representativeness, accuracy, completeness.',
    category: 'data_governance',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'provider_art11_technical_documentation',
    title: 'Technical Documentation',
    article: 'Art. 11',
    description:
      'Draw up technical documentation before placing on market or putting into service. Keep it up to date. Documentation must demonstrate compliance with Section 2 requirements.',
    category: 'technical_documentation',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'provider_art12_record_keeping',
    title: 'Record-Keeping and Automatic Logging',
    article: 'Art. 12',
    description:
      'Design and develop the high-risk AI system with capabilities enabling automatic recording of events (logs) throughout its lifecycle.',
    category: 'technical_documentation',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'provider_art13_transparency',
    title: 'Transparency and Information to Deployers',
    article: 'Art. 13',
    description:
      'Design and develop the system to enable deployers to interpret output and use it appropriately. Accompany with instructions for use in an appropriate digital or non-digital format.',
    category: 'transparency',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'provider_art14_human_oversight',
    title: 'Human Oversight Measures',
    article: 'Art. 14',
    description:
      'Design and develop the high-risk AI system so it can be effectively overseen by natural persons during use, including appropriate human-machine interface tools.',
    category: 'human_oversight',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'provider_art15_accuracy_robustness',
    title: 'Accuracy, Robustness and Cybersecurity',
    article: 'Art. 15',
    description:
      'Design and develop the system to achieve appropriate levels of accuracy, robustness and cybersecurity throughout its lifecycle.',
    category: 'technical_documentation',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'provider_art17_quality_management',
    title: 'Quality Management System',
    article: 'Art. 17',
    description:
      'Put in place a quality management system ensuring compliance with this Regulation. Document it in a systematic and orderly manner in the form of written policies, procedures and instructions.',
    category: 'general_governance',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'provider_art43_conformity_assessment',
    title: 'Conformity Assessment',
    article: 'Art. 43',
    description:
      'Ensure the high-risk AI system undergoes the relevant conformity assessment procedure prior to being placed on the market or put into service.',
    category: 'conformity_assessment',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'provider_art47_eu_declaration',
    title: 'EU Declaration of Conformity',
    article: 'Art. 47',
    description:
      'Draw up an EU declaration of conformity for each high-risk AI system and keep it at the disposal of national competent authorities for 10 years.',
    category: 'conformity_assessment',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'provider_art48_ce_marking',
    title: 'CE Marking',
    article: 'Art. 48',
    description:
      'Affix the CE marking to the high-risk AI system or, where not possible, on its packaging or accompanying documentation.',
    category: 'conformity_assessment',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'provider_art49_registration',
    title: 'EU Database Registration',
    article: 'Art. 49(1)',
    description:
      'Register the high-risk AI system in the EU database referred to in Article 71, before placing it on the market or putting it into service.',
    category: 'registration',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'provider_art20_corrective_actions',
    title: 'Corrective Actions and Duty of Information',
    article: 'Art. 20',
    description:
      'Take necessary corrective actions (withdraw, disable, recall) if the AI system is not in conformity. Inform distributors, deployers, authorised representatives and market surveillance authorities.',
    category: 'general_governance',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'provider_art72_post_market_monitoring',
    title: 'Post-Market Monitoring System',
    article: 'Art. 72',
    description:
      'Establish and document a post-market monitoring system proportionate to the nature and risk of the AI system. Actively and systematically collect, document and analyse relevant data.',
    category: 'post_market_monitoring',
    appliesTo: 'provider',
  },
];

// ━━━ HIGH-RISK: DEPLOYER OBLIGATIONS (Art. 26) ━━━

const HIGH_RISK_DEPLOYER: ObligationSeed[] = [
  {
    obligationKey: 'deployer_art26_1_use_instructions',
    title: 'Use in Accordance with Instructions',
    article: 'Art. 26(1)',
    description:
      'Take appropriate technical and organisational measures to ensure the high-risk AI system is used in accordance with the instructions for use accompanying the system.',
    category: 'general_governance',
    appliesTo: 'deployer',
  },
  {
    obligationKey: 'deployer_art26_2_human_oversight',
    title: 'Assign Human Oversight',
    article: 'Art. 26(2)',
    description:
      'Assign human oversight to natural persons who have the necessary competence, training and authority, as well as the necessary support.',
    category: 'human_oversight',
    appliesTo: 'deployer',
  },
  {
    obligationKey: 'deployer_art26_4_input_data',
    title: 'Input Data Relevance and Representativeness',
    article: 'Art. 26(4)',
    description:
      'To the extent the deployer exercises control over the input data, ensure that input data is relevant and sufficiently representative in view of the intended purpose.',
    category: 'data_governance',
    appliesTo: 'deployer',
  },
  {
    obligationKey: 'deployer_art26_5_monitoring',
    title: 'Monitor Operation and Report Incidents',
    article: 'Art. 26(5)',
    description:
      'Monitor the operation of the high-risk AI system based on instructions for use. Where risks are identified, inform the provider and suspend use. Report serious incidents to provider and market surveillance authority.',
    category: 'post_market_monitoring',
    appliesTo: 'deployer',
  },
  {
    obligationKey: 'deployer_art26_6_log_retention',
    title: 'Log Retention',
    article: 'Art. 26(6)',
    description:
      'Keep the logs automatically generated by the high-risk AI system for a period appropriate to the intended purpose, of at least six months, unless otherwise provided by law.',
    category: 'technical_documentation',
    appliesTo: 'deployer',
  },
  {
    obligationKey: 'deployer_art26_7_inform_workers',
    title: 'Inform Workers Representatives',
    article: 'Art. 26(7)',
    description:
      'Before putting into service or using a high-risk AI system at the workplace, inform workers representatives and affected workers that they will be subject to its use.',
    category: 'transparency',
    appliesTo: 'deployer',
  },
  {
    obligationKey: 'deployer_art26_8_registration',
    title: 'EU Database Registration (Public Authorities)',
    article: 'Art. 26(8)',
    description:
      'Deployers that are public authorities or EU institutions shall comply with the registration obligations in Article 49. They shall not use a system that has not been registered in the EU database.',
    category: 'registration',
    appliesTo: 'deployer',
  },
  {
    obligationKey: 'deployer_art26_9_dpia',
    title: 'Data Protection Impact Assessment',
    article: 'Art. 26(9)',
    description:
      'Where applicable, use the information provided under Article 13 to comply with the obligation to carry out a data protection impact assessment under Article 35 of GDPR.',
    category: 'data_governance',
    appliesTo: 'deployer',
  },
  {
    obligationKey: 'deployer_art27_fria',
    title: 'Fundamental Rights Impact Assessment',
    article: 'Art. 27',
    description:
      'Before deploying a high-risk AI system in areas listed in Article 26(10), carry out an assessment of the impact on fundamental rights that the use of such system may produce.',
    category: 'fundamental_rights',
    appliesTo: 'deployer',
  },
];

// ━━━ TRANSPARENCY OBLIGATIONS (Art. 50) — ALL ROLES ━━━

const TRANSPARENCY_ALL: ObligationSeed[] = [
  {
    obligationKey: 'transparency_art50_1_ai_interaction',
    title: 'Inform Persons of AI Interaction',
    article: 'Art. 50(1)',
    description:
      'Ensure that natural persons are informed that they are interacting with an AI system, unless this is obvious from the circumstances and context of use.',
    category: 'transparency',
    appliesTo: 'all',
  },
  {
    obligationKey: 'transparency_art50_2_ai_generated_content',
    title: 'Mark AI-Generated Content',
    article: 'Art. 50(2)',
    description:
      'Mark output of AI systems that generate synthetic audio, image, video or text content in a machine-readable format and detectable as artificially generated or manipulated.',
    category: 'transparency',
    appliesTo: 'all',
  },
  {
    obligationKey: 'transparency_art50_3_emotion_biometric',
    title: 'Disclose Emotion Recognition / Biometric Categorisation',
    article: 'Art. 50(3)',
    description:
      'Inform natural persons exposed to an emotion recognition system or biometric categorisation system about the operation of the system.',
    category: 'transparency',
    appliesTo: 'all',
  },
  {
    obligationKey: 'transparency_art50_4_deepfake',
    title: 'Label Deep Fake Content',
    article: 'Art. 50(4)',
    description:
      'Disclose that content has been artificially generated or manipulated (deep fakes) in a machine-readable format that is detectable.',
    category: 'transparency',
    appliesTo: 'all',
  },
];

// ━━━ GPAI PROVIDER OBLIGATIONS (Art. 53) ━━━

const GPAI_PROVIDER: ObligationSeed[] = [
  {
    obligationKey: 'gpai_art53_1a_technical_documentation',
    title: 'Model Technical Documentation',
    article: 'Art. 53(1)(a)',
    description:
      'Draw up and keep up to date the technical documentation of the model, including its training and testing process and the results of its evaluation.',
    category: 'gpai_obligations',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'gpai_art53_1b_downstream_info',
    title: 'Information to Downstream Providers',
    article: 'Art. 53(1)(b)',
    description:
      'Draw up, keep up to date and make available information and documentation to providers of AI systems who intend to integrate the GPAI model into their systems.',
    category: 'gpai_obligations',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'gpai_art53_1c_copyright',
    title: 'Copyright Policy and Compliance',
    article: 'Art. 53(1)(c)',
    description:
      'Put in place a policy to comply with Union copyright law, in particular to identify and comply with copyright reservations expressed by rights holders pursuant to Article 4(3) of Directive (EU) 2019/790.',
    category: 'gpai_obligations',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'gpai_art53_1d_training_summary',
    title: 'Publish Training Content Summary',
    article: 'Art. 53(1)(d)',
    description:
      'Draw up and make publicly available a sufficiently detailed summary about the content used for training the GPAI model, according to a template provided by the AI Office.',
    category: 'gpai_obligations',
    appliesTo: 'provider',
  },
];

// ━━━ GPAI SYSTEMIC RISK — ADDITIONAL OBLIGATIONS (Art. 55) ━━━

const GPAI_SYSTEMIC_ADDITIONAL: ObligationSeed[] = [
  {
    obligationKey: 'gpai_systemic_art55_1a_evaluation',
    title: 'Model Evaluation Including Adversarial Testing',
    article: 'Art. 55(1)(a)',
    description:
      'Perform model evaluation in accordance with standardised protocols and tools, including conducting and documenting adversarial testing to identify and mitigate systemic risks.',
    category: 'gpai_obligations',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'gpai_systemic_art55_1b_systemic_risks',
    title: 'Assess and Mitigate Systemic Risks',
    article: 'Art. 55(1)(b)',
    description:
      'Assess and mitigate possible systemic risks at Union level, including their sources, that may stem from the development, placing on the market, or use of GPAI models with systemic risk.',
    category: 'risk_management',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'gpai_systemic_art55_1c_incident_reporting',
    title: 'Track and Report Serious Incidents',
    article: 'Art. 55(1)(c)',
    description:
      'Keep track of, document, and report to the AI Office and national competent authorities relevant information about serious incidents and possible corrective measures without undue delay.',
    category: 'gpai_obligations',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'gpai_systemic_art55_1d_cybersecurity',
    title: 'Adequate Cybersecurity for the Model',
    article: 'Art. 55(1)(d)',
    description:
      'Ensure an adequate level of cybersecurity protection for the GPAI model with systemic risk and the physical infrastructure of the model.',
    category: 'gpai_obligations',
    appliesTo: 'provider',
  },
];

// ━━━ ART. 6(3) EXCEPTION OBLIGATIONS ━━━

const ART6_3_OBLIGATIONS: ObligationSeed[] = [
  {
    obligationKey: 'art6_3_documentation',
    title: 'Document Art. 6(3) Assessment',
    article: 'Art. 6(4)',
    description:
      'Document the assessment under Art. 6(3) before placing the system on the market or putting it into service. Update it if conditions change.',
    category: 'technical_documentation',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'art6_3_registration',
    title: 'Register in EU Database with Assessment',
    article: 'Art. 49(2)',
    description:
      'Register the system in the EU database with the Art. 6(3) assessment attached, in addition to standard registration requirements.',
    category: 'registration',
    appliesTo: 'provider',
  },
  {
    obligationKey: 'art6_3_voluntary_codes',
    title: 'Voluntary Codes of Conduct',
    article: 'Art. 95',
    description:
      'Consider adopting voluntary codes of conduct including governance measures, even though the system is classified as not high-risk under Art. 6(3).',
    category: 'general_governance',
    appliesTo: 'all',
  },
  {
    obligationKey: 'art6_3_monitor_reclassification',
    title: 'Monitor for Reclassification Triggers',
    article: '',
    description:
      'Monitor regulatory developments and changes in system use that could trigger reclassification. If the system subsequently performs profiling, it automatically becomes high-risk.',
    category: 'post_market_monitoring',
    appliesTo: 'all',
  },
];

// ━━━ MINIMAL RISK OBLIGATIONS ━━━

const MINIMAL_OBLIGATIONS: ObligationSeed[] = [
  {
    obligationKey: 'minimal_art95_voluntary_codes',
    title: 'Voluntary Codes of Conduct',
    article: 'Art. 95',
    description:
      'Encouraged to draw up codes of conduct intended to foster the voluntary application of requirements set out for high-risk AI systems.',
    category: 'general_governance',
    appliesTo: 'all',
  },
  {
    obligationKey: 'minimal_transparency_consideration',
    title: 'Consider Implementing Transparency Measures',
    article: '',
    description:
      'Even without legal obligation, consider implementing transparency measures as a best practice to build trust with users and affected persons.',
    category: 'transparency',
    appliesTo: 'all',
  },
  {
    obligationKey: 'minimal_monitor_developments',
    title: 'Monitor Regulatory Developments',
    article: '',
    description:
      'Monitor EU AI Act regulatory developments for potential reclassification triggers. Changes in system use or regulatory amendments may change risk classification.',
    category: 'post_market_monitoring',
    appliesTo: 'all',
  },
];

// ━━━ AI LITERACY (Art. 4) — ALL RISK LEVELS, ALL ROLES ━━━

const AI_LITERACY: ObligationSeed = {
  obligationKey: 'all_art4_ai_literacy',
  title: 'AI Literacy',
  article: 'Art. 4',
  description:
    'Ensure staff and other persons dealing with the operation and use of AI systems on their behalf have a sufficient level of AI literacy, taking into account their technical knowledge, experience, education and training.',
  category: 'general_governance',
  appliesTo: 'all',
};

// ━━━ MAIN FUNCTION ━━━

/**
 * Returns the full list of obligations for a given risk level and organisation role.
 *
 * @param riskLevel — from classifier engine result
 * @param organisationRole — from ai_systems table ('provider' | 'deployer' | 'both')
 * @param options.includeTransparency — if classification also has transparency obligations
 * @param options.isGPAI — if system also involves GPAI
 * @param options.isGPAISystemic — if GPAI model has systemic risk
 */
export function getObligationsForRisk(
  riskLevel: RiskLevel | string,
  organisationRole: OrganisationRole,
  options?: {
    includeTransparency?: boolean;
    isGPAI?: boolean;
    isGPAISystemic?: boolean;
  },
): ObligationSeed[] {
  const { includeTransparency, isGPAI, isGPAISystemic } = options ?? {};
  const obligations: ObligationSeed[] = [];

  // ── AI Literacy is universal (Art. 4) — in force since 2 Feb 2025 ──
  obligations.push(AI_LITERACY);

  // ── Risk-level specific obligations ──
  switch (riskLevel) {
    case 'prohibited':
      // No obligations — system must be discontinued
      return [
        {
          obligationKey: 'prohibited_discontinue',
          title: 'Discontinue Prohibited AI System',
          article: 'Art. 5',
          description:
            'This AI system falls under prohibited practices. It must be immediately discontinued. No further obligations apply — compliance means cessation.',
          category: 'general_governance',
          appliesTo: 'all',
        },
      ];

    case 'high':
    case 'high_art6_3_override':
      if (organisationRole === 'provider' || organisationRole === 'both') {
        obligations.push(...HIGH_RISK_PROVIDER);
      }
      if (organisationRole === 'deployer' || organisationRole === 'both') {
        obligations.push(...HIGH_RISK_DEPLOYER);
      }
      break;

    case 'not_high_risk':
      obligations.push(...filterByRole(ART6_3_OBLIGATIONS, organisationRole));
      break;

    case 'gpai':
      obligations.push(...filterByRole(GPAI_PROVIDER, organisationRole));
      break;

    case 'gpai_systemic':
      obligations.push(...filterByRole(GPAI_PROVIDER, organisationRole));
      obligations.push(...filterByRole(GPAI_SYSTEMIC_ADDITIONAL, organisationRole));
      break;

    case 'limited':
      obligations.push(...filterByRole(TRANSPARENCY_ALL, organisationRole));
      break;

    case 'minimal':
    default:
      obligations.push(...filterByRole(MINIMAL_OBLIGATIONS, organisationRole));
      break;
  }

  // ── Cross-cutting: Transparency overlay ──
  if (includeTransparency && riskLevel !== 'limited') {
    const transparencyKeys = new Set(obligations.map((o) => o.obligationKey));
    for (const t of TRANSPARENCY_ALL) {
      if (!transparencyKeys.has(t.obligationKey)) {
        obligations.push(t);
      }
    }
  }

  // ── Cross-cutting: GPAI overlay ──
  if (isGPAISystemic) {
    const existingKeys = new Set(obligations.map((o) => o.obligationKey));
    for (const g of [...GPAI_PROVIDER, ...GPAI_SYSTEMIC_ADDITIONAL]) {
      if (!existingKeys.has(g.obligationKey)) {
        obligations.push(g);
      }
    }
  } else if (isGPAI) {
    const existingKeys = new Set(obligations.map((o) => o.obligationKey));
    for (const g of GPAI_PROVIDER) {
      if (!existingKeys.has(g.obligationKey)) {
        obligations.push(g);
      }
    }
  }

  return obligations;
}

// ━━━ HELPERS ━━━

/**
 * Filters obligation seeds by organisation role.
 * 'all' obligations always pass through.
 */
function filterByRole(
  obligations: ObligationSeed[],
  role: OrganisationRole,
): ObligationSeed[] {
  if (role === 'both') return obligations;
  return obligations.filter(
    (o) => o.appliesTo === 'all' || o.appliesTo === role,
  );
}

/**
 * Returns a human-readable category label for UI grouping.
 */
export function getCategoryLabel(category: ObligationCategory): string {
  const labels: Record<ObligationCategory, string> = {
    risk_management: 'Risk Management',
    data_governance: 'Data Governance',
    transparency: 'Transparency & Information',
    human_oversight: 'Human Oversight',
    technical_documentation: 'Technical Documentation & Record-Keeping',
    conformity_assessment: 'Conformity Assessment & Market Access',
    registration: 'Registration',
    post_market_monitoring: 'Post-Market Monitoring & Reporting',
    fundamental_rights: 'Fundamental Rights',
    general_governance: 'Governance & Organisation',
    gpai_obligations: 'General-Purpose AI Obligations',
  };
  return labels[category] ?? category;
}

/**
 * Returns the display order for categories in the UI.
 */
export function getCategoryOrder(category: ObligationCategory): number {
  const order: Record<ObligationCategory, number> = {
    risk_management: 1,
    data_governance: 2,
    technical_documentation: 3,
    transparency: 4,
    human_oversight: 5,
    conformity_assessment: 6,
    registration: 7,
    post_market_monitoring: 8,
    fundamental_rights: 9,
    general_governance: 10,
    gpai_obligations: 11,
  };
  return order[category] ?? 99;
}

/**
 * Groups obligations by category, sorted by category order.
 */
export function groupByCategory(
  obligations: ObligationSeed[],
): { category: ObligationCategory; label: string; items: ObligationSeed[] }[] {
  const map = new Map<ObligationCategory, ObligationSeed[]>();

  for (const o of obligations) {
    const existing = map.get(o.category) ?? [];
    existing.push(o);
    map.set(o.category, existing);
  }

  return Array.from(map.entries())
    .map(([category, items]) => ({
      category,
      label: getCategoryLabel(category),
      items,
    }))
    .sort((a, b) => getCategoryOrder(a.category) - getCategoryOrder(b.category));
}
