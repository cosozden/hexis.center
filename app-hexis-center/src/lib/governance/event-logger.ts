/**
 * Governance Event Logger
 * ━━━━━━━━━━━━━━━━━━━━━━
 * Writes immutable events to the governance_events audit trail.
 *
 * Usage in API routes:
 *   await logGovernanceEvent(ctx.supabase, {
 *     orgId: ctx.orgId,
 *     systemId: input.systemId,
 *     eventType: 'classification_created',
 *     orientStep: 'risk',
 *     actorId: ctx.userId,
 *     newValue: { risk_level: 'high', ... },
 *   });
 *
 * Non-fatal: caller should catch and warn, never crash on logging failure.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import {
  getInvalidatedSteps,
  type OrientStep,
} from '@/lib/config/invalidation-config';

// ━━━ TYPES ━━━

export interface GovernanceEventInput {
  orgId: string;
  systemId: string;
  eventType: string;
  orientStep: OrientStep;
  actorId?: string;
  previousValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
}

// ━━━ KNOWN EVENT TYPES ━━━
// Not enforced via DB CHECK to allow future extensibility,
// but typed here for autocomplete and consistency.

export const EVENT_TYPES = {
  // Observe
  SYSTEM_CREATED: 'system_created',
  SYSTEM_UPDATED: 'system_updated',
  // Risk
  CLASSIFICATION_CREATED: 'classification_created',
  CLASSIFICATION_CHANGED: 'classification_changed',
  // Identify
  OBLIGATION_SEEDED: 'obligation_seeded',
  OBLIGATION_STATUS_CHANGED: 'obligation_status_changed',
  // Evaluate
  ASSESSMENT_CREATED: 'assessment_created',
  // Navigate
  ACTION_CREATED: 'action_created',
  ACTION_STATUS_CHANGED: 'action_status_changed',
  // Track
  SNAPSHOT_CREATED: 'snapshot_created',
  REPORT_GENERATED: 'report_generated',
  // GovOps
  INVALIDATION_TRIGGERED: 'invalidation_triggered',
  REVIEW_SCHEDULED: 'review_scheduled',
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

// ━━━ CORE LOGGER ━━━

/**
 * Insert an immutable governance event into the audit trail.
 * Non-fatal — logs error to console but never throws.
 */
export async function logGovernanceEvent(
  supabase: SupabaseClient<Database>,
  event: GovernanceEventInput,
): Promise<{ success: boolean; eventId?: string }> {
  try {
    const { data, error } = await supabase
      .from('governance_events')
      .insert({
        org_id: event.orgId,
        system_id: event.systemId,
        event_type: event.eventType,
        orient_step: event.orientStep,
        actor_id: event.actorId ?? null,
        previous_value: event.previousValue ?? null,
        new_value: event.newValue ?? null,
        metadata: event.metadata ?? {},
      })
      .select('id')
      .single();

    if (error) {
      console.error('[governance-event] Insert failed:', error.message);
      return { success: false };
    }

    return { success: true, eventId: data.id };
  } catch (err) {
    console.error('[governance-event] Unexpected error:', err);
    return { success: false };
  }
}

// ━━━ INVALIDATION HELPER ━━━

/**
 * When an ORIENT step changes, mark downstream steps as invalidated.
 * Also logs an invalidation_triggered event.
 *
 * Layer 1 (deterministic): Uses invalidation-config rules.
 * Layer 2 (Claude): Not called here — see impact-assessment route.
 */
export async function triggerInvalidation(
  supabase: SupabaseClient<Database>,
  opts: {
    orgId: string;
    systemId: string;
    sourceStep: OrientStep;
    actorId?: string;
    changeDescription?: string;
  },
): Promise<string[]> {
  const invalidatedSteps = getInvalidatedSteps(opts.sourceStep);

  if (invalidatedSteps.length === 0) return [];

  // 1. Update ai_systems.invalidated_steps (merge, don't overwrite)
  const { data: system } = await supabase
    .from('ai_systems')
    .select('invalidated_steps')
    .eq('id', opts.systemId)
    .single();

  const currentInvalidated = (system?.invalidated_steps as string[]) ?? [];
  const mergedInvalidated = [
    ...new Set([...currentInvalidated, ...invalidatedSteps]),
  ];

  await supabase
    .from('ai_systems')
    .update({ invalidated_steps: mergedInvalidated })
    .eq('id', opts.systemId);

  // 2. Log the invalidation event
  await logGovernanceEvent(supabase, {
    orgId: opts.orgId,
    systemId: opts.systemId,
    eventType: EVENT_TYPES.INVALIDATION_TRIGGERED,
    orientStep: opts.sourceStep,
    actorId: opts.actorId,
    newValue: {
      invalidated_steps: invalidatedSteps,
      reason: opts.changeDescription ?? `${opts.sourceStep} step changed`,
    },
  });

  return invalidatedSteps;
}

// ━━━ CLEAR INVALIDATION ━━━

/**
 * When a user re-completes an invalidated step, remove it from the list.
 */
export async function clearInvalidation(
  supabase: SupabaseClient<Database>,
  opts: {
    systemId: string;
    step: OrientStep;
  },
): Promise<void> {
  const { data: system } = await supabase
    .from('ai_systems')
    .select('invalidated_steps')
    .eq('id', opts.systemId)
    .single();

  const currentInvalidated = (system?.invalidated_steps as string[]) ?? [];
  const updated = currentInvalidated.filter((s) => s !== opts.step);

  await supabase
    .from('ai_systems')
    .update({ invalidated_steps: updated })
    .eq('id', opts.systemId);
}

// ━━━ REVIEW SCHEDULING ━━━

/**
 * Set or update the next review date for a system.
 * Logs a review_scheduled event.
 */
export async function scheduleReview(
  supabase: SupabaseClient<Database>,
  opts: {
    orgId: string;
    systemId: string;
    actorId?: string;
    reviewDate: string; // ISO date string 'YYYY-MM-DD'
    frequencyDays?: number;
  },
): Promise<void> {
  const { data: system } = await supabase
    .from('ai_systems')
    .select('next_review_date')
    .eq('id', opts.systemId)
    .single();

  const updatePayload: Record<string, unknown> = {
    next_review_date: opts.reviewDate,
  };
  if (opts.frequencyDays !== undefined) {
    updatePayload.review_frequency_days = opts.frequencyDays;
  }

  await supabase
    .from('ai_systems')
    .update(updatePayload)
    .eq('id', opts.systemId);

  await logGovernanceEvent(supabase, {
    orgId: opts.orgId,
    systemId: opts.systemId,
    eventType: EVENT_TYPES.REVIEW_SCHEDULED,
    orientStep: 'track',
    actorId: opts.actorId,
    previousValue: { next_review_date: system?.next_review_date ?? null },
    newValue: { next_review_date: opts.reviewDate },
  });
}
