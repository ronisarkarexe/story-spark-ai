# writingMilestone Utility

The `calculateWritingMilestones` utility in
`frontend/src/utils/writingMilestone.ts` tracks a writer's progress toward
milestone targets.

## Usage

```ts
import { calculateWritingMilestones } from "../utils/writingMilestone";

const milestones = calculateWritingMilestones(storyText, chapterCount);
```

## Return Value

```ts
interface WritingMilestone {
  totalWords: number;
  completedChapters: number;
  totalChapters: number;        // max(chapterCount, 10)
  completionPercentage: number; // capped at 100, vs 5000-word target
  editingProgress: number;      // capped at 100
}
```

## Behavior

- `completionPercentage` compares the word count against a 5000-word target.
- `totalChapters` never reports fewer than 10.
- `editingProgress` blends completion percentage with chapter progress and is
  capped at 100.

## Example

```ts
calculateWritingMilestones("word ".repeat(2500), 3);
// { totalWords: 2500, completedChapters: 3, completionPercentage: 50, ... }
```

## Tests

Covered by `frontend/src/utils/__tests__/writingMilestone.test.ts`.
