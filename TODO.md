# TODO

## PII scrubber fix (#3651)

- [x] Inspect existing PII scrubber implementation (`backend/src/app/middleware/pii_scrubber.ts`) and tests (`backend/src/__tests__/piiScrubber.test.ts`).
- [x] Update the scrubber implementation to improve detection reliability and avoid edge-case misses.
- [x] Add/extend unit tests to cover the new regexes/edge cases.
- [x] Run backend tests (at least `piiScrubber.test.ts`) and ensure they pass.
- [x] Commit changes on branch `blackboxai/#3651-pii-scrubber`.
- [x] Open PR on GitHub: https://github.com/sonusharma6-dsa/story-spark-ai/pull/new/blackboxai/%233651-pii-scrubber




