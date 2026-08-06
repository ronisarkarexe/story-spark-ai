# Story Dialogue Ratio Analyzer Documentation

The `calculateStoryDialogueRatio` function in `frontend/src/utils/storyDialogueRatioAnalyzer.ts` computes the percentage of spoken dialogue vs narrative text in stories.

## Interface

```typescript
export interface DialogueRatioAnalysis {
  dialoguePercentage: number;
  balanceCategory: string;
}
```

## Usage Example

```typescript
import { calculateStoryDialogueRatio } from '../utils/storyDialogueRatioAnalyzer';

const analysis = calculateStoryDialogueRatio(storyText);
console.log(`Dialogue Percentage: ${analysis.dialoguePercentage}%`);
console.log(`Balance Category: ${analysis.balanceCategory}`);
```
