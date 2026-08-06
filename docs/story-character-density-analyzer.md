# Story Character Density Analyzer Documentation

The `calculateStoryCharacterDensity` function in `frontend/src/utils/storyCharacterDensityAnalyzer.ts` evaluates unique character proper noun counts and cast size categories in stories.

## Interface

```typescript
export interface CharacterDensityAnalysis {
  characterCount: number;
  castSizeCategory: string;
}
```

## Usage Example

```typescript
import { calculateStoryCharacterDensity } from '../utils/storyCharacterDensityAnalyzer';

const analysis = calculateStoryCharacterDensity(storyText);
console.log(`Character Count: ${analysis.characterCount}`);
console.log(`Cast Size Category: ${analysis.castSizeCategory}`);
```
