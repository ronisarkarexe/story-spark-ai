# analyzeReadingInfo Utility

The `analyzeReadingInfo` utility in `frontend/src/utils/storyReadingInfo.ts`
summarizes the reading difficulty of a story.

## Usage

```ts
import { analyzeReadingInfo } from "../utils/storyReadingInfo";

const info = analyzeReadingInfo(storyText);
```

## Return Value

```ts
interface ReadingInfo {
  wordCount: number;
  readingTime: number; // ceil(words / 200), minimum 1
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}
```

## Behavior

- `wordCount` counts whitespace-separated tokens after trimming.
- `readingTime` uses 200 words per minute.
- Difficulty tiers:

| Word count  | Difficulty     |
| ----------- | -------------- |
| 0 - 1000    | Beginner       |
| 1001 - 3000 | Intermediate   |
| 3000+       | Advanced       |

## Example

```ts
analyzeReadingInfo("word ".repeat(400));
// { wordCount: 400, readingTime: 2, difficulty: "Beginner" }
```

## Tests

Covered by `frontend/src/utils/__tests__/storyReadingInfo.test.ts`.
