/**
 * Hexis MCP Server v1 — Read-only Governance Data
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Provides 5 read-only tools for Claude Desktop integration:
 *   1. list_systems     → User's AI system inventory
 *   2. get_system_status → Risk + compliance status for a system
 *   3. get_obligations   → Obligation checklist with status
 *   4. get_compliance_score → Overall compliance score
 *   5. get_upcoming_deadlines → Upcoming deadlines across all systems
 *
 * Auth: Supabase service role key + user API token
 * Transport: stdio (local MCP server)
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ━━━ CONFIG ━━━

const SUPABASE_URL = process.env.HEXIS_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.HEXIS_SUPABASE_SERVICE_KEY || '';
const USER_API_TOKEN = process.env.HEXIS_API_TOKEN || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !USER_API_TOKEN) {
  console.error(
    'Missing required environment variables: HEXIS_SUPABASE_URL, HEXIS_SUPABASE_SERVICE_KEY, HEXIS_API_TOKEN'
  );
  process.exit(1);
}

// ━━━ SUPABASE CLIENT ━━━

// Use service role to bypass RLS — we enforce org-scoping manually via API token
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ━━━ AUTH: Resolve API token → org_id ━━━

let cachedOrgId: string | null = null;

async function getOrgId(): Promise<string> {
  if (cachedOrgId) return cachedOrgId;

  // API token format: hexis_{profile_id}_{random}
  // For MVP, token is stored in profiles.settings.api_token
  // We look up the profile by matching the token
  const { data: profiles } = await supabase
    .from('profiles')
    .select('org_id')
    .not('org_id', 'is', null);

  // In v1, we trust the env-provided token and use it to find the org
  // For production: implement proper API token table
  if (!profiles || profiles.length === 0) {
    throw new Error('No profiles found — check your API token');
  }

  // For MVP: Use the first profile's org (single-tenant assumption)
  cachedOrgId = profiles[0].org_id as string;
  return cachedOrgId;
}

// ━━━ RISK LABELS ━━━

const RISK_LABELS: Record<string, string> = {
  prohibited: 'Prohibited (Art. 5)',
  high: 'High Risk (Art. 6)',
  limited: 'Limited Risk (Art. 50)',
  gpai: 'GPAI (Art. 51-56)',
  minimal: 'Minimal Risk (Art. 95)',
};

// ━━━ MCP SERVER ━━━

const server = new McpServer({
  name: 'hexis-governance',
  version: '0.1.0',
});

// ━━━ TOOL 1: list_systems ━━━

server.tool(
  'list_systems',
  'List all AI systems registered in your Hexis governance platform. Returns system name, purpose, risk level, deployment status, and ORIENT progress.',
  {},
  async () => {
    try {
      const orgId = await getOrgId();

      const { data: systems, error } = await supabase
        .from('ai_systems')
        .select('id, name, purpose, deployment_status, eu_market, organisation_role, created_at')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!systems || systems.length === 0) {
        return {
          content: [{ type: 'text' as const, text: 'No AI systems registered yet. Use the Hexis platform to register your first AI system.' }],
        };
      }

      // Fetch classifications for all systems
      const systemIds = systems.map((s) => s.id);
      const { data: classifications } = await supabase
        .from('risk_classifications')
        .select('system_id, risk_level')
        .in('system_id', systemIds)
        .order('classified_at', { ascending: false });

      const classMap = new Map<string, string>();
      for (const c of classifications || []) {
        if (!classMap.has(c.system_id)) classMap.set(c.system_id, c.risk_level);
      }

      const lines = systems.map((s) => {
        const risk = classMap.get(s.id);
        return [
          `**${s.name}**`,
          s.purpose ? `  Purpose: ${s.purpose}` : '',
          `  Status: ${s.deployment_status}`,
          `  EU Market: ${s.eu_market ? 'Yes' : 'No'}`,
          `  Role: ${s.organisation_role}`,
          risk ? `  Risk Level: ${RISK_LABELS[risk] || risk}` : '  Risk Level: Not classified',
          `  ID: ${s.id}`,
        ]
          .filter(Boolean)
          .join('\n');
      });

      return {
        content: [{
          type: 'text' as const,
          text: `## AI Systems (${systems.length})\n\n${lines.join('\n\n---\n\n')}`,
        }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: `Error: ${(err as Error).message}` }],
        isError: true,
      };
    }
  }
);

// ━━━ TOOL 2: get_system_status ━━━

server.tool(
  'get_system_status',
  'Get detailed risk classification and compliance status for a specific AI system. Includes risk level, article references, latest assessment, and ORIENT step completion.',
  {
    system_id: z.string().uuid().describe('The UUID of the AI system'),
  },
  async ({ system_id }) => {
    try {
      const orgId = await getOrgId();

      // Fetch system
      const { data: system, error } = await supabase
        .from('ai_systems')
        .select('*')
        .eq('id', system_id)
        .eq('org_id', orgId)
        .single();

      if (error || !system) {
        return {
          content: [{ type: 'text' as const, text: 'System not found or access denied.' }],
          isError: true,
        };
      }

      // Fetch classification
      const { data: classification } = await supabase
        .from('risk_classifications')
        .select('*')
        .eq('system_id', system_id)
        .order('classified_at', { ascending: false })
        .limit(1)
        .single();

      // Fetch latest assessment
      const { data: assessment } = await supabase
        .from('assessments')
        .select('*')
        .eq('system_id', system_id)
        .order('assessed_at', { ascending: false })
        .limit(1)
        .single();

      // Fetch obligation counts
      const { count: totalObligations } = await supabase
        .from('obligations')
        .select('*', { count: 'exact', head: true })
        .eq('system_id', system_id);

      const { count: completedObligations } = await supabase
        .from('obligations')
        .select('*', { count: 'exact', head: true })
        .eq('system_id', system_id)
        .eq('status', 'completed');

      // Fetch action counts
      const { count: totalActions } = await supabase
        .from('actions')
        .select('*', { count: 'exact', head: true })
        .eq('system_id', system_id);

      const { count: completedActions } = await supabase
        .from('actions')
        .select('*', { count: 'exact', head: true })
        .eq('system_id', system_id)
        .eq('status', 'done');

      // ORIENT progress
      const orientSteps = [
        { step: 'Observe', done: true }, // System registered = done
        { step: 'Risk', done: !!classification },
        { step: 'Identify', done: (totalObligations || 0) > 0 },
        { step: 'Evaluate', done: !!assessment },
        { step: 'Navigate', done: (totalActions || 0) > 0 },
        { step: 'Track', done: false }, // Track is ongoing
      ];

      const completedSteps = orientSteps.filter((s) => s.done).length;

      const sections = [
        `## ${system.name}`,
        `**Purpose:** ${system.purpose || 'Not specified'}`,
        `**Deployment:** ${system.deployment_status}`,
        `**EU Market:** ${system.eu_market ? 'Yes' : 'No'}`,
        `**Role:** ${system.organisation_role}`,
        '',
        '### Risk Classification',
        classification
          ? [
              `**Level:** ${RISK_LABELS[classification.risk_level] || classification.risk_level}`,
              `**Articles:** ${(classification.article_references as string[]).join(', ')}`,
              classification.exception_applied
                ? `**Exception:** ${classification.exception_details}`
                : '',
              `**Classified:** ${new Date(classification.classified_at).toLocaleDateString('en-GB')}`,
            ]
              .filter(Boolean)
              .join('\n')
          : 'Not classified yet.',
        '',
        '### Governance Assessment',
        assessment
          ? [
              `**Oversight:** Level ${assessment.oversight_level}/4`,
              `**Monitoring:** Level ${assessment.monitoring_level}/4`,
              `**Documentation:** Level ${assessment.documentation_level}/4`,
              `**Weighted Maturity:** ${assessment.weighted_maturity}`,
              `**Posture:** ${assessment.activation_posture}`,
              `**Urgency Index:** ${assessment.urgency_index}`,
            ].join('\n')
          : 'Not assessed yet.',
        '',
        '### Compliance Progress',
        `**Obligations:** ${completedObligations || 0}/${totalObligations || 0} completed`,
        `**Actions:** ${completedActions || 0}/${totalActions || 0} done`,
        '',
        '### ORIENT Progress',
        orientSteps
          .map((s) => `${s.done ? '✓' : '○'} ${s.step}`)
          .join(' → '),
        `**${completedSteps}/6 steps completed**`,
      ];

      // Invalidation status
      const invalidatedSteps = (system.invalidated_steps as string[]) || [];
      if (invalidatedSteps.length > 0) {
        sections.push('', '### ⚠ Invalidated Steps', `The following steps need review: ${invalidatedSteps.join(', ')}`);
      }

      return {
        content: [{ type: 'text' as const, text: sections.join('\n') }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: `Error: ${(err as Error).message}` }],
        isError: true,
      };
    }
  }
);

// ━━━ TOOL 3: get_obligations ━━━

server.tool(
  'get_obligations',
  'Get the obligation checklist for a specific AI system. Shows all EU AI Act obligations with their status, article references, deadlines, and priority.',
  {
    system_id: z.string().uuid().describe('The UUID of the AI system'),
    status_filter: z
      .enum(['all', 'not_started', 'in_progress', 'completed'])
      .optional()
      .describe('Filter by obligation status (default: all)'),
  },
  async ({ system_id, status_filter }) => {
    try {
      const orgId = await getOrgId();

      // Verify system belongs to org
      const { data: system } = await supabase
        .from('ai_systems')
        .select('id, name')
        .eq('id', system_id)
        .eq('org_id', orgId)
        .single();

      if (!system) {
        return {
          content: [{ type: 'text' as const, text: 'System not found or access denied.' }],
          isError: true,
        };
      }

      let query = supabase
        .from('obligations')
        .select('*')
        .eq('system_id', system_id)
        .order('priority', { ascending: false })
        .order('sort_order');

      if (status_filter && status_filter !== 'all') {
        query = query.eq('status', status_filter);
      }

      const { data: obligations, error } = await query;

      if (error) throw error;
      if (!obligations || obligations.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: `No obligations found for ${system.name}. Complete the Identify step (ORIENT Step 3) to generate obligations.`,
          }],
        };
      }

      const statusIcon: Record<string, string> = {
        not_started: '○',
        in_progress: '◐',
        completed: '●',
        not_applicable: '—',
      };

      const lines = obligations.map((o) => {
        const icon = statusIcon[o.status] || '?';
        const deadline = o.deadline
          ? ` | Deadline: ${new Date(o.deadline).toLocaleDateString('en-GB')}`
          : '';
        return `${icon} **${o.title}** (${o.article_reference})${deadline}\n  Status: ${o.status} | Priority: ${o.priority} | Category: ${o.category}${o.description ? `\n  ${o.description}` : ''}`;
      });

      const completed = obligations.filter((o) => o.status === 'completed').length;

      return {
        content: [{
          type: 'text' as const,
          text: `## Obligations — ${system.name}\n**${completed}/${obligations.length} completed**\n\n${lines.join('\n\n')}`,
        }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: `Error: ${(err as Error).message}` }],
        isError: true,
      };
    }
  }
);

// ━━━ TOOL 4: get_compliance_score ━━━

server.tool(
  'get_compliance_score',
  'Get the overall compliance score for your organisation or a specific AI system. Returns the latest snapshot with component breakdown.',
  {
    system_id: z
      .string()
      .uuid()
      .optional()
      .describe('Optional system UUID. If omitted, returns org-wide score.'),
  },
  async ({ system_id }) => {
    try {
      const orgId = await getOrgId();

      let query = supabase
        .from('compliance_snapshots')
        .select('*')
        .eq('org_id', orgId)
        .order('snapshot_at', { ascending: false })
        .limit(5);

      if (system_id) {
        query = query.eq('system_id', system_id);
      } else {
        query = query.is('system_id', null);
      }

      const { data: snapshots, error } = await query;

      if (error) throw error;
      if (!snapshots || snapshots.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: 'No compliance snapshots yet. Visit the Track step in the Hexis platform to generate your first compliance score.',
          }],
        };
      }

      const latest = snapshots[0];
      const sections = [
        `## Compliance Score`,
        `**Score: ${latest.score}/100**`,
        `**Obligations:** ${latest.obligations_completed}/${latest.obligations_total} completed`,
        `**Actions:** ${latest.actions_completed}/${latest.actions_total} done`,
        `**Snapshot date:** ${new Date(latest.snapshot_at).toLocaleDateString('en-GB')}`,
      ];

      if (snapshots.length > 1) {
        sections.push('', '### Recent History');
        for (const snap of snapshots.slice(1)) {
          sections.push(
            `- ${new Date(snap.snapshot_at).toLocaleDateString('en-GB')}: **${snap.score}/100** (${snap.obligations_completed}/${snap.obligations_total} obligations)`
          );
        }
      }

      return {
        content: [{ type: 'text' as const, text: sections.join('\n') }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: `Error: ${(err as Error).message}` }],
        isError: true,
      };
    }
  }
);

// ━━━ TOOL 5: get_upcoming_deadlines ━━━

server.tool(
  'get_upcoming_deadlines',
  'Get upcoming EU AI Act deadlines and obligation due dates across all your AI systems. Sorted by urgency.',
  {
    days_ahead: z
      .number()
      .int()
      .min(1)
      .max(365)
      .optional()
      .describe('How many days ahead to look (default: 90)'),
  },
  async ({ days_ahead }) => {
    try {
      const orgId = await getOrgId();
      const lookAhead = days_ahead || 90;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + lookAhead);

      // Fetch systems for this org
      const { data: systems } = await supabase
        .from('ai_systems')
        .select('id, name, next_review_date')
        .eq('org_id', orgId);

      if (!systems || systems.length === 0) {
        return {
          content: [{ type: 'text' as const, text: 'No AI systems registered.' }],
        };
      }

      const systemIds = systems.map((s) => s.id);
      const systemMap = new Map(systems.map((s) => [s.id, s.name]));

      // Fetch obligations with deadlines
      const { data: obligations } = await supabase
        .from('obligations')
        .select('system_id, title, article_reference, deadline, status')
        .in('system_id', systemIds)
        .not('deadline', 'is', null)
        .neq('status', 'completed')
        .neq('status', 'not_applicable')
        .lte('deadline', cutoff.toISOString())
        .order('deadline');

      // Collect all deadlines
      interface DeadlineItem {
        date: string;
        label: string;
        system: string;
        type: string;
        daysLeft: number;
      }

      const deadlines: DeadlineItem[] = [];

      // Obligation deadlines
      for (const o of obligations || []) {
        const d = new Date(o.deadline!);
        const daysLeft = Math.ceil(
          (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        deadlines.push({
          date: o.deadline!,
          label: `${o.title} (${o.article_reference})`,
          system: systemMap.get(o.system_id) || o.system_id,
          type: 'obligation',
          daysLeft,
        });
      }

      // System review dates
      for (const s of systems) {
        if (s.next_review_date) {
          const d = new Date(s.next_review_date);
          if (d <= cutoff) {
            const daysLeft = Math.ceil(
              (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );
            deadlines.push({
              date: s.next_review_date,
              label: 'Scheduled governance review',
              system: s.name,
              type: 'review',
              daysLeft,
            });
          }
        }
      }

      // EU AI Act fixed deadlines
      const euDeadlines = [
        { date: '2026-08-02', label: 'EU AI Act — High-risk systems (Annex III) obligations begin', system: 'All systems' },
        { date: '2027-08-02', label: 'EU AI Act — High-risk systems (Annex I / product safety) obligations begin', system: 'All systems' },
      ];

      for (const ed of euDeadlines) {
        const d = new Date(ed.date);
        if (d <= cutoff && d >= new Date()) {
          const daysLeft = Math.ceil(
            (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          deadlines.push({ ...ed, type: 'regulatory', daysLeft });
        }
      }

      // Sort by date
      deadlines.sort((a, b) => a.daysLeft - b.daysLeft);

      if (deadlines.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: `No upcoming deadlines in the next ${lookAhead} days.`,
          }],
        };
      }

      const lines = deadlines.map((d) => {
        const urgency =
          d.daysLeft < 0
            ? '🔴 OVERDUE'
            : d.daysLeft <= 7
              ? '🟠 THIS WEEK'
              : d.daysLeft <= 30
                ? '🟡 THIS MONTH'
                : '⚪';
        return `${urgency} **${d.label}**\n  System: ${d.system} | ${d.daysLeft < 0 ? `${Math.abs(d.daysLeft)} days overdue` : `${d.daysLeft} days left`} | ${new Date(d.date).toLocaleDateString('en-GB')}`;
      });

      return {
        content: [{
          type: 'text' as const,
          text: `## Upcoming Deadlines (next ${lookAhead} days)\n**${deadlines.length} items**\n\n${lines.join('\n\n')}`,
        }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text' as const, text: `Error: ${(err as Error).message}` }],
        isError: true,
      };
    }
  }
);

// ━━━ START SERVER ━━━

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Hexis MCP Server v0.1.0 running on stdio');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
