/**
 * Impact Assessment — Layer 2 Claude Invalidation
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * POST /api/ai/impact-assessment
 *
 * When an upstream ORIENT step changes, Layer 1 (deterministic)
 * marks downstream steps as invalidated. Layer 2 (this route)
 * calls Claude to assess whether the change is actually significant
 * enough to require re-evaluation of downstream steps.
 *
 * Flow:
 * 1. Receive change details (source step, what changed)
 * 2. Call Claude Haiku to evaluate impact significance
 * 3. Return assessment: significant / minor / cosmetic
 * 4. If cosmetic, auto-clear invalidation flags
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest, checkRateLimit, logUsage } from '@/lib/api/auth';
import { callClaude } from '@/lib/claude/client';
import { clearInvalidation } from '@/lib/governance/event-logger';
import { getInvalidatedSteps, type OrientStep } from '@/lib/config/invalidation-config';
import {
  sanitizeInput,
  buildSafetyPreamble,
  runSafetyPipeline,
} from '@/lib/claude/safety';

// ━━━ INPUT SCHEMA ━━━

const ImpactAssessmentSchema = z.object({
  systemId: z.string().uuid(),
  sourceStep: z.enum(['observe', 'risk', 'identify', 'evaluate', 'navigate', 'track']),
  changeDescription: z.string().min(1).max(2000),
  previousValue: z.record(z.unknown()).optional(),
  newValue: z.record(z.unknown()).optional(),
});

// ━━━ TOOL DEFINITION ━━━

const IMPACT_ASSESSMENT_TOOL = {
  name: 'assess_change_impact' as const,
  description:
    'Evaluate whether a change to an ORIENT step is significant enough to require re-evaluation of downstream steps.',
  input_schema: {
    type: 'object' as const,
    required: ['significance', 'reasoning', 'affected_steps', 'recommendation'],
    properties: {
      significance: {
        type: 'string' as const,
        enum: ['significant', 'minor', 'cosmetic'],
        description:
          'significant: downstream steps must be re-evaluated. minor: downstream steps should be reviewed but may still be valid. cosmetic: no impact on downstream steps (typo fix, formatting, etc).',
      },
      reasoning: {
        type: 'string' as const,
        description: 'Brief explanation of why this change has/lacks downstream impact.',
      },
      affected_steps: {
        type: 'array' as const,
        items: { type: 'string' as const },
        description: 'ORIENT steps that are actually affected by this change.',
      },
      recommendation: {
        type: 'string' as const,
        description: 'Specific recommended action for the user.',
      },
    },
  },
};

// ━━━ HANDLER ━━━

export async function POST(request: Request) {
  const startTime = Date.now();

  // 1. Auth
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  // 2. Rate limit
  const rateCheck = await checkRateLimit(ctx, 'ai/impact-assessment');
  if (!rateCheck.allowed) return rateCheck.error;

  // 3. Validate input
  let input: z.infer<typeof ImpactAssessmentSchema>;
  try {
    const body = await request.json();
    input = ImpactAssessmentSchema.parse(body);
  } catch {
    return NextResponse.json(
      { error: 'Invalid input — systemId, sourceStep, and changeDescription required' },
      { status: 400 },
    );
  }

  // 4. Get system context
  const { data: system } = await ctx.supabase
    .from('ai_systems')
    .select('name, purpose, organisation_role')
    .eq('id', input.systemId)
    .eq('org_id', ctx.orgId)
    .single();

  if (!system) {
    return NextResponse.json({ error: 'System not found' }, { status: 404 });
  }

  const invalidatedSteps = getInvalidatedSteps(input.sourceStep as OrientStep);

  // 5. Input sanitization (Layer 1)
  const sanitization = sanitizeInput(input.changeDescription);
  let safeChangeDesc = input.changeDescription;
  if (sanitization.injectionDetected) {
    safeChangeDesc = buildSafetyPreamble(input.changeDescription, sanitization.riskLevel as 'medium' | 'high');
    console.warn(`[impact-assessment] Injection detected (${sanitization.riskLevel}):`, sanitization.detectedPatterns);
  }

  // 6. Call Claude Haiku (fast, cheap — appropriate for classification task)
  const prompt = `You are an AI governance expert evaluating whether a change to an AI system's compliance data is significant enough to require re-evaluation of downstream steps.

CONTEXT:
- System: ${system.name}
- Purpose: ${system.purpose ?? 'Not specified'}
- Organisation role: ${system.organisation_role ?? 'deployer'}

CHANGE DETAILS:
- ORIENT step that changed: ${input.sourceStep}
- Description of change: ${safeChangeDesc}
${input.previousValue ? `- Previous value: ${JSON.stringify(input.previousValue)}` : ''}
${input.newValue ? `- New value: ${JSON.stringify(input.newValue)}` : ''}

POTENTIALLY AFFECTED STEPS: ${invalidatedSteps.join(', ')}

Evaluate the significance of this change. Consider:
1. Does the change affect the risk classification logic?
2. Does it change which obligations apply?
3. Does it alter the compliance gap assessment?
4. Is it just a cosmetic change (typo, formatting, minor rewording)?

Use the assess_change_impact tool to provide your assessment.`;

  try {
    const response = await callClaude({
      systemPrompt: 'You are an AI governance change impact assessor for the HEXIS platform.',
      model: 'haiku',
      maxTokens: 500,
      tools: [IMPACT_ASSESSMENT_TOOL],
      toolChoice: { type: 'tool', name: 'assess_change_impact' },
      messages: [{ role: 'user', content: prompt }],
    });

    // Extract tool use result — callClaude already parses toolResult
    if (!response.toolResult) {
      return NextResponse.json(
        { error: 'Claude did not return a structured assessment' },
        { status: 502 },
      );
    }

    const assessment = response.toolResult as {
      significance: 'significant' | 'minor' | 'cosmetic';
      reasoning: string;
      affected_steps: string[];
      recommendation: string;
    };

    // 6b. Safety pipeline (Layers 2-4)
    const safetyResult = runSafetyPipeline({
      inputText: input.changeDescription,
      outputText: response.textContent,
      toolResult: response.toolResult,
      model: response.model,
      orientStep: input.sourceStep,
      usage: {
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
        cacheReadTokens: response.usage.cacheReadTokens,
      },
      latencyMs: Date.now() - startTime,
      requiredOutputFields: ['significance', 'reasoning', 'recommendation'],
    });

    if (safetyResult.level !== 'green') {
      console.warn(`[impact-assessment] Safety ${safetyResult.level}:`, safetyResult.summary);
    }

    // 7. If cosmetic, auto-clear invalidation flags
    if (assessment.significance === 'cosmetic') {
      for (const step of invalidatedSteps) {
        await clearInvalidation(ctx.supabase, {
          systemId: input.systemId,
          step,
        });
      }
    }

    // 7. Log usage
    const latencyMs = Date.now() - startTime;
    try {
      await logUsage(
        ctx,
        'ai/impact-assessment',
        response.model,
        {
          inputTokens: response.usage.inputTokens,
          outputTokens: response.usage.outputTokens,
          cacheReadTokens: response.usage.cacheReadTokens,
        },
        latencyMs,
      );
    } catch {
      console.warn('[impact-assessment] Usage logging failed (non-fatal)');
    }

    return NextResponse.json({
      assessment,
      invalidatedSteps,
      autoCleared: assessment.significance === 'cosmetic',
      safety: {
        level: safetyResult.level,
        outputId: safetyResult.metadata.outputId,
      },
    });
  } catch (err) {
    console.error('[impact-assessment] Claude call failed:', err);
    return NextResponse.json(
      { error: 'Impact assessment failed — falling back to manual review' },
      { status: 502 },
    );
  }
}
