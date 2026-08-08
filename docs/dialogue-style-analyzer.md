# Dialogue Style Analyzer Documentation

The `analyzeDialogue` function in `frontend/src/utils/dialogueStyleAnalyzer.ts` analyzes dialogue patterns across story characters.

## Interface

```typescript
export interface CharacterDialogueAnalysis {
  id: number;
  character: string;
  uniquenessScore: number;
  vocabularyStyle: string;
  speechPattern: string;
  similarTo?: string;
  suggestions: string[];
}
```

## Metrics & Thresholds

- **Uniqueness Score**: Range from 65 to 100 representing dialogue distinctiveness.
- **Vocabulary Style**:
  - Score > 85: `"Distinct"`
  - Score <= 85: `"Moderately Distinct"`
- **Speech Pattern**:
  - Score > 85: `"Unique tone and sentence structure"`
  - Score <= 85: `"Similar wording with other characters"`
- **Suggestions**: Provides actionable writing suggestions when dialogue scores drop below 75.

## Usage Example

```typescript
import { analyzeDialogue } from '../utils/dialogueStyleAnalyzer';

const analysis = analyzeDialogue(storyContent);
console.log(analysis);
```
