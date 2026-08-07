# storySceneDurationEstimator Utility

The `estimateSceneDurations` utility in
`frontend/src/utils/storySceneDurationEstimator.ts` estimates reading time per
scene and for the whole story.

## Usage

```ts
import { estimateSceneDurations } from "../utils/storySceneDurationEstimator";

const result = estimateSceneDurations(storyText);
```

## Return Value

```ts
interface SceneDuration {
  id: number;
  title: string;        // "Scene 1", ...
  wordCount: number;
  readingTime: number;  // ceil(words / 200)
}

{
  scenes: SceneDuration[];
  totalReadingTime: number;
}
```

## Behavior

- Scenes are split on double newlines.
- Reading time uses 200 words per minute, rounded up, with a minimum of 1
  minute per non-empty scene.
- Empty input returns `{ scenes: [], totalReadingTime: 0 }`.

## Example

```ts
estimateSceneDurations("word ".repeat(400));
// { scenes: [{ id: 1, wordCount: 400, readingTime: 2 }], totalReadingTime: 2 }
```

## Tests

Covered by `frontend/src/utils/__tests__/storySceneDurationEstimator.test.ts`.
