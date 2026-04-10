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

## Setup

```bash
cd mcp-server
npm install
npm run build
```

## Claude Desktop Configuration

Add to `~/.config/claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "hexis-governance": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "HEXIS_SUPABASE_URL": "https://your-project.supabase.co",
        "HEXIS_SUPABASE_SERVICE_KEY": "your-service-role-key",
        "HEXIS_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

## Example Usage

In Claude Desktop:
- "Show me my AI systems"
- "What's the compliance status of my chatbot?"
- "Any upcoming deadlines I should worry about?"
- "What obligations are still pending?"
