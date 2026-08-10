# Pacing Analyzer Utility Documentation

The `analyzePacing` utility function in `frontend/src/utils/pacingAnalyzer.ts` evaluates story narrative pacing and flags section velocity issues.

## Interfaces

```typescript
export interface PacingIssue {
  id: string;
  section: string;
  type: 'Too Fast' | 'Too Slow' | 'Overly Descriptive';
  severity: 'Low' | 'Medium' | 'High';
  suggestion: string;
}

export interface PacingAnalysis {
  issues: PacingIssue[];
  overallScore: number;
}
```

## Rating Thresholds

- **Score >= 80**: `"Excellent"`
- **Score >= 60**: `"Good"`
- **Score >= 40**: `"Average"`
- **Score < 40**: `"Needs Improvement"`

## Usage Example

```typescript
import { analyzePacing, getOverallRating } from '../utils/pacingAnalyzer';

const analysis = analyzePacing(storyText);
const rating = getOverallRating(analysis.overallScore);
console.log(`Pacing Rating: ${rating}`);
```
