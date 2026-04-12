/**
 * POST /api/ai/advisor-stream
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Streaming Compliance Advisor — SSE-based real-time responses
 *
 * Same functionality as /api/ai/advisor but streams tokens in real-time.
 * The ComplianceAdvisor component uses this for a dramatically better UX.
 *
 * Response format: Server-Sent Events (SSE)
 * - data: {"type":"text","text":"..."} — text delta
 * - data: {"type":"usage","usage":{...}} — final usage stats
 * - data: {"type":"done"} — stream complete
 * - data: {"type":"error","message":"..."} — error
 */

import { z } from 'zod';
import { streamClaude } from '@/lib/claude/client';
import { authenticateRequest, checkRateLimit, logUsage } from '@/lib/api/auth';
import {
  sanitizeInput,
  buildSafetyPreamble,
  validateArticleReferences,
} from '@/lib/claude/safety';
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';

// ━━━ INPUT VALIDATION ━━━

const StreamRequestSchema = z.object({
  systemId: z.string().uuid(),
  orientStep: z.enum(['observe', 'risk', 'identify', 'evaluate', 'navigate', 'track']),
  message: z.string().min(1).max(4000),
  conversationId: z.string().uuid().optional(),
});

// ━━━ ORIENT STEP PROMPTS ━━━

const STEP_CONTEXT: Record<string, string> = {
  observe: `The user is in the OBSERVE step — registering and describing their AI system.
Help them understand what information matters for compliance and why.`,
  risk: `The user is in the RISK step — understanding their risk classification.
NEVER override the classifier's decision — only explain and enrich.`,
  identify: `The user is in the IDENTIFY step — reviewing compliance obligations.
Help them understand each obligation practically.`,
  evaluate: `The user is in the EVALUATE step — assessing governance maturity.
Help them understand gaps and set realistic improvement targets.`,
  navigate: `The user is in the NAVIGATE step — building their compliance action plan.
Help them refine it based on their constraints.`,
  track: `The user is in the TRACK step — monitoring compliance progress.
Help them interpret scores and prepare for reviews.`,
};

// ━━━ HANDLER ━━━

