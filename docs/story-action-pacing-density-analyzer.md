# Story Action Pacing Density Analyzer Documentation

The `calculateActionPacingDensity` function in `frontend/src/utils/storyActionPacingDensityAnalyzer.ts` evaluates action verb frequency and narrative pacing categories.

## Interface

```typescript
export interface ActionPacingDensityAnalysis {
  actionDensityScore: number;
  paceCategory: string;
}
```

## Usage Example

```typescript
import { calculateActionPacingDensity } from '../utils/storyActionPacingDensityAnalyzer';

const analysis = calculateActionPacingDensity(storyText);
console.log(`Action Density Score: ${analysis.actionDensityScore}`);
console.log(`Pace Category: ${analysis.paceCategory}`);
```
