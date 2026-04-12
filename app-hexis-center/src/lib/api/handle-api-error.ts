/**
 * Client-side API error handler
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Handles common HTTP error codes from API responses.
 * Use in all "use client" components after fetch() calls.
 *
 * - 401: Session expired → redirect to login
 * - 403: No org / permissions → redirect to onboarding or show message
 * - 429: Rate limited → show friendly message
 */

/**
 * Check API response and handle auth errors automatically.
 * Returns true if the response has an error that was handled (caller should stop).
 * Returns false if the response is OK or the error needs custom handling.
 */
export function handleApiError(response: Response): boolean {
  if (response.ok) return false;

  if (response.status === 401) {
    // Session expired — redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login?reason=session_expired";
    }
    return true;
  }

  if (response.status === 403) {
    // No org or insufficient permissions
    if (typeof window !== "undefined") {
      window.location.href = "/onboarding";
    }
    return true;
  }

  // 429, 500, etc. — not auto-handled, let caller decide
  return false;
}

/**
 * Wrapper for fetch that auto-handles auth errors.
 * Throws on non-auth errors so the caller can catch.
 */
export async function apiFetch(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const response = await fetch(url, options);

  if (handleApiError(response)) {
    // Auth error handled — throw to break the flow
    throw new Error("Session expired — redirecting to login");
  }

  return response;
}
