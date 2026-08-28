# storySessionRecovery Utility

The `storySessionRecovery` utilities in
`frontend/src/utils/storySessionRecovery.ts` persist and restore a draft story
across page reloads.

## Usage

```ts
import {
  saveDraft,
  getRecoveredDraft,
  discardRecoveredDraft,
  formatSavedTime,
} from "../utils/storySessionRecovery";
```

## API

- `saveDraft(content: string)` — stores the draft in localStorage under the key
  `story-session-recovery` and returns the stored `StoryRecoveryData`.
- `getRecoveredDraft()` — returns `StoryRecoveryData | null`, or `null` when
  nothing is stored or the stored JSON is invalid.
- `discardRecoveredDraft()` — removes the stored draft.
- `formatSavedTime(savedAt: string)` — formats an ISO timestamp using the
  locale string format.

## Storage Shape

```ts
interface StoryRecoveryData {
  content: string;
  savedAt: string; // ISO timestamp
}
```

## Example

```ts
saveDraft("Chapter one...");
const draft = getRecoveredDraft(); // { content, savedAt }
discardRecoveredDraft();
```

## Tests

Covered by the story session recovery docs and the utility unit tests in
`frontend/src/utils/__tests__/`.
