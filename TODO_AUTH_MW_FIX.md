# TODO: Fix #3556 (Corrupted auth middleware)

## Goal
Replace the corrupted `backend/src/app/middleware/auth.middleware.ts` with a deterministic, correct authentication/authorization implementation.

## Steps
1. Read current `backend/src/app/middleware/auth.middleware.ts` to confirm full corrupted content.
2. Implement a clean `auth(...requiredRole)` middleware:
   - token extraction (Bearer header OR cookies.accessToken/cookies.token)
   - verify JWT using `config.jwt.secret` and `JwtHelpers.verifyToken`
   - check `TokenBlacklist.findOne({ token })`
   - load `User.findById(verifiedUser._id)`
   - enforce tokenVersion match, ACTIVE status, and requiredRole checks
   - set `(req as any).user = user` and `next()`
3. Ensure file compiles (no stray syntax) and matches TypeScript expectations.
4. Run backend tests/build with a command compatible with the environment (avoid `&&` if needed).
5. Run/verify any route-level auth middleware registrations if applicable.


