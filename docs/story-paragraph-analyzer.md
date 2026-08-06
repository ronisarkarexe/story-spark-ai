# Story Paragraph Analyzer Documentation

The `analyzeStoryParagraphs` function in `frontend/src/utils/storyParagraphAnalyzer.ts` evaluates paragraph structures in creative writing drafts.

## Interface

```typescript
export interface StoryParagraphAnalysis {
  totalParagraphs: number;
  averageWordsPerParagraph: number;
  longestParagraphWords: number;
}
```

## Usage Example

```typescript
import { analyzeStoryParagraphs } from '../utils/storyParagraphAnalyzer';

const analysis = analyzeStoryParagraphs(storyText);
console.log(`Total Paragraphs: ${analysis.totalParagraphs}`);
console.log(`Average Words/Paragraph: ${analysis.averageWordsPerParagraph}`);
```
