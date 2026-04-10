/**
 * Generate Action Plan — ORIENT Step 5: Navigate
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * POST /api/ai/generate-plan
 *
 * Collects all ORIENT data (Observe → Risk → Identify → Evaluate),
 * runs the navigate engine for context, then calls Claude (Sonnet)
 * to generate an intelligent, prioritized action plan.
 *
 * Actions are stored in the `actions` table for tracking.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest, checkRateLimit, logUsage } from '@/lib/api/auth';
import { logGovernanceEvent, triggerInvalidation, EVENT_TYPES } from '@/lib/governance/event-logger';
import { callClaude } from '@/lib/claude/client';
import { GENERATE_ACTION_PLAN } from '@/lib/claude/tools';
import { NAVIGATE_PROMPT, fillPrompt } from '@/lib/claude/prompts';
import {
  generateNavigateContext,
  type NavigateInput,
  type ObligationSummary,
} from '@/lib/engines/navigate-engine';

// ━━━ INPUT SCHEMA ━━━

const GeneratePlanSchema = z.object({
  systemId: z.string().uuid(),
  /** Optional user constraints (e.g. "2 person team, 10 hours/week") */
  userConstraints: z.string().optional().default(''),
  /** Force regeneration even if actions exist */
  force: z.boolean().optional().default(false),
});

// ━━━ HANDLER ━━━

