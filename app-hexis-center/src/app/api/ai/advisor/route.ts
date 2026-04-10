/**
 * POST /api/ai/advisor
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Universal Compliance Advisor — Multi-turn Claude Conversation
 *
 * Works across all ORIENT steps:
 * - Observe: "How should I describe my system?"
 * - Risk: "Does Art. 6(3) exception apply to my case?"
 * - Identify: "How do I implement this obligation?"
 * - Evaluate: "How can I improve my oversight level?"
 * - Navigate: "My team is 2 people — how do we prioritize?"
 * - Track: "How should I present this score to the board?"
 *
 * Supports:
 * - New conversation (no conversationId)
 * - Continue conversation (with conversationId)
 * - Full context from system's ORIENT journey
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { callClaude } from '@/lib/claude/client';
import { authenticateRequest, checkRateLimit, logUsage } from '@/lib/api/auth';
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';

// ━━━ INPUT VALIDATION ━━━

const AdvisorRequestSchema = z.object({
  systemId: z.string().uuid(),
  orientStep: z.enum(['observe', 'risk', 'identify', 'evaluate', 'navigate', 'track']),
  message: z.string().min(1).max(4000),
  conversationId: z.string().uuid().optional(),
});

// ━━━ ORIENT STEP PROMPTS ━━━

const STEP_CONTEXT: Record<string, string> = {
  observe: `The user is in the OBSERVE step — registering and describing their AI system.
Help them understand what information matters for compliance and why.
Think like a consultant doing an intake interview.`,

  risk: `The user is in the RISK step — understanding their system's risk classification.
The deterministic classifier has already assigned a risk level.
Help them understand the classification, edge cases, and implications.
NEVER override the classifier's decision — only explain and enrich.`,

  identify: `The user is in the IDENTIFY step — reviewing their compliance obligations.
Help them understand each obligation practically: what it requires, how to implement it,
what evidence to keep, and common pitfalls for SMEs.
Reference specific EU AI Act articles.`,

  evaluate: `The user is in the EVALUATE step — assessing their governance maturity.
The matrix engine has calculated their posture based on Oversight, Monitoring, and Documentation levels.
Help them understand gaps, prioritize improvements, and set realistic 30-day targets.`,

  navigate: `The user is in the NAVIGATE step — building their compliance action plan.
Claude has generated an initial plan. Help them refine it based on their constraints:
team size, budget, timeline, existing processes. Be practical about prioritization.`,

  track: `The user is in the TRACK step — monitoring compliance progress and generating reports.
Help them interpret their compliance score, prepare for reviews, and communicate
governance status to different audiences (board, DPO, auditor).`,
};

// ━━━ HANDLER ━━━

export async function POST(request: Request) {
  const startTime = Date.now();

  // 1. Auth
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  // 2. Rate limit
  const rateCheck = await checkRateLimit(ctx, 'ai/advisor');
  if (!rateCheck.allowed) return rateCheck.error;

  // 3. Validate input
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

  // 4. Verify system access
  const { data: system } = await ctx.supabase
    .from('ai_systems')
    .select('id, name, purpose, description, organisation_role, deployment_status')
    .eq('id', body.systemId)
    .single();

  if (!system) {
    return NextResponse.json({ error: 'System not found or access denied' }, { status: 404 });
  }

  // 5. Fetch ORIENT context for enrichment
  const [classificationRes, assessmentRes, obligationsRes, actionsRes] = await Promise.all([
    ctx.supabase.from('risk_classifications')
      .select('risk_level, article_references, ai_insight')
      .eq('system_id', system.id)
      .order('classified_at', { ascending: false })
      .limit(1)
      .single(),
    ctx.supabase.from('assessments')
      .select('oversight_level, monitoring_level, documentation_level, weighted_maturity, activation_posture, urgency_index')
      .eq('system_id', system.id)
      .order('assessed_at', { ascending: false })
      .limit(1)
      .single(),
    ctx.supabase.from('obligations')
      .select('title, article_reference, status, category')
      .eq('system_id', system.id),
    ctx.supabase.from('actions')
      .select('title, priority, status')
      .eq('system_id', system.id),
  ]);

  // 6. Load or create conversation
  let conversationMessages: Array<{ role: string; content: string }> = [];
  let conversationId = body.conversationId;

  if (conversationId) {
    const { data: conv } = await ctx.supabase
      .from('advisor_conversations')
      .select('messages')
      .eq('id', conversationId)
      .eq('system_id', body.systemId)
      .single();

    if (conv?.messages) {
      conversationMessages = conv.messages as Array<{ role: string; content: string }>;
    }
  }

  // 7. Build system context summary
  const classification = classificationRes.data;
  const assessment = assessmentRes.data;
  const obligations = obligationsRes.data ?? [];
  const actions = actionsRes.data ?? [];

  const obligationSummary = obligations.length > 0
    ? `Obligations: ${obligations.filter(o => o.status === 'completed').length}/${obligations.length} completed`
    : 'No obligations mapped yet';

  const actionSummary = actions.length > 0
    ? `Actions: ${actions.filter(a => a.status === 'done').length}/${actions.length} done`
    : 'No action plan yet';

  const systemContext = [
    `System: "${system.name}"`,
    system.purpose ? `Purpose: ${system.purpose}` : null,
    `Role: ${system.organisation_role || 'not set'}`,
    classification ? `Risk Level: ${classification.risk_level}` : 'Risk: not classified yet',
    assessment ? `Governance Posture: ${assessment.activation_posture} (urgency: ${assessment.urgency_index})` : null,
    assessment ? `Maturity — Oversight: ${assessment.oversight_level}, Monitoring: ${assessment.monitoring_level}, Documentation: ${assessment.documentation_level}` : null,
    obligationSummary,
    actionSummary,
  ].filter(Boolean).join('\n');

  const systemPrompt = `You are Hexis AI Governance Advisor — a practical EU AI Act compliance consultant for SMEs.

${STEP_CONTEXT[body.orientStep]}

<system_context>
${systemContext}
</system_context>

Rules:
- Be concise but thorough — aim for 2-4 paragraphs per response
- Always cite specific EU AI Act articles (e.g., "Art. 9(1)")
- If unsure, say "This is a gray area — consider consulting legal counsel"
- Use calibrated confidence: "clearly required" / "likely applies" / "gray area" / "seek specialist"
- Tailor advice to SMEs with limited resources
- Never invent article numbers or obligations that don't exist
- If the user asks about something outside EU AI Act, acknowledge the boundary`;

  // 8. Build message history for Claude
  const claudeMessages: MessageParam[] = [
    ...conversationMessages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: body.message },
  ];

  // 9. Call Claude
  try {
    const claudeResponse = await callClaude({
      systemPrompt,
      messages: claudeMessages,
      model: 'haiku',
      includeGrounding: true,
      maxTokens: 2048,
    });

    // Extract text response
    const assistantMessage = claudeResponse.content
      .filter((block): block is { type: 'text'; text: string } => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    // 10. Save conversation
    const updatedMessages = [
      ...conversationMessages,
      { role: 'user', content: body.message },
      { role: 'assistant', content: assistantMessage },
    ];

    if (conversationId) {
      // Update existing conversation
      await ctx.supabase
        .from('advisor_conversations')
        .update({
          messages: updatedMessages,
          message_count: updatedMessages.length,
          total_input_tokens: claudeResponse.usage.inputTokens,
          total_output_tokens: claudeResponse.usage.outputTokens,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId);
    } else {
      // Create new conversation
      const { data: newConv } = await ctx.supabase
        .from('advisor_conversations')
        .insert({
          system_id: body.systemId,
          user_id: ctx.userId,
          orient_step: body.orientStep,
          title: body.message.slice(0, 100),
          messages: updatedMessages,
          message_count: updatedMessages.length,
          total_input_tokens: claudeResponse.usage.inputTokens,
          total_output_tokens: claudeResponse.usage.outputTokens,
        })
        .select('id')
        .single();

      conversationId = newConv?.id ?? undefined;
    }

    // 11. Log usage (non-fatal)
    try {
      await logUsage(ctx, 'ai/advisor', claudeResponse.model, {
        inputTokens: claudeResponse.usage.inputTokens,
        outputTokens: claudeResponse.usage.outputTokens,
        cacheReadTokens: claudeResponse.usage.cacheReadTokens,
      }, Date.now() - startTime);
    } catch (logErr) {
      console.warn('[advisor] Failed to log usage:', logErr);
    }

    return NextResponse.json({
      message: assistantMessage,
      conversationId,
      messageCount: updatedMessages.length,
      meta: {
        engine: 'advisor-v1',
        model: claudeResponse.model,
        latencyMs: Date.now() - startTime,
        step: body.orientStep,
      },
    });
  } catch (err) {
    console.error('[advisor] Claude API error:', err);
    return NextResponse.json(
      { error: 'AI advisor temporarily unavailable. Please try again.' },
      { status: 503 },
    );
  }
}
