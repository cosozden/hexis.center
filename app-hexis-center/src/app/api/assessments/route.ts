/**
 * POST /api/assessments
 * ━━━━━━━━━━━━━━━━━━━━━
 * Save a governance assessment result to the database.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/api/auth';

const AssessmentSchema = z.object({
  systemId: z.string().uuid(),
  oversightLevel: z.number().int().min(0).max(4),
  monitoringLevel: z.number().int().min(0).max(4),
  documentationLevel: z.number().int().min(0).max(4),
  weightedMaturity: z.number(),
  activationPosture: z.string(),
  urgencyIndex: z.number(),
  riskExposure: z.enum(['low', 'moderate', 'elevated', 'high']),
  aiInsight: z.record(z.string()).nullable().optional(),
});

export async function POST(request: Request) {
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  let input: z.infer<typeof AssessmentSchema>;
  try {
    const body = await request.json();
    input = AssessmentSchema.parse(body);
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  // Verify system belongs to user's org
  const { data: system } = await ctx.supabase
    .from('ai_systems')
    .select('id')
    .eq('id', input.systemId)
    .single();

  if (!system) {
    return NextResponse.json(
      { error: 'System not found' },
      { status: 404 }
    );
  }

  const { data: assessment, error } = await ctx.supabase
    .from('assessments')
    .insert({
      system_id: input.systemId,
      oversight_level: input.oversightLevel,
      monitoring_level: input.monitoringLevel,
      documentation_level: input.documentationLevel,
      weighted_maturity: input.weightedMaturity,
      activation_posture: input.activationPosture,
      urgency_index: input.urgencyIndex,
      risk_exposure: input.riskExposure,
      ai_insight: input.aiInsight,
      assessed_by: ctx.userId,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Assessment save error:', error);
    return NextResponse.json(
      { error: 'Failed to save assessment' },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: assessment.id });
}
