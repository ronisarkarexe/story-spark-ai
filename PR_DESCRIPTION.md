## Before you open this PR

- **Issue:** Open or link a related issue when there is one (`Closes #123`, `Fixes #45`, or write **None** under Related issue below).
- **Description:** Fill in **What this PR does** so a reviewer can understand the change without your local context.
- **Screenshots:** Add screenshots or a short recording when they help (UI changes, confusing flows, or non-code proof). If not needed, say so in the checklist.

## Screenshot (when helpful)

```text
> story-spark-ai-backend@1.0.0 build
> tsc

(Completed successfully with exit code 0)
```

## What this PR does

This PR resolves all TypeScript compilation (`tsc`) syntax, import path, and type definition errors across the backend services that were causing build failures in the CI pipeline.

Specifically, it:
1. **Resolves Variable Errors in Gemini Utils:** Declared and assigned `genreInstruction`, `toneInstruction`, and `charactersInstruction` correctly inside `generateWithGeminiStories`.
2. **Corrects Dashboard Analysis Parameter Count:** Fixed `getDashboardAnalysis` call to pass only the single expected parameter (`userId`).
3. **Adds Missing Social Profile Keys:** Added missing `github` and `discord` keys during social object initialization for Google login registration.
4. **Removes Newsletter Duplicate Code:** Cleaned up duplicate imports and identical controller route handlers that had been appended to `newsletter.controller.ts`.
5. **Aligns Post Controller & Service Parameters:** Removed the unused `token` argument from `getSinglePost` controller call, and added `limit` support to `getPostsByTag` service method.
6. **Harmonizes Mongoose Schema and IUser Interface:** Added `subscriptionExpiry`, `lastPaymentId`, and `lastOrderId` fields to both Mongoose schema and the `IUser` interface to support subscription status actions. Also resolved duplicate `github`/`discord` definitions on the interface.
7. **Restores OTP Rate Limiter:** Re-implemented the missing `otpRateLimiter` sliding-window in-memory rate-limiter middleware.
8. **Fixes User Model Import:** Fixed incorrect relative import path and named import of `{ User }` in the payment controller.
9. **Adds Multi-Story Continuation Service:** Implemented and exported the missing `aiFreeStoryContinuationMultiple` method in `AiModelService`.
10. **Broadening Collab Socket Events:** Removed the undefined `rooms` variable references in Yjs/awareness socket updates and set them to broadcast directly to the room, bypassing MongoDB bottlenecks.
11. **Bypasses Generic Type Index Write Restriction:** Cast generic object to `Record<string, any>` during property recursion sanitizing in `sanitize.util.ts`.

## Type of change

Check all that apply (if more than one, explain in “What this PR does”).

- [x] Bug fix
- [ ] New feature
- [x] Code refactor
- [ ] Documentation update

## Related issue

None

## More screenshots (optional)

N/A

## Checklist

- [x] I have added screenshots or a recording when they help explain this PR, or noted **N/A** with a one-line reason (N/A - non-UI/compilation fixes).
- [x] I have filled in the related issue number when there is one.
- [x] I have tested my changes.
- [x] I have done a self-review of the code.
