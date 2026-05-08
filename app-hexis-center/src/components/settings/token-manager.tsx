"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input, Label } from "@/components/ui";

/**
 * TokenManager — settings page API token UI.
 *   • Lists existing tokens for the user's org
 *   • Creates a new token (plain text revealed ONCE, then never again)
 *   • Revokes tokens (soft-revoke: revoked_at = now)
 */

interface TokenRow {
  id: string;
  name: string;
  token_prefix: string;
  scopes: string[];
  expires_at: string | null;
  revoked_at: string | null;
  last_used_at: string | null;
  created_at: string;
}

interface CreateResponse {
  token: string;
  metadata: {
    id: string;
    name: string;
    token_prefix: string;
  };
}

export function TokenManager() {
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [expiresInDays, setExpiresInDays] = useState<string>("90");
  const [justCreated, setJustCreated] = useState<CreateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/settings/tokens", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load tokens");
      const body = (await res.json()) as { tokens: TokenRow[] };
      setTokens(body.tokens);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handleCreate() {
    setBusy(true);
    setError(null);
    try {
      const expires = Number.parseInt(expiresInDays, 10);
      const res = await fetch("/api/settings/tokens", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: newName || "Untitled token",
          scopes: ["read"],
          expiresInDays: Number.isFinite(expires) && expires > 0 ? expires : undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Create failed" }));
        throw new Error(body.error || "Create failed");
      }
      const body = (await res.json()) as CreateResponse;
      setJustCreated(body);
      setNewName("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revoke this token? Clients using it will stop working immediately.")) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/settings/tokens/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Revoke failed" }));
        throw new Error(body.error || "Revoke failed");
      }
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Create form */}
      <Card className="p-5">
        <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
          Create API Token
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Tokens grant read access to your organisation's governance data via the
          Hexis MCP Server. The plain-text value is shown exactly once — copy it
          immediately to your Claude Desktop config.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_auto] gap-3 items-end">
          <div>
            <Label htmlFor="token-name">Name</Label>
            <Input
              id="token-name"
              placeholder="e.g. Claude Desktop — MacBook"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={80}
            />
          </div>
          <div>
            <Label htmlFor="token-expires">Expires (days)</Label>
            <Input
              id="token-expires"
              type="number"
              min={1}
              max={365}
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
            />
          </div>
          <Button onClick={handleCreate} disabled={busy}>
            {busy ? "Creating…" : "Create token"}
          </Button>
        </div>

        {justCreated && (
          <div className="mt-4 border border-primary p-3">
            <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-2">
              Copy now — shown only once
            </p>
            <code className="block text-xs text-foreground break-all select-all">
              {justCreated.token}
            </code>
            <p className="text-xs text-muted-foreground mt-2">
              Prefix for future recognition:{" "}
              <span className="text-foreground">
                hexis_{justCreated.metadata.token_prefix}…
              </span>
            </p>
            <Button
              className="mt-2"
              onClick={() => setJustCreated(null)}
              variant="ghost"
            >
              I've copied it — dismiss
            </Button>
          </div>
        )}

        {error && (
          <p className="mt-3 text-xs text-red-400">{error}</p>
        )}
      </Card>

      {/* List */}
      <Card className="p-5">
        <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
          Active Tokens
        </p>

        {loading ? (
          <p className="text-xs text-muted-foreground">Loading…</p>
        ) : tokens.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No tokens yet. Create one above to connect Claude Desktop.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {tokens.map((t) => {
              const isRevoked = !!t.revoked_at;
              const isExpired =
                !!t.expires_at && new Date(t.expires_at) < new Date();
              const status = isRevoked
                ? "Revoked"
                : isExpired
                  ? "Expired"
                  : "Active";
              return (
                <li
                  key={t.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{t.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      hexis_{t.token_prefix}… · {t.scopes.join(", ")} · {status}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Created {new Date(t.created_at).toLocaleDateString()}
                      {t.last_used_at
                        ? ` · Last used ${new Date(t.last_used_at).toLocaleDateString()}`
                        : " · Never used"}
                      {t.expires_at
                        ? ` · Expires ${new Date(t.expires_at).toLocaleDateString()}`
                        : " · No expiry"}
                    </p>
                  </div>
                  {!isRevoked && (
                    <Button
                      variant="ghost"
                      onClick={() => handleRevoke(t.id)}
                      disabled={busy}
                    >
                      Revoke
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
