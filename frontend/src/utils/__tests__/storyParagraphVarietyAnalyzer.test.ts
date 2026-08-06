import { describe, it, expect } from 'vitest';
import { analyzeParagraphVariety } from '../storyParagraphVarietyAnalyzer';

describe('storyParagraphVarietyAnalyzer utility', () => {
  it('should return score 100 and hasGoodVariety true for empty string input', () => {
    const result = analyzeParagraphVariety('');
    expect(result.varietyScore).toBe(100);
    expect(result.hasGoodVariety).toBe(true);
  });

  it('should evaluate paragraph variety for diverse paragraph lengths', () => {
    const story = 'Short.\n\nThis paragraph is significantly longer with many words.';
    const result = analyzeParagraphVariety(story);
    expect(result.hasGoodVariety).toBe(true);
    expect(result.varietyScore).toBeGreaterThan(60);
  });
});
