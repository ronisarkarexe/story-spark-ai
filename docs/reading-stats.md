# Reading Statistics Utility Documentation

The `calculateReadingStats` utility function in `frontend/src/utils/readingStats.ts` computes key document metrics for story text analytics.

## Interface

```typescript
export interface ReadingStats {
  words: number;
  paragraphs: number;
  chapters: number;
  sentences: number;
  averageSentenceLength: number;
  readingTime: number;
}
```

## Calculation Formulas

- **Words**: Split by whitespace regex `/\s+/`. Returns `0` if string is empty.
- **Paragraphs**: Split by blank line regex `/\n\s*\n/`.
- **Chapters**: Count occurrences of the keyword `chapter` (case-insensitive).
- **Sentences**: Split by sentence punctuation `/[.!?]+/`.
- **Average Sentence Length**: Calculated as `Math.round(words / sentences)`.
- **Reading Time**: Calculated assuming an average reading speed of 200 words per minute (`Math.ceil(words / 200)`). Returns `0` for empty text.

## Usage Example

```typescript
import { calculateReadingStats } from '../utils/readingStats';

const stats = calculateReadingStats(storyText);
console.log(`Estimated reading time: ${stats.readingTime} minute(s)`);
```
