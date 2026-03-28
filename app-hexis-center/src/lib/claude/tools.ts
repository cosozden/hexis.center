/**
 * Claude Tool Definitions — Structured Output Schemas
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Every ORIENT step has a dedicated tool.
 * Claude uses tool_use to return structured JSON — not free text.
 * This ensures consistent, parseable, hallucination-resistant output.
 */

import type { Tool } from '@anthropic-ai/sdk/resources/messages';

// ━━━ OBSERVE (Step 1) ━━━

export const EXTRACT_SYSTEM_INFO: Tool = {
  name: 'extract_system_info',
  description:
    'Extract structured AI system information from a free-text description. ' +
    'Parse the user\'s natural language input into structured fields for the system inventory.',
  input_schema: {
    type: 'object' as const,
    properties: {
      name: {
        type: 'string',
        description: 'Name of the AI system',
      },
      description: {
        type: 'string',
        description: 'Brief description of what the system does',
      },
      purpose: {
        type: 'string',
        description: 'Primary intended purpose of the AI system',
      },
      provider: {
        type: 'string',
        description: 'Provider/vendor of the AI system (if mentioned)',
      },
      deployment_type: {
        type: 'string',
        enum: ['internal', 'external', 'both'],
        description: 'Whether the system is used internally, externally, or both',
      },
      data_types: {
        type: 'array',
        items: { type: 'string' },
        description: 'Types of data processed by the system',
      },
      processes_personal_data: {
        type: 'boolean',
        description: 'Whether the system processes personal data',
      },
      eu_market: {
        type: 'boolean',
        description: 'Whether the system is deployed in the EU market',
      },
      organisation_role: {
        type: 'string',
        enum: ['provider', 'deployer', 'both'],
        description: 'Organisation\'s role: provider, deployer, or both',
      },
      missing_info: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of important fields not mentioned that should be clarified',
      },
      follow_up_questions: {
        type: 'array',
        items: { type: 'string' },
        description: 'Targeted follow-up questions to gather missing information',
      },
    },
    required: ['name', 'purpose', 'missing_info', 'follow_up_questions'],
  },
};

// ━━━ RISK (Step 2) ━━━

export const CLASSIFY_RISK_INSIGHT: Tool = {
  name: 'classify_risk_insight',
  description:
    'Provide expert analysis on an AI system\'s risk classification result. ' +
    'Enrich the deterministic classification with reasoning, edge cases, and actionable next steps.',
  input_schema: {
    type: 'object' as const,
    properties: {
      validation_reasoning: {
        type: 'string',
        description: 'Explanation of why this risk classification is appropriate, citing specific articles',
      },
      edge_cases: {
        type: 'array',
        items: { type: 'string' },
        description: 'Potential gray areas or edge cases that could affect classification',
      },
      additional_considerations: {
        type: 'array',
        items: { type: 'string' },
        description: 'Important factors the wizard may not have captured',
      },
      gdpr_crossref: {
        type: 'string',
        description: 'GDPR/KVKK cross-references relevant to this system',
      },
      confidence: {
        type: 'string',
        enum: ['clearly_required', 'likely_applies', 'gray_area', 'seek_legal_counsel'],
        description: 'Calibrated confidence level in the classification',
      },
      next_steps: {
        type: 'array',
        items: { type: 'string' },
        description: '3 specific, actionable next steps for the organisation',
      },
      disclaimer: {
        type: 'string',
        description: 'Brief legal disclaimer',
      },
    },
    required: ['validation_reasoning', 'confidence', 'next_steps', 'disclaimer'],
  },
};

// ━━━ IDENTIFY (Step 3) ━━━

export const OBLIGATION_GUIDANCE: Tool = {
  name: 'generate_obligation_guidance',
  description:
    'Generate context-specific guidance for a compliance obligation. ' +
    'Explain what the obligation means for THIS specific AI system, not generic advice.',
  input_schema: {
    type: 'object' as const,
    properties: {
      obligation_title: {
        type: 'string',
        description: 'Title of the obligation being explained',
      },
      what_it_means: {
        type: 'string',
        description: 'What this obligation specifically means for the user\'s AI system',
      },
      practical_steps: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            step: { type: 'string' },
            estimated_effort: { type: 'string' },
          },
          required: ['step'],
        },
        description: 'Concrete steps to fulfill this obligation',
      },
      common_mistakes: {
        type: 'array',
        items: { type: 'string' },
        description: 'Common pitfalls organizations make with this obligation',
      },
      template_suggestion: {
        type: 'string',
        description: 'Which Hexis template or tool can help with this obligation',
      },
      confidence: {
        type: 'string',
        enum: ['clearly_required', 'likely_applies', 'gray_area', 'seek_legal_counsel'],
      },
    },
    required: ['what_it_means', 'practical_steps', 'confidence'],
  },
};

