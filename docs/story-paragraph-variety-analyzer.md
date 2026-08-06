# Story Paragraph Variety Analyzer Documentation

The `analyzeParagraphVariety` function in `frontend/src/utils/storyParagraphVarietyAnalyzer.ts` evaluates paragraph length variance and checks for monotonous paragraph structures.

## Interface

```typescript
export interface ParagraphVarietyAnalysis {
  varietyScore: number;
  hasGoodVariety: boolean;
}
```

## Usage Example

```typescript
import { analyzeParagraphVariety } from '../utils/storyParagraphVarietyAnalyzer';

const analysis = analyzeParagraphVariety(storyText);
console.log(`Variety Score: ${analysis.varietyScore}`);
console.log(`Good Variety: ${analysis.hasGoodVariety}`);
```
