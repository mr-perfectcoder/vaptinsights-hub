# Design Pattern Rules

## Feature ownership
Prefer feature-based organization.

A feature may own its own:

- components
- hooks
- types
- schemas
- constants
- utilities

Keep shared code shared only when it is reused by more than one feature.

## Separation of concerns
Components should focus on UI and user interaction.

Do not put API calls, auth logic, crypto logic, validation schemas, or large data transforms directly inside components.

Move non-UI logic into hooks, utilities, query hooks, or service helpers.

## Hooks
Use custom hooks for reusable UI state and workflows.

Use query hooks for server state.

Do not mix server state and local UI state unless the component needs both.

## Server and client boundary
Keep server-only code out of client components.

Never expose secrets in client code or `NEXT_PUBLIC_*` variables.

Browser-only APIs must stay in client components/hooks.

Server actions should be used only when server trust is required.

## Data flow
Keep data flow predictable:

```txt
component -> custom hook/query hook -> axios/service -> backend
```

Avoid hidden API calls from random utilities.

## Naming
Use clear feature prefixes for feature-specific code.

Example:

```txt
useVTCreateInvite
vtConnectQueryKeys
VTInvite
```

## States
Every user-facing async flow should handle:

- loading
- success
- empty state
- error
- unauthorized/session expired

## Refactoring
Keep changes scoped to the feature being worked on.

Do not refactor unrelated modules unless required for the task.