export async function POST(request: Request) {
  const startTime = Date.now();

  // 1. Auth
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  // 2. Rate limit
  const rateCheck = await checkRateLimit(ctx, 'ai/advisor-stream');
  if (!rateCheck.allowed) return rateCheck.error;

  // 3. Validate input
  let body: z.infer<typeof StreamRequestSchema>;
  try {
    const raw = await request.json();
    body = StreamRequestSchema.parse(raw);
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
      : 'Invalid request body';
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. Verify system access
  const { data: system } = await ctx.supabase
    .from('ai_systems')
    .select('id, name, purpose, description, organisation_role, deployment_status')
    .eq('id', body.systemId)
    .single();

  if (!system) {
    return new Response(JSON.stringify({ error: 'System not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 5. Fetch ORIENT context
  const [classificationRes, assessmentRes, obligationsRes] = await Promise.all([
    ctx.supabase.from('risk_classifications')
      .select('risk_level, article_references')
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
      .select('title, article_reference, status')
      .eq('system_id', system.id),
  ]);

  // 6. Load conversation history
  let conversationMessages: Array<{ role: string; content: string }> = [];

  if (body.conversationId) {
    const { data: conv } = await ctx.supabase
      .from('advisor_conversations')
      .select('messages')
      .eq('id', body.conversationId)
      .eq('system_id', body.systemId)
      .single();

    if (conv?.messages) {
      conversationMessages = conv.messages as Array<{ role: string; content: string }>;
    }
  }

  // 7. Build system context
  const classification = classificationRes.data;
  const assessment = assessmentRes.data;
  const obligations = obligationsRes.data ?? [];

  const obligationSummary = obligations.length > 0
    ? `Obligations: ${obligations.filter(o => o.status === 'completed').length}/${obligations.length} completed`
    : 'No obligations mapped yet';

  const systemContext = [
    `System: "${system.name}"`,
    system.purpose ? `Purpose: ${system.purpose}` : null,
    `Role: ${system.organisation_role || 'not set'}`,
    classification ? `Risk Level: ${classification.risk_level}` : 'Risk: not classified yet',
    assessment ? `Governance Posture: ${assessment.activation_posture} (urgency: ${assessment.urgency_index})` : null,
    assessment ? `Maturity — Oversight: ${assessment.oversight_level}, Monitoring: ${assessment.monitoring_level}, Documentation: ${assessment.documentation_level}` : null,
    obligationSummary,
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
- Never invent article numbers or obligations that don't exist`;

  // 8. Input sanitization (Layer 1)
  const sanitization = sanitizeInput(body.message);
  let safeMessage = body.message;
  if (sanitization.injectionDetected) {
    safeMessage = buildSafetyPreamble(body.message, sanitization.riskLevel as 'medium' | 'high');
    console.warn(`[advisor-stream] Injection detected (${sanitization.riskLevel}):`, sanitization.detectedPatterns);
  }

  // 9. Build message history
  const claudeMessages: MessageParam[] = [
    ...conversationMessages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: safeMessage },
  ];

  // 9. Create streaming response
  const stream = streamClaude({
    systemPrompt,
    messages: claudeMessages,
    model: 'haiku',
    includeGrounding: true,
    maxTokens: 2048,
  });

  // 10. Save conversation asynchronously after stream completes
  // We wrap the stream to capture the full text and save it
  const encoder = new TextEncoder();
  let fullText = '';

  const wrappedStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = stream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Parse the SSE data to capture text
          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'text') {
                  fullText += data.text;
                }
                if (data.type === 'usage') {
                  // Log usage (non-fatal, don't await)
                  logUsage(ctx, 'ai/advisor-stream', data.model, {
                    inputTokens: data.usage.inputTokens,
                    outputTokens: data.usage.outputTokens,
                    cacheReadTokens: data.usage.cacheReadTokens,
                  }, Date.now() - startTime).catch(() => {});
                }
                if (data.type === 'done') {
                  // Post-stream article validation (Layer 2 — non-fatal, async)
                  const articleCheck = validateArticleReferences(fullText);
                  if (articleCheck.hasHallucinatedReferences) {
                    console.warn(`[advisor-stream] Post-stream validation: potentially hallucinated refs: ${articleCheck.invalidReferences.join(', ')}`);
                  }
                  if (articleCheck.subParagraphViolations.length > 0) {
                    console.warn(`[advisor-stream] Sub-paragraph violations: ${articleCheck.subParagraphViolations.join('; ')}`);
                  }

                  // Save conversation (non-fatal, don't await)
                  saveConversation(
                    ctx.supabase,
                    body.systemId,
                    ctx.userId,
                    body.orientStep,
                    body.message,
                    fullText,
                    conversationMessages,
                    body.conversationId,
                  ).catch(err => console.warn('[advisor-stream] Failed to save conversation:', err));
                }
              } catch {
                // Skip non-JSON lines
              }
            }
          }

          controller.enqueue(value);
        }
      } catch (err) {
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'error', message: 'Stream interrupted' })}\n\n`
        ));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(wrappedStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Conversation-Id': body.conversationId ?? '',
    },
  });
}

// ━━━ HELPERS ━━━

async function saveConversation(
  supabase: ReturnType<typeof import('@supabase/supabase-js').createClient>,
  systemId: string,
  userId: string,
  orientStep: string,
  userMessage: string,
  assistantMessage: string,
  previousMessages: Array<{ role: string; content: string }>,
  conversationId?: string,
) {
  const updatedMessages = [
    ...previousMessages,
    { role: 'user', content: userMessage },
    { role: 'assistant', content: assistantMessage },
  ];

  if (conversationId) {
    await supabase
      .from('advisor_conversations')
      .update({
        messages: updatedMessages,
        message_count: updatedMessages.length,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);
  } else {
    await supabase
      .from('advisor_conversations')
      .insert({
        system_id: systemId,
        user_id: userId,
        orient_step: orientStep,
        title: userMessage.slice(0, 100),
        messages: updatedMessages,
        message_count: updatedMessages.length,
      })
      .select('id')
      .single();
  }
}
