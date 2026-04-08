/**
 * POST /api/ai/matrix-insight
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ORIENT Step 4 (Evaluate) — Claude Governance Gap Analysis
 *
 * Flow:
 * 1. Auth + rate limit
 * 2. Validate matrix input
 * 3. Fetch system context
 * 4. Call Claude for gap analysis (structured output)
 * 5. Return insight
 *
 * The deterministic matrix engine calculates scores.
 * Claude adds expert interpretation: critical gaps, regulatory perspective,
 * contextual benchmarking, and measurable improvement targets.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { callClaude } from '@/lib/claude/client';
import { MATRIX_INSIGHT } from '@/lib/claude/tools';
import { EVALUATE_PROMPT, fillPrompt } from '@/lib/claude/prompts';
import { authenticateRequest, checkRateLimit, logUsage } from '@/lib/api/auth';
import {
  generateMatrix,
  MATURITY_LEVELS,
  MATURITY_LABELS,
  EXPOSURE_LABELS,
  type ExposureLevel,
  type MaturityLevel,
} from '@/lib/engines/matrix-engine';

// ━━━ INPUT VALIDATION ━━━

const MatrixInsightSchema = z.object({
  systemId: z.string().uuid(),
  oversight: z.number().int().min(0).max(4),
  monitoring: z.number().int().min(0).max(4),
  documentation: z.number().int().min(0).max(4),
  exposure: z.enum(['low', 'moderate', 'elevated', 'high']),
  previousAssessment: z
    .object({
      oversight: z.number().int().min(0).max(4),
      monitoring: z.number().int().min(0).max(4),
      documentation: z.number().int().min(0).max(4),
      exposure: z.string(),
    })
    .nullable()
    .optional(),
});

// ━━━ HANDLER ━━━

export async function POST(request: Request) {
  // 1. Auth
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  // 2. Rate limit
  const rateCheck = await checkRateLimit(ctx.userId);
  if (!rateCheck.ok) return rateCheck.error;

  // 3. Validate input
  let input: z.infer<typeof MatrixInsightSchema>;
  try {
    const body = await request.json();
    input = MatrixInsightSchema.parse(body);
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  // 4. Fetch system context
  const { data: system } = await ctx.supabase
    .from('ai_systems')
    .select('name, purpose, organisation_role')
    .eq('id', input.systemId)
    .single();

  if (!system) {
    return NextResponse.json(
      { error: 'System not found' },
      { status: 404 }
    );
  }

  // 5. Fetch classification for context
  const { data: classification } = await ctx.supabase
    .from('risk_classifications')
    .select('risk_level, article_references')
    .eq('system_id', input.systemId)
    .order('classified_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // 6. Run deterministic engine for context
  const oversightLevel = MATURITY_LEVELS[input.oversight] as MaturityLevel;
  const monitoringLevel = MATURITY_LEVELS[input.monitoring] as MaturityLevel;
  const documentationLevel = MATURITY_LEVELS[input.documentation] as MaturityLevel;
  const exposureLevel = input.exposure as ExposureLevel;

  const matrixResult = generateMatrix({
    exposure: exposureLevel,
    oversight: oversightLevel,
    monitoring: monitoringLevel,
    documentation: documentationLevel,
    systemName: system.name,
  });

  // 7. Build previous assessment context
  let previousContext = 'No previous assessment available.';
  if (input.previousAssessment) {
    const prev = input.previousAssessment;
    previousContext = `Previous assessment: Oversight=${MATURITY_LABELS[MATURITY_LEVELS[prev.oversight]]}, ` +
      `Monitoring=${MATURITY_LABELS[MATURITY_LEVELS[prev.monitoring]]}, ` +
      `Documentation=${MATURITY_LABELS[MATURITY_LEVELS[prev.documentation]]}, ` +
      `Exposure=${prev.exposure}`;
  }

  // 8. Build system prompt
  const systemContext = [
    `System: ${system.name}`,
    `Purpose: ${system.purpose || 'Not specified'}`,
    `Role: ${system.organisation_role}`,
    classification ? `Risk Level: ${classification.risk_level}` : 'Risk Level: Not yet classified',
    classification?.article_references
      ? `Articles: ${classification.article_references.join(', ')}`
      : '',
  ].filter(Boolean).join('\n');

  const prompt = fillPrompt(EVALUATE_PROMPT, {
    SYSTEM_CONTEXT: systemContext,
    RISK_EXPOSURE: EXPOSURE_LABELS[exposureLevel],
    OVERSIGHT: `${input.oversight} (${MATURITY_LABELS[oversightLevel]})`,
    MONITORING: `${input.monitoring} (${MATURITY_LABELS[monitoringLevel]})`,
    DOCUMENTATION: `${input.documentation} (${MATURITY_LABELS[documentationLevel]})`,
    WEIGHTED_MATURITY: `${MATURITY_LABELS[matrixResult.weightedMaturity]} (raw: ${matrixResult.rawMaturityScore.toFixed(2)})`,
    ACTIVATION_POSTURE: matrixResult.posture.action,
    URGENCY_INDEX: `${matrixResult.urgencyIndex} (score: ${matrixResult.urgencyScore.toFixed(2)})`,
    PREVIOUS_ASSESSMENT: previousContext,
  });

  // 9. Call Claude
  try {
    const response = await callClaude({
      systemPrompt: prompt,
      messages: [
        {
          role: 'user',
          content: `Analyze the governance assessment for "${system.name}" and provide your expert gap analysis. The matrix engine has calculated the scores — now add your interpretation.`,
        },
      ],
      tools: [MATRIX_INSIGHT],
      toolChoice: { type: 'tool', name: 'analyze_governance_gap' },
      model: 'haiku',
      includeGrounding: true,
    });

    const insight = response.toolResult as Record<string, string> | null;

    // 10. Log usage (non-fatal)
    try {
      await logUsage(ctx.userId, 'matrix_insight', {
        systemId: input.systemId,
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
        cacheReadTokens: response.usage.cacheReadTokens,
        model: response.model,
      });
    } catch {
      // Non-fatal — don't block response
    }

    return NextResponse.json({
      insight,
      model: response.model,
      usage: {
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
      },
    });
  } catch (err) {
    console.error('Matrix insight error:', err);
    return NextResponse.json(
      { error: 'AI analysis unavailable', insight: null },
      { status: 503 }
    );
  }
}
