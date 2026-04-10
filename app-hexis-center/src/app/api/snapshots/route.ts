/**
 * Compliance Snapshots — ORIENT Step 6: Track
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * POST /api/snapshots — Create a new compliance snapshot
 * GET  /api/snapshots?systemId=xxx — Get snapshot history
 *
 * Snapshots are point-in-time compliance scores used for
 * trend tracking and reporting. The score-engine provides
 * deterministic calculation.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/api/auth';
import { logGovernanceEvent, EVENT_TYPES } from '@/lib/governance/event-logger';
import {
  calculateComplianceScore,
  buildSnapshotData,
  type ScoreInput,
} from '@/lib/engines/score-engine';

// ━━━ INPUT SCHEMA ━━━

const CreateSnapshotSchema = z.object({
  systemId: z.string().uuid(),
});

// ━━━ GET — Snapshot History ━━━

export async function GET(request: Request) {
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  const { searchParams } = new URL(request.url);
  const systemId = searchParams.get('systemId');

  if (!systemId) {
    return NextResponse.json(
      { error: 'systemId query parameter required' },
      { status: 400 },
    );
  }

  // Fetch snapshots (newest first, max 30 for chart)
  const { data: snapshots, error } = await ctx.supabase
    .from('compliance_snapshots')
    .select('id, score, obligations_total, obligations_completed, actions_total, actions_completed, metadata, snapshot_at')
    .eq('system_id', systemId)
    .order('snapshot_at', { ascending: false })
    .limit(30);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch snapshots' }, { status: 500 });
  }

  return NextResponse.json({ snapshots: snapshots ?? [] });
}

// ━━━ POST — Create Snapshot ━━━

export async function POST(request: Request) {
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  // Validate input
  let input: z.infer<typeof CreateSnapshotSchema>;
  try {
    const body = await request.json();
    input = CreateSnapshotSchema.parse(body);
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  // Fetch all data needed for score calculation
  const [systemRes, classificationRes, obligationsRes, actionsRes, assessmentRes] = await Promise.all([
    ctx.supabase
      .from('ai_systems')
      .select('id, name, org_id')
      .eq('id', input.systemId)
      .single(),
    ctx.supabase
      .from('risk_classifications')
      .select('risk_level')
      .eq('system_id', input.systemId)
      .order('classified_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    ctx.supabase
      .from('obligations')
      .select('id, status')
      .eq('system_id', input.systemId),
    ctx.supabase
      .from('actions')
      .select('id, status')
      .eq('system_id', input.systemId),
    ctx.supabase
      .from('assessments')
      .select('oversight_level, monitoring_level, documentation_level')
      .eq('system_id', input.systemId)
      .order('assessed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const system = systemRes.data;
  if (!system) {
    return NextResponse.json({ error: 'System not found' }, { status: 404 });
  }

  const classification = classificationRes.data;
  if (!classification) {
    return NextResponse.json({ error: 'No risk classification found' }, { status: 400 });
  }

  const obligations = (obligationsRes.data ?? []) as Array<{ id: string; status: string }>;
  const actions = (actionsRes.data ?? []) as Array<{ id: string; status: string }>;
  const assessment = assessmentRes.data as {
    oversight_level: number;
    monitoring_level: number;
    documentation_level: number;
  } | null;

  // Build score input
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
      observe: true, // system exists
      risk: !!classification,
      identify: obligations.length > 0,
      evaluate: !!assessment,
      navigate: actions.length > 0,
      track: true, // this snapshot is the track step
    },
  };

  // Calculate score
  const score = calculateComplianceScore(scoreInput);
  const snapshotData = buildSnapshotData(scoreInput);

  // Save snapshot
  const { data: snapshot, error: insertError } = await ctx.supabase
    .from('compliance_snapshots')
    .insert({
      org_id: system.org_id,
      system_id: input.systemId,
      score: snapshotData.score,
      obligations_total: snapshotData.obligationsTotal,
      obligations_completed: snapshotData.obligationsCompleted,
      actions_total: snapshotData.actionsTotal,
      actions_completed: snapshotData.actionsCompleted,
      metadata: snapshotData.metadata as unknown as Record<string, unknown>,
    })
    .select('id, score, snapshot_at')
    .single();

  if (insertError) {
    console.error('Failed to save snapshot:', insertError);
    return NextResponse.json({ error: 'Failed to save snapshot' }, { status: 500 });
  }

  // Log governance event (non-fatal)
  try {
    await logGovernanceEvent(ctx.supabase, {
      orgId: system.org_id,
      systemId: input.systemId,
      eventType: EVENT_TYPES.SNAPSHOT_CREATED,
      orientStep: 'track',
      actorId: ctx.userId,
      newValue: {
        score: snapshotData.score,
        obligations_total: snapshotData.obligationsTotal,
        obligations_completed: snapshotData.obligationsCompleted,
        actions_total: snapshotData.actionsTotal,
        actions_completed: snapshotData.actionsCompleted,
      },
    });
  } catch (err) {
    console.warn('[snapshots] Governance event logging failed (non-fatal):', err);
  }

  return NextResponse.json({
    snapshot,
    score,
  });
}
