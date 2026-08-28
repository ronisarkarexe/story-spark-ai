# Story Sentence Length Analyzer Documentation

The `analyzeStorySentenceLength` function in `frontend/src/utils/storySentenceLengthAnalyzer.ts` evaluates sentence length distributions and cadence across story drafts.

## Interface

```typescript
export interface SentenceLengthAnalysis {
  totalSentences: number;
  averageWordsPerSentence: number;
  longestSentenceWords: number;
}
```

## Usage Example

```typescript
import { analyzeStorySentenceLength } from '../utils/storySentenceLengthAnalyzer';

const analysis = analyzeStorySentenceLength(storyText);
console.log(`Total Sentences: ${analysis.totalSentences}`);
console.log(`Avg Words/Sentence: ${analysis.averageWordsPerSentence}`);
```
