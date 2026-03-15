export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://hexis.center",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      /* ─── LEAD SAVE ─── */
      if (path === "/api/kvkk-lead") {
        const lead = await request.json();

        // Validate required fields
        if (!lead.email || !lead.name) {
          return new Response(
            JSON.stringify({ error: "email and name required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Build KV key: timestamp + email hash for uniqueness
        const ts = new Date().toISOString();
        const key = `lead:${ts}:${lead.email}`;

        const record = {
          name: lead.name,
          email: lead.email,
          company: lead.company || "",
          sector: lead.sector || "",
          score: lead.score || 0,
          maxScore: lead.maxScore || 76,
          profile: lead.profile || "",
          hasOverride: lead.hasOverride || false,
          overrideTriggers: lead.overrideTriggers || [],
          createdAt: ts,
        };

        // Store in KV (env.KVKK_LEADS must be bound in wrangler.toml)
        if (env.KVKK_LEADS) {
          await env.KVKK_LEADS.put(key, JSON.stringify(record), {
            // Auto-expire after 365 days (KVKK data minimization)
            expirationTtl: 365 * 24 * 60 * 60,
          });
        }

        return new Response(
          JSON.stringify({ ok: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      /* ─── ROADMAP (Claude API proxy) ─── */
      if (path === "/api/kvkk-roadmap") {
        const body = await request.json();
        const response = await fetch(
          "https://api.anthropic.com/v1/messages",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": env.ANTHROPIC_API_KEY,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify(body),
          }
        );
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response("Not found", { status: 404, headers: corsHeaders });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  },
};
