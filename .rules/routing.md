# Routing Rules

## Route groups
Use route groups to separate public and authenticated areas.

Example:

```txt
src/app/(public)/
src/app/(console)/
```

## Layouts
Authenticated console pages should share a console layout.

Public pages should not depend on console layout state.

## Redirects
Unauthenticated users should go to login.

Authenticated users should not see login pages.

## 404 behavior
Use `notFound()` for unavailable setup-only pages such as bootstrap after setup is complete.
