# VT Connect Auth Rules

## API protection
All VT Connect backend APIs under `/vt-connect/api/...` must use `VTConnectSecureAPIRequired`.

Frontend requests must send:

```http
X-Timestamp
X-Request-ID
X-Signature
X-Delegation-Cert
```

These headers protect the API request. They do not authenticate the user.

Public auth routes do not need `Authorization`, but still must send SecureAPI headers.

Examples:

- login start/finish
- bootstrap start/finish
- invite accept start/finish

## CORS
Direct browser-to-Go API calls must have strict CORS.

Allowed origins must be explicit.

Allowed headers must include:

```http
Authorization
Content-Type
X-Timestamp
X-Request-ID
X-Signature
X-Delegation-Cert
```

## User auth
Private APIs must also send:

```http
Authorization: Bearer <accessToken>
```

Backend verifies this with `VTConnectSessionRequired`.

## Hybrid token model
Use:

```txt
JWT access token + DB-backed session record
```

After login, bootstrap, or invite acceptance succeeds, backend must:

1. Create a `vt_auth_sessions` row.
2. Create a short-lived signed JWT access token.
3. Return the JWT as `access_token`.

JWT should include `sub`, `sid`, `email`, `role`, `iss`, `aud`, and `exp`.

JWT must use a strong signing algorithm such as `EdDSA` or `RS256`.

JWT signing keys must come from server-only environment variables.

Never expose JWT signing keys through `NEXT_PUBLIC_*`.

JWT access tokens should be short-lived, for example `15m`.

JWT must use:

```txt
iss = vt-connect
aud = vt-connect-api
```

Private APIs must validate both:

1. JWT signature, issuer, audience, and expiry.
2. DB session record from `sid`.

Reject when the JWT is invalid, session is missing, session is revoked, session is expired, or user is inactive.

For admin APIs, backend must not trust stale JWT role alone.

Use the DB user/session state as the source of truth for sensitive admin checks.

If refresh tokens are not implemented, expired JWTs must require login again.

If refresh tokens are implemented later, refresh must still validate the DB session.

## Middleware order
Use this order for private APIs:

```txt
VTConnectSecureAPIRequired
VTConnectSessionRequired
RequireVTConnectRole(...) // only when needed
```

## Logout
Logout must revoke the DB session and clear frontend auth state.

Frontend must store the access token only through the approved auth/session layer.

Do not store access tokens in `localStorage`.

## Invite rule
VT Connect is invite-only.

`allowed_ip` is required for every invite.
