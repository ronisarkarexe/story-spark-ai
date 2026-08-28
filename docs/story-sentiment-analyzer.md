# Story Sentiment Analyzer Documentation

The `analyzeStorySentiment` function in `frontend/src/utils/storySentimentAnalyzer.ts` evaluates emotional tone scores across story drafts.

## Interface

```typescript
export interface StorySentimentResult {
  positiveScore: number;
  negativeScore: number;
  neutralScore: number;
  dominantTone: 'Positive' | 'Negative' | 'Neutral';
}
```

## Tone Classification Rules

- **Positive**: Dominates when positive emotion keywords (`happy`, `joy`, `victory`, `smile`, `love`) outnumber negative keywords.
- **Negative**: Dominates when negative emotion keywords (`sad`, `gloom`, `dark`, `fear`, `tragedy`) outnumber positive keywords.
- **Neutral**: Returned for empty strings or balanced sentiment distributions.

## Usage Example

```typescript
import { analyzeStorySentiment } from '../utils/storySentimentAnalyzer';

const sentiment = analyzeStorySentiment(storyText);
console.log(`Dominant Tone: ${sentiment.dominantTone}`);
```