export async function POST(request: Request) {
  const startTime = Date.now();

  // 1. Auth
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  // 2. Rate limit
  const rateCheck = await checkRateLimit(ctx, 'ai/generate-plan');
  if (!rateCheck.allowed) return rateCheck.error;

  // 3. Validate input
  let input: z.infer<typeof GeneratePlanSchema>;
  try {
    const body = await request.json();
    input = GeneratePlanSchema.parse(body);
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  // 4. Check existing actions (unless force=true)
  if (!input.force) {
    const { count } = await ctx.supabase
      .from('actions')
      .select('id', { count: 'exact', head: true })
      .eq('system_id', input.systemId);

    if ((count ?? 0) > 0) {
      return NextResponse.json(
        { error: 'Action plan already exists. Use force=true to regenerate.' },
        { status: 409 },
      );
    }
  }

  // 5. Fetch all ORIENT data
  const [systemRes, classificationRes, obligationsRes, assessmentRes] = await Promise.all([
    ctx.supabase
      .from('ai_systems')
      .select('id, name, purpose, organisation_role, eu_market, deployment_status')
      .eq('id', input.systemId)
      .single(),
    ctx.supabase
      .from('risk_classifications')
      .select('risk_level, article_references, classification_path')
      .eq('system_id', input.systemId)
      .order('classified_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    ctx.supabase
      .from('obligations')
      .select('id, title, article_reference, category, status, deadline, applies_to')
      .eq('system_id', input.systemId)
      .order('sort_order', { ascending: true }),
    ctx.supabase
      .from('assessments')
      .select('oversight_level, monitoring_level, documentation_level, weighted_maturity, activation_posture, urgency_index, risk_exposure')
      .eq('system_id', input.systemId)
      .order('assessed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const system = systemRes.data;
  const classification = classificationRes.data;
  const obligations = obligationsRes.data;
  const assessment = assessmentRes.data;

  if (!system) {
    return NextResponse.json({ error: 'System not found' }, { status: 404 });
  }
  if (!classification) {
    return NextResponse.json({ error: 'No risk classification found. Complete Step 2 first.' }, { status: 400 });
  }
  if (!obligations || obligations.length === 0) {
    return NextResponse.json({ error: 'No obligations found. Complete Step 3 first.' }, { status: 400 });
  }
  if (!assessment) {
    return NextResponse.json({ error: 'No assessment found. Complete Step 4 first.' }, { status: 400 });
  }

  // 6. Build navigate context
  const navigateInput: NavigateInput = {
    system: {
      id: system.id,
      name: system.name,
      purpose: system.purpose,
      organisationRole: system.organisation_role,
      euMarket: system.eu_market,
      deploymentStatus: system.deployment_status,
    },
    riskLevel: classification.risk_level,
    articleReferences: classification.article_references || [],
    obligations: (obligations as Array<{
      id: string;
      title: string;
      article_reference: string;
      category: string;
      status: string;
      deadline: string | null;
      applies_to: string;
    }>).map((o) => ({
      id: o.id,
      title: o.title,
      articleReference: o.article_reference,
      category: o.category,
      status: o.status as ObligationSummary['status'],
      deadline: o.deadline,
      appliesTo: o.applies_to,
    })),
    assessment: {
      oversightLevel: assessment.oversight_level,
      monitoringLevel: assessment.monitoring_level,
      documentationLevel: assessment.documentation_level,
      weightedMaturity: String(assessment.weighted_maturity),
      activationPosture: assessment.activation_posture,
      urgencyIndex: assessment.urgency_index,
      riskExposure: assessment.risk_exposure as 'low' | 'moderate' | 'elevated' | 'high',
    },
  };

  const navContext = generateNavigateContext(navigateInput);

  // 7. Build obligations status string for prompt
  const obligationsRaw = obligations as Array<{
    id: string; title: string; article_reference: string; status: string;
  }>;
  const obligationsStatus = obligationsRaw.map((o) =>
    `[${o.status}] ${o.title} (${o.article_reference})`
  ).join('\n');

  // 8. Fill prompt
  const prompt = fillPrompt(NAVIGATE_PROMPT, {
    SYSTEM_CONTEXT: navContext.formattedContext,
    RISK_CLASSIFICATION: navContext.riskSummary,
    OBLIGATIONS_STATUS: obligationsStatus,
    ASSESSMENT: `Posture: ${assessment.activation_posture} | Urgency: ${assessment.urgency_index} | Exposure: ${assessment.risk_exposure}`,
    USER_CONSTRAINTS: input.userConstraints || 'No specific constraints provided. Assume SME with limited resources.',
  });

  // 9. Call Claude (Sonnet for complex reasoning)
  try {
    const response = await callClaude({
      systemPrompt: prompt,
      messages: [
        {
          role: 'user',
          content: `Generate a prioritized compliance action plan for "${system.name}". Consider all ORIENT steps completed so far and create actionable, deadline-aware recommendations.`,
        },
      ],
      tools: [GENERATE_ACTION_PLAN],
      toolChoice: { type: 'tool', name: 'generate_action_plan' },
      model: 'sonnet',
      includeGrounding: true,
    });

    const plan = response.toolResult as {
      executive_summary: string;
      critical_path: string;
      actions: Array<{
        title: string;
        description?: string;
        priority: 'critical' | 'high' | 'medium' | 'low';
        reasoning: string;
        estimated_hours?: number;
        deadline_driven?: boolean;
        obligation_refs?: string[];
        dimension_impact?: string[];
      }>;
      resource_estimate?: {
        total_hours?: number;
        suggested_timeline_weeks?: number;
        team_size_recommendation?: string;
      };
    } | null;

    if (!plan || !plan.actions || plan.actions.length === 0) {
      return NextResponse.json(
        { error: 'Claude did not generate a valid action plan' },
        { status: 502 },
      );
    }

    // 10. Delete existing actions if force=true
    if (input.force) {
      await ctx.supabase
        .from('actions')
        .delete()
        .eq('system_id', input.systemId)
        .eq('ai_generated', true);
    }

    // 11. Store actions in DB
    const actionsToInsert = plan.actions.map((action, idx) => {
      // Try to match obligation_refs to actual obligation IDs
      let obligationId: string | null = null;
      if (action.obligation_refs && action.obligation_refs.length > 0) {
        const ref = action.obligation_refs[0];
        const matched = obligations.find(
          (o) => o.article_reference === ref || o.title.includes(ref),
        );
        if (matched) {
          obligationId = matched.id;
        }
      }

      return {
        system_id: input.systemId,
        obligation_id: obligationId,
        title: action.title,
        description: action.description || null,
        priority: action.priority,
        status: 'todo' as const,
        estimated_hours: action.estimated_hours || null,
        dimension_impact: action.dimension_impact || [],
        ai_reasoning: action.reasoning,
        ai_generated: true,
        depends_on: [] as string[],
        sort_order: idx,
      };
    });

    const { data: savedActions, error: insertError } = await ctx.supabase
      .from('actions')
      .insert(actionsToInsert)
      .select('id, title, description, priority, status, estimated_hours, dimension_impact, ai_reasoning, sort_order');

    if (insertError) {
      console.error('Failed to save actions:', insertError);
      // Return plan even if DB save fails
    }

    // 12. Log usage
    const latencyMs = Date.now() - startTime;
    try {
      await logUsage(ctx, 'ai/generate-plan', response.model, {
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
        cacheReadTokens: response.usage.cacheReadTokens,
      }, latencyMs);
    } catch {
      // Non-fatal
    }

    // 12b. Log governance event + trigger invalidation (non-fatal)
    try {
      await logGovernanceEvent(ctx.supabase, {
        orgId: ctx.orgId,
        systemId: input.systemId,
        eventType: EVENT_TYPES.ACTION_CREATED,
        orientStep: 'navigate',
        actorId: ctx.userId,
        newValue: {
          actions_count: plan.actions.length,
          critical_path: plan.critical_path,
          executive_summary: plan.executive_summary.slice(0, 200),
        },
      });

      // Navigate changed → invalidate downstream (track)
      await triggerInvalidation(ctx.supabase, {
        orgId: ctx.orgId,
        systemId: input.systemId,
        sourceStep: 'navigate',
        actorId: ctx.userId,
        changeDescription: `Action plan generated: ${plan.actions.length} actions`,
      });
    } catch {
      // Non-fatal
    }

    return NextResponse.json({
      plan: {
        executiveSummary: plan.executive_summary,
        criticalPath: plan.critical_path,
        resourceEstimate: plan.resource_estimate || null,
      },
      actions: savedActions || actionsToInsert.map((a, i) => ({ ...a, id: `temp-${i}` })),
      actionsCount: plan.actions.length,
      model: response.model,
    });
  } catch (err) {
    console.error('Generate plan error:', err);
    return NextResponse.json(
      { error: 'AI plan generation unavailable' },
      { status: 503 },
    );
  }
}
