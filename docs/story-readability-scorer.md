# Story Readability Scorer Documentation

The `calculateReadabilityScore` function in `frontend/src/utils/storyReadabilityScorer.ts` calculates narrative reading complexity grades.

## Interface

```typescript
export interface ReadabilityScoreResult {
  score: number;
  level: 'Easy' | 'Moderate' | 'Complex';
}
```

## Level Classifications

- **Score >= 80**: `"Easy"`
- **Score 50 - 79**: `"Moderate"`
- **Score < 50**: `"Complex"`

## Usage Example

```typescript
import { calculateReadabilityScore } from '../utils/storyReadabilityScorer';

const result = calculateReadabilityScore(storyText);
console.log(`Readability Level: ${result.level} (Score: ${result.score})`);
```
