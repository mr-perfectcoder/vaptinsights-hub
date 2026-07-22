# VT Connect API Call Rules

## General rule
All frontend API calls must use TanStack Query with custom hooks.

All app API calls must pass through the shared `axiosInstance`.

Do not call APIs directly with `fetch` or raw `axios` inside components.

Exception: NextAuth/server-side auth glue may use server-side calls when required for session creation, callbacks, or route protection.

Third-party API calls should also be wrapped in custom hooks and use TanStack Query when possible.

Small browser utilities may use direct browser APIs when they are not part of app data flow.

Example: public IP lookup, analytics SDK calls, or WebAuthn browser APIs.

## Folder pattern
Use this structure:

```txt
src/hooks/query-hooks/
  feature.keys.ts
  feature.query.ts
```

Example:

```txt
src/hooks/query-hooks/vt-connect.keys.ts
src/hooks/query-hooks/vt-connect.query.ts
```

## Query hooks
Use:

- `useQuery` for GET APIs.
- `useMutation` for POST, PATCH, PUT, and DELETE APIs.
- `useQueryClient` to invalidate affected query keys after mutations.
- `enabled` for dependent queries.

Do not call hooks conditionally.

Query keys must be stable and include params when params affect the result.

Components should call hooks only.

Good:

```ts
const invites = useVTListInvites();
const createInvite = useVTCreateInvite();
```

Avoid:

```ts
await axios.post(...);
fetch(...);
```

## Axios layer
All hooks should use the shared axios layer.

The axios layer handles:

- backend base URL from `NEXT_PUBLIC_API_BASE_URL`
- access token
- SecureAPI headers
- delegation certificate
- auth error handling

Do not bypass `axiosInstance` for normal VT Connect APIs.

Axios must sign the exact backend path and exact body sent to Go.

On `401`, clear auth/session state and redirect to login.

## Direct backend calls
Normal VT Connect APIs should call Go directly from the browser:

```txt
Browser -> /vt-connect/api/...
```

Use Next.js only for NextAuth session handling, delegation certificate signing, layout auth state, and redirects.

## New API rule
When adding a new frontend API, add:

1. query key
2. query hook
3. component usage through the hook
4. cache invalidation or cache update after mutation
