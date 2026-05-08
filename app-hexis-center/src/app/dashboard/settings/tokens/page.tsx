import Link from 'next/link';
import { getUserProfile } from '@/lib/supabase/server';
import { TokenManager } from '@/components/settings/token-manager';

export const dynamic = 'force-dynamic';

/**
 * API Tokens — create / manage tokens for the Hexis MCP Server.
 */
export default async function TokensPage() {
  try {
    await getUserProfile();
  } catch {
    return null;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link
          href="/dashboard/settings"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Settings
        </Link>
        <h1 className="font-heading text-2xl text-foreground border-b border-primary pb-2 inline-block mt-2">
          API Tokens
        </h1>
        <p className="text-muted-foreground mt-3 text-sm max-w-xl">
          Connect external clients (Claude Desktop, internal scripts) to your
          Hexis governance data. Tokens are hashed at rest — the plain value is
          shown only at creation time.
        </p>
      </div>

      <TokenManager />

      <div className="mt-8 text-xs text-muted-foreground border-t border-border pt-4">
        <p className="mb-2">
          <strong className="text-foreground">Security:</strong> API tokens are
          stored as SHA-256 hashes. Revoked tokens stop working immediately and
          leave an audit record. Scopes currently limit access to read-only
          operations.
        </p>
        <p>
          To use a token with Claude Desktop, add it to{' '}
          <code className="text-foreground">claude_desktop_config.json</code> as
          the <code className="text-foreground">HEXIS_API_TOKEN</code> env var —
          see the MCP server README for full instructions.
        </p>
      </div>
    </div>
  );
}
