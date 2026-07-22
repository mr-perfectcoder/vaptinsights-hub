# Error Handling Rules

## UI states
Every async UI flow must handle:

- loading
- success
- empty state
- error
- unauthorized/session expired

## API errors
API hooks should normalize backend errors into useful messages.

Components should not parse raw backend error shapes repeatedly.

## Auth errors
On `401`, clear auth/session state and route the user to login.

On `403`, show an access/role message without clearing the session automatically.

## Retry
Do not retry mutations by default unless the operation is safe to repeat.

Use query retries carefully for auth-sensitive endpoints.
