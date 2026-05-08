# Hexis MCP Server

Read-only MCP server for accessing your Hexis AI Governance data from Claude Desktop.

## Tools

| Tool | Description |
|------|-------------|
| `list_systems` | List all registered AI systems |
| `get_system_status` | Risk + compliance status for a system |
| `get_obligations` | Obligation checklist with status |
| `get_compliance_score` | Overall compliance score |
| `get_upcoming_deadlines` | Upcoming deadlines (obligations + reviews + EU AI Act) |

## Generate an API token

Tokens are created from the Hexis dashboard — they are **never** sent by email
and the plain-text value is shown exactly once.

1. Sign in at `https://app.hexis.center`
2. Go to **Settings → API Tokens → Manage tokens**
3. Click **Create token**, give it a name (e.g. "Claude Desktop — MacBook")
4. Copy the token immediately — it will not be shown again
5. To revoke a token, click **Revoke** on the tokens list

**Storage model:** only a SHA-256 hash of the token is persisted. Revocation is
instant, and every token carries scopes (`read` today), an optional expiry, and
a `last_used_at` timestamp so you can see which tokens are in active use.

## Setup

```bash
cd mcp-server
npm install
npm run build
```

## Claude Desktop Configuration

Add to `~/.config/claude/claude_desktop_config.json` (macOS:
`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "hexis-governance": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "HEXIS_SUPABASE_URL": "https://your-project.supabase.co",
        "HEXIS_SUPABASE_SERVICE_KEY": "your-service-role-key",
        "HEXIS_API_TOKEN": "hexis_xxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

> `HEXIS_SUPABASE_SERVICE_KEY` is the Supabase service-role key; it should only
> live on your local machine. The MCP server uses it to bypass RLS and then
> enforces org-scoping itself via the API token lookup.

## Example Usage

In Claude Desktop:
- "Show me my AI systems"
- "What's the compliance status of my chatbot?"
- "Any upcoming deadlines I should worry about?"
- "What obligations are still pending?"
