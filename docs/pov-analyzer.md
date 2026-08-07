# analyzePOV Utility

The `analyzePOV` utility in `frontend/src/utils/povAnalyzer.ts` detects narration
perspective (POV) shifts within a story.

## Usage

```ts
import { analyzePOV } from "../utils/povAnalyzer";

const issues = analyzePOV(storyText, "First Person");
```

## Parameters

- `story` (`string`): the story text to inspect.
- `expectedPOV` (`"First Person" | "Third Person"`): the intended narration mode.

## Return Value

An array of `POVIssue` objects:

```ts
interface POVIssue {
  sentence: string;      // the offending sentence
  detectedPOV: string;   // the perspective that was detected
  reason: string;        // why it is flagged
  suggestion: string;    // how to fix it
}
```

## Behavior

- When `expectedPOV` is `"First Person"`, sentences using third-person pronouns
  (`he`, `she`, `they`, `him`, `her`, `his`, `their`) are flagged.
- When `expectedPOV` is `"Third Person"`, sentences using first-person pronouns
  (`i`, `me`, `my`, `mine`, `myself`) are flagged.
- Sentences are split on `.`, `!`, and `?`.
- An empty story returns an empty array.

## Example

```ts
analyzePOV("I was nervous. He walked in.", "First Person");
// [{ sentence: "He walked in.", detectedPOV: "Third Person", ... }]
```

## Tests

Covered by `frontend/src/utils/__tests__/povAnalyzer.test.ts`.
