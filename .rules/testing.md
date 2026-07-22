# Testing Rules

## General
Add tests for risky logic, auth flows, API clients, and shared utilities.

Do not rely only on manual browser checks for auth or security behavior.

## Frontend
Validate important UI flows with lint and build at minimum.

Add focused component or hook tests when logic is complex.

## Backend
Add backend tests for:

- auth middleware
- role checks
- token/session validation
- invite validation
- security header validation

## Regression coverage
When fixing a bug, add a test that fails before the fix when practical.

## Scope
Keep tests focused on changed behavior.

Do not rewrite unrelated tests for style only.
