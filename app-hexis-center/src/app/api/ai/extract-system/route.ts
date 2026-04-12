/**
 * POST /api/ai/extract-system
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ORIENT Step 1 (Observe) — AI System Information Extraction
 *
 * Flow:
 * 1. Auth + rate limit check
 * 2. Validate input (free-text description)
 * 3. Call Claude with extract_system_info tool (structured output)
 * 4. Return extracted fields + follow-up questions
 * 5. Log usage for cost tracking
 *
 * The client (observe-form.tsx) uses this to auto-fill the system
 * registration form from a natural language description.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { callClaude } from '@/lib/claude/client';
import { EXTRACT_SYSTEM_INFO } from '@/lib/claude/tools';
import { OBSERVE_PROMPT, fillPrompt } from '@/lib/claude/prompts';
import { authenticateRequest, checkRateLimit, logUsage } from '@/lib/api/auth';
import {
  sanitizeInput,
  buildSafetyPreamble,
  runSafetyPipeline,
  buildBlockedResponse,
} from '@/lib/claude/safety';

// ━━━ INPUT VALIDATION ━━━

const ExtractRequestSchema = z.object({
  /** Free-text description of the AI system */
  description: z.string().min(10, 'Description must be at least 10 characters'),
  /** Optional existing data to provide context */
  existingData: z
    .object({
      name: z.string().optional(),
    })
    .optional(),
});

// ━━━ HANDLER ━━━

export async function POST(request: Request) {
  const startTime = Date.now();

  // 1. Auth
  const ctx = await authenticateRequest(request);
  if (!ctx) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }

  // 2. Rate limit
  const rateLimitOk = await checkRateLimit(ctx);
  if (!rateLimitOk) {
    return NextResponse.json(
      { error: 'Daily AI request limit reached. Try again tomorrow.' },
      { status: 429 },
    );
  }

  // 3. Parse + validate input
  let body: z.infer<typeof ExtractRequestSchema>;
  try {
    const raw = await request.json();
    body = ExtractRequestSchema.parse(raw);
  } catch (err) {
    const message =
      err instanceof z.ZodError
        ? err.errors.map((e) => e.message).join(', ')
        : 'Invalid request body';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // 4. Input sanitization (Layer 1)
  const sanitization = sanitizeInput(body.description);
  let safeDescription = body.description;
  if (sanitization.injectionDetected) {
    safeDescription = buildSafetyPreamble(body.description, sanitization.riskLevel as 'medium' | 'high');
    console.warn(`[extract-system] Injection detected (${sanitization.riskLevel}):`, sanitization.detectedPatterns);
  }

  // 5. Build context for prompt
  const contextParts: string[] = [];
  if (body.existingData?.name) {
    contextParts.push(`Known system name: ${body.existingData.name}`);
  }
  contextParts.push(`User description: ${body.description}`);

  const systemPrompt = fillPrompt(OBSERVE_PROMPT, {
    SYSTEM_CONTEXT: contextParts.join('\n'),
  });

  // 6. Call Claude
  try {
    const response = await callClaude({
      systemPrompt,
      messages: [
        {
          role: 'user',
          content: sanitization.injectionDetected ? safeDescription : body.description,
        },
      ],
      tools: [EXTRACT_SYSTEM_INFO],
      toolChoice: { type: 'tool', name: 'extract_system_info' },
      model: 'haiku', // Fast + cheap for extraction
    });

    // 7. Safety pipeline (Layers 2-4)
    const safetyResult = runSafetyPipeline({
      inputText: body.description,
      outputText: response.textContent,
      toolResult: response.toolResult,
      model: response.model,
      orientStep: 'observe',
      usage: {
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
        cacheReadTokens: response.usage.cacheReadTokens,
      },
      latencyMs: Date.now() - startTime,
      requiredOutputFields: ['name', 'purpose'],
    });

    if (safetyResult.level !== 'green') {
      console.warn(`[extract-system] Safety ${safetyResult.level}:`, safetyResult.summary);
    }

    // Red-level: block AI output
    if (safetyResult.shouldBlock) {
      return NextResponse.json(
        buildBlockedResponse(safetyResult),
        { status: 422 },
      );
    }

    // 8. Log usage
    await logUsage(
      ctx,
      '/api/ai/extract-system',
      response.model,
      {
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
        cacheReadTokens: response.usage.cacheReadTokens,
      },
      Date.now() - startTime,
    );

    // 9. Return extracted data
    if (response.toolResult) {
      return NextResponse.json({
        extracted: response.toolResult,
        safety: {
          level: safetyResult.level,
          outputId: safetyResult.metadata.outputId,
        },
        meta: {
          engine: 'claude',
          model: response.model,
          latencyMs: Date.now() - startTime,
        },
      });
    }

    // Fallback: Claude didn't use the tool
    return NextResponse.json(
      { error: 'AI extraction failed — please fill the form manually' },
      { status: 500 },
    );
  } catch (err) {
    console.error('[extract-system] Claude API error:', err);

    // Graceful degradation — don't crash the form
    return NextResponse.json(
      {
        error:
          'AI extraction is temporarily unavailable. Please fill the form manually.',
      },
      { status: 503 },
    );
  }
}
