import { describe, it, expect } from 'vitest';
import { calculateStoryCharacterDensity } from '../storyCharacterDensityAnalyzer';

describe('storyCharacterDensityAnalyzer utility', () => {
  it('should return 0 characters and Solo / Minimal for empty string input', () => {
    const result = calculateStoryCharacterDensity('');
    expect(result.characterCount).toBe(0);
    expect(result.castSizeCategory).toBe('Solo / Minimal');
  });

  it('should detect character proper nouns inside narrative sentences', () => {
    const text = 'Suddenly Arthur met Merlin and Morgana and Lancelot and Guinevere inside Camelot castle.';
    const result = calculateStoryCharacterDensity(text);
    expect(result.characterCount).toBeGreaterThanOrEqual(4);
  });
});
