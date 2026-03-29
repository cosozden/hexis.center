/**
 * Utility functions — Hexis Design System
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Merge CSS class names, filtering out falsy values.
 * Lightweight alternative to clsx + tailwind-merge (no extra deps).
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}
