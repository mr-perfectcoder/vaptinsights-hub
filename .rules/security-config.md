# Security And Config Rules

## Environment variables
Secrets must only use server-side environment variables.

Never expose secrets with `NEXT_PUBLIC_*`.

Use `NEXT_PUBLIC_*` only for public values such as public API base URLs.

## Keys
Signing keys, JWT keys, invite signing secrets, and private API keys must stay server-side.

Public keys may be shared with the backend when needed for verification.

## Logging
Do not log raw access tokens, private keys, invite tokens, passkey payload secrets, or full delegation certificates.

Log request IDs and safe identifiers for debugging.

## Errors
Return safe user-facing errors.

Keep sensitive failure details in server logs only.

## Direct browser-to-backend
When the browser calls Go directly, CORS must be explicit and minimal.

Do not allow wildcard origins for authenticated VT Connect APIs.
