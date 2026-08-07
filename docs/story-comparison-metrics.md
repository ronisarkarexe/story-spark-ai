# calculateStoryMetrics Utility

The `calculateStoryMetrics` and `compareStories` utilities in
`frontend/src/utils/storyComparisonMetrics.ts` compute basic quantitative
metrics for one or two stories.

## Usage

```ts
import { calculateStoryMetrics, compareStories } from "../utils/storyComparisonMetrics";

const metrics = calculateStoryMetrics(storyText);
const comparison = compareStories(storyA, storyB);
```

## Return Value

```ts
interface StoryMetrics {
  wordCount: number;
  readingTime: number;        // ceil(words / 200)
  vocabularyRichness: number; // unique words / total words, percent
  dialoguePercentage: number; // capped at 100
  pacing: number;             // 90 / 75 / 60 by word count
  sentiment: "Positive" | "Neutral" | "Negative";
}
```

## Behavior

- `readingTime` uses 200 words per minute, rounded up.
- `vocabularyRichness` is the percentage of unique (lowercased) words.
- `dialoguePercentage` is derived from double-quote characters in the text.
- `pacing` is 90 for stories over 800 words, 75 over 400 words, and 60
  otherwise.
- `compareStories` returns `{ first, second }` with metrics for each story.

## Example

```ts
calculateStoryMetrics("cat dog bird");
// { wordCount: 3, readingTime: 1, vocabularyRichness: 100, ... }
```

## Tests

Covered by `frontend/src/utils/__tests__/storyComparisonMetrics.test.ts`.
