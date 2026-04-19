/**
 * POST /api/ai/obligation-advisor
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ORIENT Step 3 (Identify) — Claude Obligation Guidance
 *
 * Flow:
 * 1. Auth + rate limit
 * 2. Fetch obligation + system context
 * 3. Call Claude for obligation-specific guidance
 * 4. Cache result in guidance_cache
 * 5. Return guidance
 *
 * Single-shot guidance (MVP) — not multi-turn.
 * Claude provides practical implementation advice for a specific obligation.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { callClaude } from '@/lib/claude/client';
import { OBLIGATION_GUIDANCE } from '@/lib/claude/tools';
import { IDENTIFY_PROMPT, fillPrompt } from '@/lib/claude/prompts';
import { authenticateRequest, checkRateLimit, logUsage } from '@/lib/api/auth';
import {
  sanitizeInput,
  buildSafetyPreamble,
  runSafetyPipeline,
} from '@/lib/claude/safety';

// ━━━ INPUT VALIDATION ━━━

const AdvisorRequestSchema = z.object({
  obligationId: z.string().uuid(),
  // Optional: user can add context about their current situation
  userContext: z.string().max(2000).optional(),
  // Force refresh (ignore cached guidance)
  forceRefresh: z.boolean().optional().default(false),
});

// ━━━ HANDLER ━━━

export async function POST(request: Request) {
  const startTime = Date.now();

  // 1. Authenticate
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  // 2. Rate limit
  const rateCheck = await checkRateLimit(ctx, 'ai/obligation-advisor');
  if (!rateCheck.allowed) return rateCheck.error;

  // 3. Parse & validate
  let body: z.infer<typeof AdvisorRequestSchema>;
  try {
    const raw = await request.json();
    body = AdvisorRequestSchema.parse(raw);
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
      : 'Invalid request body';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // 4. Fetch obligation
  const { data: obligation } = await ctx.supabase
    .from('obligations')
    .select('*')
    .eq('id', body.obligationId)
    .single();

  if (!obligation) {
    return NextResponse.json(
      { error: 'Obligation not found or access denied' },
      { status: 404 },
    );
  }

  // 5. Check cache (unless force refresh)
  if (!body.forceRefresh && obligation.guidance_cache) {
    return NextResponse.json({
      guidance: obligation.guidance_cache,
      cached: true,
      meta: { engine: 'cached', latencyMs: Date.now() - startTime },
    });
  }

  // 6. Fetch system context (separate query — avoids Supabase relationship join issue)
  const { data: system } = await ctx.supabase
    .from('ai_systems')
    .select('id, name, purpose, description, organisation_role')
    .eq('id', obligation.system_id)
    .single();

  if (!system) {
    return NextResponse.json(
      { error: 'AI system not found for this obligation' },
      { status: 404 },
    );
  }

  const { data: classification } = await ctx.supabase
    .from('risk_classifications')
    .select('risk_level, article_references')
    .eq('system_id', system.id)
    .order('classified_at', { ascending: false })
    .limit(1)
    .single();

  // 7. Build prompt using shared templates
  const systemContext = [
    `AI System: "${system.name}"`,
    system.purpose ? `Purpose: ${system.purpose}` : null,
    system.description ? `Description: ${system.description}` : null,
    `Organisation Role: ${system.organisation_role}`,
    classification ? `Risk Level: ${classification.risk_level}` : null,
  ].filter(Boolean).join('\n');

  const obligationContext = [
    `Obligation: ${obligation.title}`,
    `Article: ${obligation.article_reference}`,
    `Description: ${obligation.description}`,
    `Category: ${obligation.category}`,
    `Current Status: ${obligation.status}`,
    obligation.evidence_notes ? `User Notes: ${obligation.evidence_notes}` : null,
    body.userContext ? `User Question: ${body.userContext}` : null,
  ].filter(Boolean).join('\n');

  const systemPrompt = fillPrompt(IDENTIFY_PROMPT, {
    SYSTEM_CONTEXT: systemContext,
    OBLIGATION: obligationContext,
  });

  // 8. Input sanitization (Layer 1)
  const userInput = body.userContext ?? '';
  const sanitization = sanitizeInput(userInput);

  // Build user message — with safety preamble if injection detected
  let userContent = `Provide practical implementation guidance for the obligation "${obligation.title}" (${obligation.article_reference}) for this ${system.organisation_role} organisation.`;
  if (body.userContext) {
    if (sanitization.injectionDetected) {
      userContent += `\n\n${buildSafetyPreamble(body.userContext, sanitization.riskLevel as 'medium' | 'high')}`;
      console.warn(`[obligation-advisor] Injection detected (${sanitization.riskLevel}):`, sanitization.detectedPatterns);
    } else {
      userContent += `\n\nAdditional context from user: ${body.userContext}`;
    }
  }

  // 9. Call Claude
  try {
    const claudeResponse = await callClaude({
      systemPrompt,
      messages: [{ role: 'user', content: userContent }],
      tools: [OBLIGATION_GUIDANCE],
      toolChoice: { type: 'tool', name: 'obligation_guidance' },
      model: 'haiku',
      includeGrounding: true,
    });

    const guidance = claudeResponse.toolResult;

    // 10. Safety pipeline (Layers 2-4)
    const safetyResult = runSafetyPipeline({
      inputText: userInput,
      outputText: claudeResponse.textContent,
      toolResult: guidance,
      model: claudeResponse.model,
      orientStep: 'identify',
      usage: {
        inputTokens: claudeResponse.usage.inputTokens,
        outputTokens: claudeResponse.usage.outputTokens,
        cacheReadTokens: claudeResponse.usage.cacheReadTokens,
      },
      latencyMs: Date.now() - startTime,
      requiredOutputFields: ['summary', 'steps', 'confidence'],
      confidenceLevel: (guidance as Record<string, unknown>)?.confidence as string,
    });

    // Log safety warnings (non-fatal)
    if (safetyResult.level !== 'green') {
      console.warn(`[obligation-advisor] Safety ${safetyResult.level}:`, safetyResult.summary);
    }

    // 11. Cache guidance in DB (non-fatal)
    try {
      await ctx.supabase
        .from('obligations')
        .update({ guidance_cache: guidance })
        .eq('id', body.obligationId);
    } catch (cacheErr) {
      console.warn('[obligation-advisor] Failed to cache guidance:', cacheErr);
    }

    // 12. Log usage (non-fatal)
    try {
      await logUsage(ctx, 'ai/obligation-advisor', claudeResponse.model, {
        inputTokens: claudeResponse.usage.inputTokens,
        outputTokens: claudeResponse.usage.outputTokens,
        cacheReadTokens: claudeResponse.usage.cacheReadTokens,
      }, Date.now() - startTime);
    } catch (logErr) {
      console.warn('[obligation-advisor] Failed to log usage:', logErr);
    }

    return NextResponse.json({
      guidance,
      cached: false,
      safety: {
        level: safetyResult.level,
        articleValidation: safetyResult.metadata.articleValidation,
        disclaimer: safetyResult.metadata.disclaimer,
      },
      meta: {
        engine: 'obligation-advisor-v2',
        model: claudeResponse.model,
        latencyMs: Date.now() - startTime,
        cacheHit: claudeResponse.usage.cacheReadTokens > 0,
        outputId: safetyResult.metadata.outputId,
      },
    });
  } catch (err) {
    console.error('[obligation-advisor] Claude API error:', err);
    return NextResponse.json(
      {
        error: 'AI guidance temporarily unavailable',
        guidance: null,
        cached: false,
        meta: { engine: 'error', latencyMs: Date.now() - startTime },
      },
      { status: 503 },
    );
  }
}
