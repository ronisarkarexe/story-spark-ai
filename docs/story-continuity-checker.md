# analyzeStoryContinuity Utility

The `analyzeStoryContinuity` utility in
`frontend/src/utils/storyContinuityChecker.ts` checks a story for continuity
issues across characters, timelines, locations, objects, and story logic.

## Usage

```ts
import { analyzeStoryContinuity } from "../utils/storyContinuityChecker";

const analysis = analyzeStoryContinuity(storyText);
```

## Return Value

```ts
interface ContinuityAnalysis {
  overallScore: number; // 0-100
  issues: ContinuityIssue[];
}

interface ContinuityIssue {
  id: number;
  category: "Character" | "Timeline" | "Location" | "Object" | "Story Logic";
  section: string;
  severity: "Low" | "Medium" | "High";
  issue: string;
  suggestion: string;
}
```

## Behavior

- Empty input returns `{ overallScore: 0, issues: [] }`.
- Each issue carries a category, a section reference, a severity level, a
  description, and a suggested fix.

## Example

```ts
analyzeStoryContinuity("The hero's eye color changed.");
// { overallScore: 91, issues: [{ category: "Character", severity: "Medium", ... }] }
```

## Tests

Covered by `frontend/src/utils/__tests__/storyContinuityChecker.test.ts`.
