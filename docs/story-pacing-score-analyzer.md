# Story Pacing Score Analyzer Documentation

The `calculateStoryPacingScore` function in `frontend/src/utils/storyPacingScoreAnalyzer.ts` evaluates pacing quality and rhythm categories for narrative drafts.

## Interface

```typescript
export interface PacingScoreAnalysis {
  pacingScore: number;
  rhythmCategory: string;
}
```

## Usage Example

```typescript
import { calculateStoryPacingScore } from '../utils/storyPacingScoreAnalyzer';

const analysis = calculateStoryPacingScore(storyText);
console.log(`Pacing Score: ${analysis.pacingScore}`);
console.log(`Rhythm Category: ${analysis.rhythmCategory}`);
```