// ━━━ EVALUATE (Step 4) ━━━

export const MATRIX_INSIGHT: Tool = {
  name: 'analyze_governance_gap',
  description:
    'Analyze governance maturity assessment results. ' +
    'Identify critical gaps, regulatory risks, and provide contextual benchmarking.',
  input_schema: {
    type: 'object' as const,
    properties: {
      critical_gap: {
        type: 'string',
        description: 'The most urgent governance gap that needs immediate attention',
      },
      dimension_interaction: {
        type: 'string',
        description: 'How the gaps in different dimensions compound each other',
      },
      regulatory_perspective: {
        type: 'string',
        description: 'What a regulator would focus on given this maturity profile',
      },
      contextual_benchmark: {
        type: 'string',
        description: 'How this profile compares to typical organisations in the same sector/risk level',
      },
      thirty_day_target: {
        type: 'string',
        description: 'A measurable 30-day improvement target',
      },
      trend_analysis: {
        type: 'string',
        description: 'Comparison with previous assessment (if available)',
      },
    },
    required: ['critical_gap', 'regulatory_perspective', 'thirty_day_target'],
  },
};

// ━━━ NAVIGATE (Step 5) ━━━

export const GENERATE_ACTION_PLAN: Tool = {
  name: 'generate_action_plan',
  description:
    'Generate a prioritized compliance action plan based on all previous ORIENT steps. ' +
    'Consider risk level, maturity gaps, obligation status, and resource constraints.',
  input_schema: {
    type: 'object' as const,
    properties: {
      executive_summary: {
        type: 'string',
        description: 'One-paragraph summary of the compliance situation and recommended approach',
      },
      critical_path: {
        type: 'string',
        description: 'The critical path: what must happen first and why',
      },
      actions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            priority: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
            reasoning: { type: 'string' },
            estimated_hours: { type: 'number' },
            deadline_driven: { type: 'boolean' },
            obligation_refs: {
              type: 'array',
              items: { type: 'string' },
            },
            dimension_impact: {
              type: 'array',
              items: { type: 'string', enum: ['oversight', 'monitoring', 'documentation'] },
            },
          },
          required: ['title', 'priority', 'reasoning'],
        },
        description: 'Ordered list of actions, most critical first',
      },
      resource_estimate: {
        type: 'object',
        properties: {
          total_hours: { type: 'number' },
          suggested_timeline_weeks: { type: 'number' },
          team_size_recommendation: { type: 'string' },
        },
      },
    },
    required: ['executive_summary', 'critical_path', 'actions'],
  },
};

// ━━━ TRACK (Step 6) ━━━

export const GENERATE_REPORT: Tool = {
  name: 'generate_compliance_report',
  description:
    'Generate a compliance report adapted to the target audience. ' +
    'Same data, different depth and focus based on who will read it.',
  input_schema: {
    type: 'object' as const,
    properties: {
      audience: {
        type: 'string',
        enum: ['board', 'dpo', 'auditor'],
        description: 'Target audience for the report',
      },
      title: {
        type: 'string',
        description: 'Report title',
      },
      executive_summary: {
        type: 'string',
        description: 'High-level summary appropriate for the audience',
      },
      key_metrics: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            value: { type: 'string' },
            trend: { type: 'string', enum: ['improving', 'stable', 'declining'] },
          },
          required: ['label', 'value'],
        },
      },
      risk_highlights: {
        type: 'array',
        items: { type: 'string' },
        description: 'Top risk items to highlight',
      },
      recommendations: {
        type: 'array',
        items: { type: 'string' },
        description: 'Prioritized recommendations',
      },
      next_review_date: {
        type: 'string',
        description: 'Suggested date for next review',
      },
    },
    required: ['audience', 'title', 'executive_summary', 'key_metrics', 'recommendations'],
  },
};

// ━━━ ALL TOOLS ━━━

export const ALL_TOOLS = {
  extract_system_info: EXTRACT_SYSTEM_INFO,
  classify_risk_insight: CLASSIFY_RISK_INSIGHT,
  generate_obligation_guidance: OBLIGATION_GUIDANCE,
  analyze_governance_gap: MATRIX_INSIGHT,
  generate_action_plan: GENERATE_ACTION_PLAN,
  generate_compliance_report: GENERATE_REPORT,
} as const;
