# Story Emotional Intensity Analyzer Documentation

The `calculateStoryEmotionalIntensity` function in `frontend/src/utils/storyEmotionalIntensityAnalyzer.ts` evaluates emotional intensity scores and identifies peak emotional moments in stories.

## Interface

```typescript
export interface EmotionalIntensityAnalysis {
  intensityScore: number;
  isHighIntensity: boolean;
}
```

## Usage Example

```typescript
import { calculateStoryEmotionalIntensity } from '../utils/storyEmotionalIntensityAnalyzer';

const analysis = calculateStoryEmotionalIntensity(storyText);
console.log(`Intensity Score: ${analysis.intensityScore}`);
console.log(`High Intensity: ${analysis.isHighIntensity}`);
```
