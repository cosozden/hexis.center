/**
 * Weekly Summary Cron — sends compliance digest emails
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Triggered by Vercel Cron (vercel.json) or manual POST.
 * Sends one email per org owner with compliance summary.
 *
 * POST /api/cron/weekly-summary
 * Header: Authorization: Bearer CRON_SECRET
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendWeeklySummary, type WeeklySummaryData } from '@/lib/email/client';

const CRON_SECRET = process.env.CRON_SECRET || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function verifyCronAuth(request: Request): boolean {
  // Method 1: Vercel Cron header (set automatically by Vercel Cron Jobs)
  const vercelCron = request.headers.get('x-vercel-cron');
  if (vercelCron === '1') return true;

  // Method 2: Bearer token (manual trigger, e.g. from admin panel)
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader === `Bearer ${CRON_SECRET}`) return true;

  return false;
}

export async function POST(request: Request) {
  // 1. Verify cron auth — reject if neither Vercel Cron nor valid secret
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    // 2. Get all orgs with active owners
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id, name')
      .in('subscription_status', ['active', 'trialing']);

    if (!orgs || orgs.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No active orgs' });
    }

    let sentCount = 0;
    const errors: string[] = [];

    for (const org of orgs) {
      try {
        // 3. Find org owner
        const { data: owner } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('org_id', org.id)
          .eq('role', 'owner')
          .limit(1)
          .single();

        if (!owner?.email) continue;

        // 4. Build summary data
        const { count: systemCount } = await supabase
          .from('ai_systems')
          .select('*', { count: 'exact', head: true })
          .eq('org_id', org.id);

        // Latest org-wide snapshot
        const { data: latestSnap } = await supabase
          .from('compliance_snapshots')
          .select('score')
          .eq('org_id', org.id)
          .is('system_id', null)
          .order('snapshot_at', { ascending: false })
          .limit(1)
          .single();

        // Previous week snapshot for delta
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const { data: prevSnap } = await supabase
          .from('compliance_snapshots')
          .select('score')
          .eq('org_id', org.id)
          .is('system_id', null)
          .lte('snapshot_at', weekAgo.toISOString())
          .order('snapshot_at', { ascending: false })
          .limit(1)
          .single();

        // Obligation + action counts
        const systemIds = await supabase
          .from('ai_systems')
          .select('id')
          .eq('org_id', org.id);

        const ids = (systemIds.data || []).map((s) => s.id);

        let obligationsTotal = 0;
        let obligationsCompleted = 0;
        let actionsTotal = 0;
        let actionsCompleted = 0;

        if (ids.length > 0) {
          const [oTotal, oCompleted, aTotal, aCompleted] = await Promise.all([
            supabase.from('obligations').select('*', { count: 'exact', head: true }).in('system_id', ids),
            supabase.from('obligations').select('*', { count: 'exact', head: true }).in('system_id', ids).eq('status', 'completed'),
            supabase.from('actions').select('*', { count: 'exact', head: true }).in('system_id', ids),
            supabase.from('actions').select('*', { count: 'exact', head: true }).in('system_id', ids).eq('status', 'done'),
          ]);

          obligationsTotal = oTotal.count || 0;
          obligationsCompleted = oCompleted.count || 0;
          actionsTotal = aTotal.count || 0;
          actionsCompleted = aCompleted.count || 0;
        }

        // Upcoming deadlines (next 30 days)
        const in30Days = new Date();
        in30Days.setDate(in30Days.getDate() + 30);

        const { data: upcomingObs } = ids.length > 0
          ? await supabase
              .from('obligations')
              .select('title, deadline, system_id')
              .in('system_id', ids)
              .not('deadline', 'is', null)
              .neq('status', 'completed')
              .lte('deadline', in30Days.toISOString())
              .order('deadline')
              .limit(5)
          : { data: [] };

        // Map system names
        const systemNameMap = new Map<string, string>();
        if (ids.length > 0) {
          const { data: sysNames } = await supabase
            .from('ai_systems')
            .select('id, name')
            .in('id', ids);
          for (const s of sysNames || []) {
            systemNameMap.set(s.id, s.name);
          }
        }

        const summary: WeeklySummaryData = {
          systemCount: systemCount || 0,
          overallScore: latestSnap?.score ?? null,
          scoreDelta: latestSnap && prevSnap ? Math.round(latestSnap.score - prevSnap.score) : null,
          obligationsCompleted,
          obligationsTotal,
          actionsCompleted,
          actionsTotal,
          upcomingDeadlines: (upcomingObs || []).map((o) => ({
            title: o.title,
            daysLeft: Math.ceil(
              (new Date(o.deadline!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            ),
            systemName: systemNameMap.get(o.system_id) || 'Unknown',
          })),
        };

        // 5. Send email
        const result = await sendWeeklySummary(
          owner.email,
          owner.full_name || 'there',
          org.name,
          summary
        );

        if (result.success) sentCount++;
        else errors.push(`${org.name}: ${result.error}`);
      } catch (orgErr) {
        errors.push(`${org.name}: ${(orgErr as Error).message}`);
      }
    }

    return NextResponse.json({
      sent: sentCount,
      total: orgs.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error('[Cron] Weekly summary failed:', err);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}
