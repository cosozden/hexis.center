/**
 * POST /api/ai/classify-insight
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ORIENT Step 2 (Risk) — Classification Enrichment
 *
 * Flow:
 * 1. Auth + rate limit check
 * 2. Run deterministic classifier engine
 * 3. Call Claude for structured enrichment (edge cases, reasoning, next steps)
 * 4. Combine deterministic result + Claude insight
 * 5. Save to DB + log usage
 * 6. Return combined result
 *
 * The deterministic engine is AUTHORITATIVE. Claude enriches but never overrides.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  classifyRisk,
  inputFromSkipLevel,
  type ClassificationInput,
  type SkipLevel,
} from '@/lib/engines/classifier-engine';
import { callClaude } from '@/lib/claude/client';
import { CLASSIFY_RISK_INSIGHT } from '@/lib/claude/tools';
import { RISK_PROMPT, fillPrompt } from '@/lib/claude/prompts';
import { authenticateRequest, checkRateLimit, logUsage } from '@/lib/api/auth';

// ━━━ INPUT VALIDATION ━━━

const ClassifyRequestSchema = z.object({
  // System ID — must belong to user's org (validated via RLS)
  systemId: z.string().uuid(),

  // Either provide full wizard input OR a skip level
  wizardInput: z.object({
    prohibitedPractice: z.enum([
      'social_scoring', 'realtime_biometric', 'emotion_workplace',
      'facial_scraping', 'subliminal', 'vulnerability',
      'predictive_policing', 'biometric_categorization', 'none',
    ]),
    isAnnexI: z.boolean(),
    annexIIIArea: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7), z.literal(8), z.null()]),
    art6Exception: z.enum(['narrow_procedural', 'improve_human', 'detect_patterns', 'preparatory', 'none']),
    transparencyCategory: z.enum(['deepfake', 'chatbot', 'emotion_biometric', 'public_content', 'none']),
    gpaiRole: z.enum(['gpai_provider', 'gpai_systemic', 'gpai_deployer', 'none']),
    hasFRIA: z.boolean(),
  }).optional(),

  skipLevel: z.enum([
    'prohibited', 'high_risk_annex_iii', 'high_risk_annex_i',
    'gpai_systemic', 'gpai_standard', 'transparency', 'minimal',
  ]).optional(),

  // Skip Claude enrichment (for testing / cost saving)
  skipEnrichment: z.boolean().optional().default(false),
}).refine(
  (data) => data.wizardInput || data.skipLevel,
  { message: 'Provide either wizardInput or skipLevel' },
);

type ClassifyRequest = z.infer<typeof ClassifyRequestSchema>;

// ━━━ HANDLER ━━━

export async function POST(request: Request) {
  const startTime = Date.now();

  // 1. Authenticate
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  // 2. Parse & validate input
  let body: ClassifyRequest;
  try {
    const raw = await request.json();
    body = ClassifyRequestSchema.parse(raw);
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
      : 'Invalid request body';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // 3. Verify system belongs to user's org
  const { data: system } = await ctx.supabase
    .from('ai_systems')
    .select('id, name, purpose, description, organisation_role, eu_market')
    .eq('id', body.systemId)
    .single();

  if (!system) {
    return NextResponse.json(
      { error: 'AI system not found or access denied' },
      { status: 404 },
    );
  }

  // 4. Run deterministic classifier
  const classifierInput: ClassificationInput = body.wizardInput
    ? {
        ...body.wizardInput,
        observe: {
          systemName: system.name,
          euMarket: system.eu_market ?? true,
          // DB stores 'provider' | 'deployer' | 'both'; engine expects 'provider' | 'deployer' | 'distributor' | 'importer'
          // Map 'both' to 'provider' (highest obligation level) for classification purposes
          organisationRole: system.organisation_role === 'both'
            ? 'provider'
            : (system.organisation_role as 'provider' | 'deployer') ?? 'deployer',
        },
      }
    : inputFromSkipLevel(body.skipLevel as SkipLevel);

  const classificationResult = classifyRisk(classifierInput);

  // 5. Claude enrichment (unless skipped)
  let aiInsight: Record<string, unknown> | null = null;
  let aiModel: string | null = null;
  let aiUsage: { inputTokens: number; outputTokens: number; cacheReadTokens: number } | null = null;

  if (!body.skipEnrichment) {
    // Rate limit check
    const rateCheck = await checkRateLimit(ctx, 'ai/classify-insight');
    if (!rateCheck.allowed) return rateCheck.error;

    // Build system context for Claude
    const systemContext = [
      `System Name: ${system.name}`,
      system.purpose ? `Purpose: ${system.purpose}` : null,
      system.description ? `Description: ${system.description}` : null,
      `Organisation Role: ${system.organisation_role ?? 'deployer'}`,
      `EU Market: ${system.eu_market ? 'Yes' : 'No'}`,
    ].filter(Boolean).join('\n');

    const classificationContext = [
      `Risk Level: ${classificationResult.displayLevel}`,
      `Category: ${classificationResult.category}`,
      `Articles: ${classificationResult.articleReferences.join(', ')}`,
      `Exposure Mapping: ${classificationResult.exposureMapping}`,
      classificationResult.deadline ? `Deadline: ${classificationResult.deadlineLabel}` : null,
      classificationResult.supplementary.length > 0
        ? `Notes: ${classificationResult.supplementary.join('; ')}`
        : null,
    ].filter(Boolean).join('\n');

    const prompt = fillPrompt(RISK_PROMPT, {
      SYSTEM_CONTEXT: systemContext,
      CLASSIFICATION_RESULT: classificationContext,
    });

    try {
      const claudeResponse = await callClaude({
        systemPrompt: prompt,
        messages: [
          {
            role: 'user',
            content: `Analyze this EU AI Act risk classification for "${system.name}" and provide expert enrichment.`,
          },
        ],
        tools: [CLASSIFY_RISK_INSIGHT],
        toolChoice: { type: 'tool', name: 'classify_risk_insight' },
        model: 'haiku',
        includeGrounding: true,
      });

      aiInsight = claudeResponse.toolResult;
      aiModel = claudeResponse.model;
      aiUsage = {
        inputTokens: claudeResponse.usage.inputTokens,
        outputTokens: claudeResponse.usage.outputTokens,
        cacheReadTokens: claudeResponse.usage.cacheReadTokens,
      };
    } catch (err) {
      // Claude failure is non-fatal — deterministic result still returned
      console.error('[classify-insight] Claude API error:', err);
      aiInsight = {
        error: 'AI enrichment temporarily unavailable',
        fallback: true,
      };
    }
  }

  // 6. Save classification to DB
  const { data: savedClassification, error: dbError } = await ctx.supabase
    .from('risk_classifications')
    .insert({
      system_id: body.systemId,
      risk_level: classificationResult.riskLevel === 'high_art6_3_override'
        ? 'high'
        : classificationResult.riskLevel === 'not_high_risk'
          ? 'minimal'
          : classificationResult.riskLevel === 'gpai_systemic'
            ? 'gpai'
            : classificationResult.riskLevel,
      classification_path: classificationResult.classificationPath as unknown as Record<string, unknown>,
      article_references: classificationResult.articleReferences,
      exception_applied: classificationResult.riskLevel === 'not_high_risk' || classificationResult.riskLevel === 'high_art6_3_override',
      exception_details: classificationResult.riskLevel === 'not_high_risk'
        ? 'Art. 6(3) exception applied'
        : classificationResult.riskLevel === 'high_art6_3_override'
          ? 'Art. 6(3) exception on Annex III, overridden by Annex I'
          : null,
      ai_insight: aiInsight,
      ai_confidence: (aiInsight as Record<string, unknown>)?.confidence as string ?? null,
      ai_model: aiModel,
      classified_by: ctx.userId,
    })
    .select('id')
    .single();

  if (dbError) {
    console.error('[classify-insight] DB error:', dbError);
    // Still return the result — DB save failure is non-fatal
  }

  // 7. Log usage (non-fatal — don't crash if logging fails)
  if (aiUsage && aiModel) {
    const latencyMs = Date.now() - startTime;
    try {
      await logUsage(ctx, 'ai/classify-insight', aiModel, aiUsage, latencyMs);
    } catch (err) {
      console.warn('[classify-insight] Failed to log usage:', err);
    }
  }

  // 8. Return combined result
  return NextResponse.json({
    classificationId: savedClassification?.id ?? null,
    // Deterministic result (authoritative)
    classification: {
      riskLevel: classificationResult.riskLevel,
      displayLevel: classificationResult.displayLevel,
      category: classificationResult.category,
      articleReferences: classificationResult.articleReferences,
      deadline: classificationResult.deadline,
      deadlineLabel: classificationResult.deadlineLabel,
      penalty: classificationResult.penalty,
      obligations: classificationResult.obligations,
      supplementary: classificationResult.supplementary,
      exposureMapping: classificationResult.exposureMapping,
      checklistRisk: classificationResult.checklistRisk,
    },
    // Claude enrichment (advisory)
    insight: aiInsight,
    // Metadata
    meta: {
      engine: 'classifier-engine-v1',
      enriched: !!aiInsight && !(aiInsight as Record<string, unknown>)?.fallback,
      model: aiModel,
      latencyMs: Date.now() - startTime,
    },
  });
}
