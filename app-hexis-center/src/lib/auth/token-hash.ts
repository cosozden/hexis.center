/**
 * API Token — generation, hashing, verification
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * API tokens are never stored in plain text.
 *
 * Storage model (see migration 005_api_tokens.sql):
 *   token_hash   = SHA-256 hex digest of the full token string
 *   token_prefix = first 8 characters of the random portion (UI display only)
 *
 * Why SHA-256 and not bcrypt?
 *   API tokens carry 144 bits of entropy (24 URL-safe base64 chars).
 *   That is already computationally infeasible to brute-force — bcrypt's
 *   key-stretching is designed for low-entropy passwords, not high-entropy
 *   random secrets. SHA-256 keeps MCP request latency <1ms per lookup.
 *
 * Token wire format:
 *   hexis_<24-chars>       (31 bytes total)
 *   └─┬──┘ └────┬─────┘
 *     │        │
 *     │        └─ 24 characters from URL-safe alphabet (a-zA-Z0-9_-)
 *     └────────── fixed prefix — identifies the token as a Hexis credential
 */

import { createHash, randomBytes } from 'node:crypto';

// ━━━ CONSTANTS ━━━

export const TOKEN_MARKER = 'hexis_';
export const TOKEN_RANDOM_LENGTH = 24;
export const TOKEN_PREFIX_DISPLAY_LENGTH = 8;

// URL-safe base64 alphabet without padding
const URL_SAFE_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';

// ━━━ GENERATION ━━━

/**
 * Generate a new plain-text API token.
 * Must be shown to the user exactly once — the server stores only its hash.
 */
export function generateApiToken(): string {
  // Each byte maps to one character. randomBytes is cryptographically secure.
  const bytes = randomBytes(TOKEN_RANDOM_LENGTH);
  let random = '';
  for (let i = 0; i < TOKEN_RANDOM_LENGTH; i++) {
    random += URL_SAFE_ALPHABET[bytes[i] % URL_SAFE_ALPHABET.length];
  }
  return `${TOKEN_MARKER}${random}`;
}

// ━━━ HASHING ━━━

/**
 * SHA-256 hex digest of a token. Constant-time comparison is done at the
 * database layer (Postgres = on equality).
 */
export function hashApiToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

// ━━━ FORMAT CHECKS ━━━

export function hasValidTokenShape(token: string): boolean {
  if (!token.startsWith(TOKEN_MARKER)) return false;
  const random = token.slice(TOKEN_MARKER.length);
  if (random.length !== TOKEN_RANDOM_LENGTH) return false;
  // Ensure every char is from the URL-safe alphabet
  for (const ch of random) {
    if (!URL_SAFE_ALPHABET.includes(ch)) return false;
  }
  return true;
}

/**
 * Extract the short prefix shown to the user as a recognition hint.
 * For token "hexis_Ab3cD4..." returns "Ab3cD4".
 */
export function extractTokenPrefix(token: string): string {
  const random = token.slice(TOKEN_MARKER.length);
  return random.slice(0, TOKEN_PREFIX_DISPLAY_LENGTH);
}
