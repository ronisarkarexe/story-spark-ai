# Story Tone Distribution Analyzer Documentation

The `analyzeStoryToneDistribution` function in `frontend/src/utils/storyToneDistributionAnalyzer.ts` evaluates positive, negative, and neutral tone proportions and dominant sentiment tones.

## Interface

```typescript
export interface ToneDistributionAnalysis {
  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;
  dominantTone: string;
}
```

## Usage Example

```typescript
import { analyzeStoryToneDistribution } from '../utils/storyToneDistributionAnalyzer';

const analysis = analyzeStoryToneDistribution(storyText);
console.log(`Dominant Tone: ${analysis.dominantTone}`);
console.log(`Positive Tone: ${analysis.positivePercentage}%`);
```
