# TODO

## PII scrubber fix (#3651)

- [x] Inspect existing PII scrubber implementation (`backend/src/app/middleware/pii_scrubber.ts`) and tests (`backend/src/__tests__/piiScrubber.test.ts`).
- [ ] Update the scrubber implementation to improve detection reliability and avoid edge-case misses.
- [ ] Add/extend unit tests to cover the new regexes/edge cases.
- [ ] Run backend tests (at least `piiScrubber.test.ts`) and ensure they pass.
- [ ] Commit changes on branch `blackboxai/#3651-pii-scrubber`.
- [ ] Open PR on GitHub.

