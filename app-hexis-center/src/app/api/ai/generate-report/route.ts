/**
 * Generate Compliance Report — ORIENT Step 6: Track
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * POST /api/ai/generate-report
 *
 * Collects all ORIENT data, calculates the current compliance score,
 * then calls Claude (Sonnet) to generate an audience-adapted report.
 *
 * Three audience modes:
 * - board: 1-page executive summary, risk-focused
 * - dpo: Detailed system analysis, obligation tracking
 * - auditor: Article-referenced, evidence-oriented
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest, checkRateLimit, logUsage } from '@/lib/api/auth';
import { logGovernanceEvent, EVENT_TYPES } from '@/lib/governance/event-logger';
import { callClaude } from '@/lib/claude/client';
import { GENERATE_REPORT } from '@/lib/claude/tools';
import { TRACK_PROMPT, fillPrompt } from '@/lib/claude/prompts';
import { calculateComplianceScore, type ScoreInput } from '@/lib/engines/score-engine';

// ━━━ INPUT SCHEMA ━━━

const GenerateReportSchema = z.object({
  systemId: z.string().uuid(),
  audience: z.enum(['board', 'dpo', 'auditor']),
});

// ━━━ HANDLER ━━━

export async function POST(request: Request) {
  const startTime = Date.now();

  // 1. Auth
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  // 2. Rate limit
  const rateCheck = await checkRateLimit(ctx, 'ai/generate-report');
  if (!rateCheck.allowed) return rateCheck.error;

  // 3. Validate input
  let input: z.infer<typeof GenerateReportSchema>;
  try {
    const body = await request.json();
    input = GenerateReportSchema.parse(body);
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  // 4. Fetch all ORIENT data
  const [systemRes, classificationRes, obligationsRes, actionsRes, assessmentRes, snapshotsRes] = await Promise.all([
    ctx.supabase
      .from('ai_systems')
      .select('id, name, purpose, organisation_role, eu_market, deployment_status')
      .eq('id', input.systemId)
      .single(),
    ctx.supabase
      .from('risk_classifications')
      .select('risk_level, article_references')
      .eq('system_id', input.systemId)
      .order('classified_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    ctx.supabase
      .from('obligations')
      .select('id, title, article_reference, category, status, deadline')
      .eq('system_id', input.systemId)
      .order('sort_order', { ascending: true }),
    ctx.supabase
      .from('actions')
      .select('id, title, priority, status, estimated_hours, completed_at')
      .eq('system_id', input.systemId)
      .order('sort_order', { ascending: true }),
    ctx.supabase
      .from('assessments')
      .select('oversight_level, monitoring_level, documentation_level, weighted_maturity, activation_posture, urgency_index, risk_exposure')
      .eq('system_id', input.systemId)
      .order('assessed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    ctx.supabase
      .from('compliance_snapshots')
      .select('score, snapshot_at, metadata')
      .eq('system_id', input.systemId)
      .order('snapshot_at', { ascending: false })
      .limit(5),
  ]);

  const system = systemRes.data;
  const classification = classificationRes.data;
  const obligations = (obligationsRes.data ?? []) as Array<{
    id: string; title: string; article_reference: string; category: string; status: string; deadline: string | null;
  }>;
  const actions = (actionsRes.data ?? []) as Array<{
    id: string; title: string; priority: string; status: string; estimated_hours: number | null; completed_at: string | null;
  }>;
  const assessment = assessmentRes.data as {
    oversight_level: number; monitoring_level: number; documentation_level: number;
    weighted_maturity: number; activation_posture: string; urgency_index: number; risk_exposure: string;
  } | null;
  const snapshots = (snapshotsRes.data ?? []) as Array<{
    score: number; snapshot_at: string; metadata: Record<string, unknown>;
  }>;

  if (!system) {
    return NextResponse.json({ error: 'System not found' }, { status: 404 });
  }
  if (!classification) {
    return NextResponse.json({ error: 'No risk classification found. Complete ORIENT steps first.' }, { status: 400 });
  }

  // 5. Calculate current compliance score
  const scoreInput: ScoreInput = {
    riskLevel: classification.risk_level,
    obligations: {
      total: obligations.length,
      completed: obligations.filter((o) => o.status === 'completed').length,
      inProgress: obligations.filter((o) => o.status === 'in_progress').length,
      notApplicable: obligations.filter((o) => o.status === 'not_applicable').length,
    },
    actions: {
      total: actions.length,
      completed: actions.filter((a) => a.status === 'done').length,
      inProgress: actions.filter((a) => a.status === 'in_progress').length,
    },
    assessment: assessment
      ? {
          oversightLevel: assessment.oversight_level,
          monitoringLevel: assessment.monitoring_level,
          documentationLevel: assessment.documentation_level,
        }
      : null,
    orientSteps: {
      observe: true,
      risk: true,
      identify: obligations.length > 0,
      evaluate: !!assessment,
      navigate: actions.length > 0,
      track: true,
    },
  };

  const complianceScore = calculateComplianceScore(scoreInput);

  // 6. Build compliance data string for prompt
  const obligationsSummary = obligations.map((o) =>
    `[${o.status}] ${o.title} (${o.article_reference})${o.deadline ? ` — Deadline: ${o.deadline}` : ''}`
  ).join('\n');

  const actionsSummary = actions.map((a) =>
    `[${a.status}] ${a.title} — Priority: ${a.priority}${a.completed_at ? ` — Completed: ${new Date(a.completed_at).toLocaleDateString('en-GB')}` : ''}`
  ).join('\n');

  const trendData = snapshots.length > 1
    ? `Score trend (last ${snapshots.length} snapshots): ${snapshots.map((s) => `${s.score} (${new Date(s.snapshot_at).toLocaleDateString('en-GB')})`).join(' → ')}`
    : 'No historical snapshots available yet.';

  const complianceData = `
SYSTEM: ${system.name}
PURPOSE: ${system.purpose || 'Not specified'}
ROLE: ${system.organisation_role} | EU MARKET: ${system.eu_market ? 'Yes' : 'No'} | STATUS: ${system.deployment_status}
RISK LEVEL: ${classification.risk_level}
ARTICLES: ${(classification.article_references as string[] || []).join(', ')}

COMPLIANCE SCORE: ${complianceScore.overall}/100 (${complianceScore.level})
  Obligations: ${complianceScore.components.obligations}/100 (weight 40%)
  Actions: ${complianceScore.components.actions}/100 (weight 25%)
  Governance: ${complianceScore.components.governance}/100 (weight 20%)
  ORIENT Progress: ${complianceScore.components.orientProgress}/100 (weight 15%)

${complianceScore.deadlineStatus ? `DEADLINE: ${complianceScore.deadlineStatus.label} — ${complianceScore.deadlineStatus.daysLeft} days left${complianceScore.deadlineStatus.urgent ? ' ⚠️ URGENT' : ''}` : ''}

OBLIGATIONS (${obligations.filter((o) => o.status === 'completed').length}/${obligations.length} completed):
${obligationsSummary || 'None'}

ACTIONS (${actions.filter((a) => a.status === 'done').length}/${actions.length} completed):
${actionsSummary || 'None'}

GOVERNANCE ASSESSMENT:
${assessment ? `Posture: ${assessment.activation_posture} | Maturity: ${assessment.weighted_maturity} | Urgency: ${assessment.urgency_index} | Exposure: ${assessment.risk_exposure}` : 'No assessment completed.'}

TREND:
${trendData}
`.trim();

  const audienceLabel = {
    board: 'Board / Executive Summary — Keep it concise (1 page max). Focus on risk, score, deadlines, and 3 key actions.',
    dpo: 'Data Protection Officer — Detailed system analysis. Include obligation-by-obligation status, governance gaps, and specific recommendations.',
    auditor: 'External Auditor / Regulator — Article-referenced, evidence-oriented. Document what is done, what is missing, and what evidence exists.',
  };

  // 7. Build system context
  const systemContext = `System: ${system.name} | Risk: ${classification.risk_level} | Role: ${system.organisation_role}`;

  // 8. Fill prompt
  const prompt = fillPrompt(TRACK_PROMPT, {
    SYSTEM_CONTEXT: systemContext,
    COMPLIANCE_DATA: complianceData,
    TARGET_AUDIENCE: audienceLabel[input.audience],
  });

  // 9. Call Claude (Sonnet for report quality)
  try {
    const response = await callClaude({
      systemPrompt: prompt,
      messages: [
        {
          role: 'user',
          content: `Generate a ${input.audience} compliance report for "${system.name}". Include the current compliance score, key metrics, risk highlights, and prioritized recommendations.`,
        },
      ],
      tools: [GENERATE_REPORT],
      toolChoice: { type: 'tool', name: 'generate_compliance_report' },
      model: 'sonnet',
      includeGrounding: true,
    });

    const report = response.toolResult as {
      audience: string;
      title: string;
      executive_summary: string;
      key_metrics: Array<{
        label: string;
        value: string;
        trend?: string;
      }>;
      risk_highlights?: string[];
      recommendations: string[];
      next_review_date?: string;
    } | null;

    if (!report) {
      return NextResponse.json(
        { error: 'Claude did not generate a valid report' },
        { status: 502 },
      );
    }

    // 10. Log usage
    const latencyMs = Date.now() - startTime;
    try {
      await logUsage(ctx, 'ai/generate-report', response.model, {
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
        cacheReadTokens: response.usage.cacheReadTokens,
      }, latencyMs);
    } catch {
      // Non-fatal
    }

    // 10b. Log governance event (non-fatal)
    try {
      await logGovernanceEvent(ctx.supabase, {
        orgId: ctx.orgId,
        systemId: input.systemId,
        eventType: EVENT_TYPES.REPORT_GENERATED,
        orientStep: 'track',
        actorId: ctx.userId,
        newValue: {
          audience: input.audience,
          score: complianceScore.overall,
          score_level: complianceScore.level,
        },
      });
    } catch {
      // Non-fatal
    }

    return NextResponse.json({
      report,
      score: complianceScore,
      model: response.model,
    });
  } catch (err) {
    console.error('Generate report error:', err);
    return NextResponse.json(
      { error: 'AI report generation unavailable' },
      { status: 503 },
    );
  }
}
