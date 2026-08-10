# Story Character Counter Documentation

The `countStoryCharacters` function in `frontend/src/utils/storyCharacterCounter.ts` computes raw total character length and non-whitespace character count for story drafts.

## Interface

```typescript
export interface CharacterCountResult {
  total: number;
  withoutSpaces: number;
}
```

## Usage Example

```typescript
import { countStoryCharacters } from '../utils/storyCharacterCounter';

const counts = countStoryCharacters('Hello World');
console.log(`Total: ${counts.total}, Without Spaces: ${counts.withoutSpaces}`);
```
