# useCharacterChecker Hook

## Overview

The `useCharacterChecker` hook analyzes a story for character name consistency issues. It wraps the `checkNameConsistency` utility and provides a stateful interface for running name consistency analysis and applying name replacements across the story text.

## Location

`frontend/src/hooks/useCharacterChecker.ts`

## Usage

```tsx
import useCharacterChecker from "../hooks/useCharacterChecker";

function StoryEditor() {
  const { issues, analyzeStory, replaceName } = useCharacterChecker();

  const handleAnalyze = () => {
    const story = "Jon walked into the room and met Kathrine.";
    analyzeStory(story);
  };

  return (
    <div>
      <button onClick={handleAnalyze}>Analyze Story</button>
      {issues.map((issue, idx) => (
        <p key={idx}>
          Found "{issue.original}" — suggest: "{issue.suggestion}"
        </p>
      ))}
    </div>
  );
}
```

## Options

The hook accepts no options. It initializes with an empty issues array and exposes two functions for interaction.

## Return Value

```ts
interface UseCharacterCheckerReturn {
  /** Array of name consistency issues found in the last analyzed story. */
  issues: NameIssue[];
  /** Analyzes the given story string and populates the issues array. */
  analyzeStory: (story: string) => void;
  /** Replaces all occurrences of oldName with newName in the given story text. */
  replaceName: (story: string, oldName: string, newName: string) => string;
}
```

## Exported Types

### `NameIssue`

Represents a character name inconsistency found in the story.

```ts
interface NameIssue {
  /** The original misspelled or inconsistent name found in the text. */
  original: string;
  /** The suggested corrected name. */
  suggestion: string;
}
```

## Behavior

- `analyzeStory(story)` calls `checkNameConsistency(story)` and stores the result in the `issues` state. It does not modify the story text.
- `replaceName(story, oldName, newName)` performs a plain string replacement of all occurrences of `oldName` with `newName` using `String.prototype.replaceAll`. It does not perform fuzzy matching.
- The `issues` array is initialized as an empty array and is only updated when `analyzeStory` is called.
- The hook does not perform network requests; analysis is entirely synchronous and client-side.

## Dependencies

- `checkNameConsistency` from `frontend/src/utils/nameConsistency`
