# dialogueDistribution Utility

The `getDialogueDistribution` utility in
`frontend/src/utils/dialogueDistribution.ts` computes the share of dialogue
lines per character.

## Usage

```ts
import { getDialogueDistribution } from "../utils/dialogueDistribution";

const distribution = getDialogueDistribution();
```

## Return Value

```ts
interface CharacterDialogue {
  name: string;
  lines: number;
  percentage: number; // share of total lines, rounded
}

CharacterDialogue[];
```

## Behavior

- The distribution is computed from a fixed set of example characters and
  their line counts.
- Each character's percentage is `round(lines / total * 100)`.
- The percentages are rounded, so they may not sum to exactly 100.

## Example

```ts
getDialogueDistribution();
// [{ name: "Alice", lines: 42, percentage: 44 }, ...]
```

## Tests

Covered by `frontend/src/utils/__tests__/dialogueDistribution.test.ts`.
