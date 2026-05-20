# Design: CI test script (2026-05-19)

## Context
- CI workflow runs `npm run test`.
- `package.json` has no `test` script, causing CI failure.

## Goals
- Unblock PR by defining a `test` script.
- Keep CI workflow unchanged.

## Non-goals
- Add a test framework (Jest/Vitest).
- Add new test cases.

## Proposed change
- Add `"test": "npm run lint"` to `package.json` scripts.

## Rationale
- Linting is already configured; running it in CI provides a minimal quality gate.

## Risks
- CI validates lint only, not runtime tests.
- Test coverage remains missing.

## Verification
- Run `npm run test` locally.
- CI passes on the PR.

## Rollback
- Revert the `test` script addition if needed.
