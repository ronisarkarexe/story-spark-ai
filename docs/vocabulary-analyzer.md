# analyzeVocabulary Utility

The `analyzeVocabulary` utility in `frontend/src/utils/storyVocabularyGrowthTracker.ts`
measures the vocabulary diversity of a story and flags overused words.

## Usage

```ts
import { analyzeVocabulary } from "../utils/storyVocabularyGrowthTracker";

const stats = analyzeVocabulary(storyText);
```

## Return Value

```ts
interface VocabularyStats {
  totalWords: number;   // words after stop-word filtering
  uniqueWords: number;  // distinct words
  diversityScore: number; // unique/total as a percentage
  overusedWords: {
    word: string;
    count: number;
    alternatives: string[];
  }[];
  growthHistory: { story: string; uniqueWords: number }[];
}
```

## Behavior

- Text is lowercased and stripped of punctuation before tokenization.
- A fixed stop-word list (`the`, `a`, `an`, `and`, `or`, `to`, `of`, `in`,
  `is`, `was`) is excluded.
- Words appearing 3 or more times are reported as overused, sorted by
  descending count, capped at 5 entries.
- Known overused words (`good`, `bad`, `big`, `small`) include suggested
  alternatives.
- Empty input returns zeroed stats.

## Example

```ts
analyzeVocabulary("the hero fought the dragon");
// { totalWords: 3, uniqueWords: 3, diversityScore: 100, ... }
```

## Tests

Covered by `frontend/src/utils/__tests__/storyVocabularyGrowthTracker.test.ts`.
