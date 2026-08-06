# Story Paragraph Density Score Analyzer Documentation

The `calculateParagraphDensityScore` function in `frontend/src/utils/storyParagraphDensityScoreAnalyzer.ts` evaluates paragraph density scores and readability classifications.

## Interface

```typescript
export interface ParagraphDensityAnalysis {
  densityScore: number;
  densityLevel: string;
}
```

## Usage Example

```typescript
import { calculateParagraphDensityScore } from '../utils/storyParagraphDensityScoreAnalyzer';

const analysis = calculateParagraphDensityScore(storyText);
console.log(`Density Score: ${analysis.densityScore}`);
console.log(`Density Level: ${analysis.densityLevel}`);
```
