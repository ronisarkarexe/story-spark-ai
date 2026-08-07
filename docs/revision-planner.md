# generateRevisionPlan Utility

The `generateRevisionPlan` utility in `frontend/src/utils/revisionPlanner.ts`
builds a prioritized revision task list from a story.

## Usage

```ts
import { generateRevisionPlan } from "../utils/revisionPlanner";

const tasks = generateRevisionPlan(storyText);
```

## Return Value

An array of `RevisionTask` objects:

```ts
interface RevisionTask {
  id: number;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  category: "Introduction" | "Plot" | "Dialogue" | "Ending";
  completed: boolean;
}
```

## Behavior

- Stories shorter than 1500 characters get an `Introduction` task.
- Stories containing the word `suddenly` get a `Plot` task for scene
  transitions.
- Stories with fewer than 8 double-quote characters get a `Dialogue` task.
- A `Review Ending` task is always appended.

## Example

```ts
generateRevisionPlan("short");
// [Introduction task, Ending task]
```

## Tests

Covered by `frontend/src/utils/__tests__/revisionPlanner.test.ts`.
