# Story Sentiment Trend Analyzer Documentation

The `analyzeStorySentimentTrend` function in `frontend/src/utils/storySentimentTrendAnalyzer.ts` evaluates sentiment progression across narrative sections (beginning, middle, ending).

## Interface

```typescript
export interface SentimentTrendAnalysis {
  beginningScore: number;
  middleScore: number;
  endingScore: number;
  overallTrend: string;
}
```

## Usage Example

```typescript
import { analyzeStorySentimentTrend } from '../utils/storySentimentTrendAnalyzer';

const analysis = analyzeStorySentimentTrend(storyText);
console.log(`Overall Trend: ${analysis.overallTrend}`);
console.log(`Beginning Score: ${analysis.beginningScore}`);
```
