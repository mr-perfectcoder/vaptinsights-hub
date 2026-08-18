/**
 * Module-level store for the current Turnstile token.
 *
 * The axios interceptor reads this token to pass it to `registerSessionKey`
 * when bootstrapping a session cert for anonymous users. On pages that don't
 * show the Turnstile form widget (e.g. shared scan-result links), an invisible
 * Turnstile widget auto-verifies and calls `setGlobalTurnstileToken` before
 * any API requests are made.
 */

let _turnstileToken: string | undefined;

/** Store the latest verified Turnstile token (called from client components). */
export function setGlobalTurnstileToken(token: string) {
  _turnstileToken = token;
}

/** Read the current token (called from the axios interceptor). */
export function getGlobalTurnstileToken(): string | undefined {
  return _turnstileToken;
}

/** Clear the token (e.g. after it has been consumed once). */
export function clearGlobalTurnstileToken() {
  _turnstileToken = undefined;
}
