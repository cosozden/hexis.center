/**
 * Token hashing — MCP server copy
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MUST stay in sync with: /app-hexis-center/src/lib/auth/token-hash.ts
 *
 * Reason for duplication: this MCP server uses its own tsconfig with
 * rootDir="src", so it can't import from the parent Next.js project.
 * The logic below is 100% pure (Node crypto only) — identical code
 * must live in both places.
 */

import { createHash } from 'node:crypto';

export const TOKEN_MARKER = 'hexis_';
export const TOKEN_RANDOM_LENGTH = 24;

export function hashApiToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export function hasValidTokenShape(token: string): boolean {
  if (!token.startsWith(TOKEN_MARKER)) return false;
  const random = token.slice(TOKEN_MARKER.length);
  return random.length === TOKEN_RANDOM_LENGTH;
}
