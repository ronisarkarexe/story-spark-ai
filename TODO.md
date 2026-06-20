# TODO - Fix #3556 / PR #3559


## Authentication middleware (fix CodeQL + validation)
- [ ] Inspect and replace backend/src/app/middleware/auth.middleware.ts with hardened auth flow
- [ ] Fix Authorization header parsing (Bearer only, reject malformed)
- [ ] Fix cookie token extraction (only expected cookie keys)
- [ ] Ensure JWT verification boundary is clear and type-safe
- [ ] Enforce TokenBlacklist lookup correctly
- [ ] Verify user lookup and handle missing/invalid user
- [ ] Enforce tokenVersion validation only when present
- [ ] Verify role authorization logic (requiredRole behavior)
- [ ] Fix any type issues inside middleware

- [x] Inspect existing Trending Topics implementation in `frontend/src/components/home/trending_topic/trending_topic.component.tsx`.
- [x] Replace previous `topicsData` chip layout with a new `trendingTopics` array containing 8 topics.
- [x] Implement responsive grid (2/3/4 columns) with Tailwind hover + transition effects.
- [x] Ensure dark mode support via `dark:` classes.
- [ ] Verify there are no build/runtime errors (run frontend typecheck/build or dev check).
- [ ] Run quick manual UI verification on homepage.
main

## Type check / build hygiene
- [ ] Fix TypeScript compile errors introduced elsewhere (notably enhance_prompt.utils.ts)
- [ ] Re-run: npm run build
- [ ] Re-run: npm run typecheck (if available)

## Tests / verification
- [ ] Run: npm run test (if available)
- [ ] Run: ensure npm run build passes
- [ ] Ensure CodeQL findings resolved without suppressing alerts

## PR updates (GitHub)
- [ ] Update PR title to: fix(auth): resolve security and validation issues in authentication middleware
- [ ] Update PR description to required content
- [ ] Push commits to existing branch so PR #3559 updates automatically

