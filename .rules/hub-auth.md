# VT Connect Auth & Access Rules

## Public Access Model
User login is **NOT required** to initiate or view compliance audit scans (such as DPDPA 2023 scans).

Compliance tools are accessible publicly without requiring user authentication, session creation, or login tokens.

## API Protection (Non-Auth Request Integrity)
Backend APIs under `/compliance/api...` may enforce request integrity and anti-abuse protection using `HubConnectSecureAPIRequired`.

Frontend requests include request signature headers for API protection:

```http
X-Timestamp
X-Request-ID
X-Signature
X-Delegation-Cert
```

**Note**: These headers verify request integrity and prevent request tampering/replay attacks. They do **NOT** authenticate or log in a user.

Public compliance scan endpoints operate without requiring `Authorization` headers or active user sessions.

## CORS
Direct browser-to-backend API calls enforce strict CORS settings.

Allowed origins must be explicitly specified.

Allowed headers include:

```http
Authorization
Content-Type
X-Timestamp
X-Request-ID
X-Signature
X-Delegation-Cert
```

## Optional / Future Authenticated Routes
If authenticated administrative or management routes are enabled in the future:
- Private routes send Bearer tokens validated by backend middleware.
- Session revocation & DB validation remain source of truth for administrative operations.
