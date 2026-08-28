# Story Paragraph Structure Analyzer Documentation

The `analyzeParagraphStructure` function in `frontend/src/utils/storyParagraphStructureAnalyzer.ts` evaluates paragraph structures and pacing quality across story text drafts.

## Interface

```typescript
export interface ParagraphStructureAnalysis {
  structureScore: number;
  pacingAdvice: string;
}
```

## Usage Example

```typescript
import { analyzeParagraphStructure } from '../utils/storyParagraphStructureAnalyzer';

const analysis = analyzeParagraphStructure(storyText);
console.log(`Structure Score: ${analysis.structureScore}`);
console.log(`Advice: ${analysis.pacingAdvice}`);
```
