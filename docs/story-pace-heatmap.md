# storyPaceHeatmap Utility

The `analyzeStoryPace` utility in `frontend/src/utils/storyPaceHeatmap.ts`
produces a pacing breakdown for a story's sections.

## Usage

```ts
import { analyzeStoryPace } from "../utils/storyPaceHeatmap";

const sections = analyzeStoryPace(storyText);
```

## Return Value

```ts
interface PaceSection {
  id: number;
  title: string;                    // "Section 1", ...
  pace: "Fast" | "Balanced" | "Slow";
  score: number;                    // 0-100
  suggestion: string;
}
```

## Behavior

- Sections are split on double newlines.
- Each section is classified by its content density and transition keywords.
- Every section includes a tailored suggestion.
- Empty input returns an empty array.

## Example

```ts
analyzeStoryPace("A fast action scene.\\n\\nA slow reflective passage.");
// [{ id: 1, pace: "Fast", ... }, { id: 2, pace: "Slow", ... }]
```

## Tests

Covered by `frontend/src/utils/__tests__/storyPaceHeatmap.test.ts`.
