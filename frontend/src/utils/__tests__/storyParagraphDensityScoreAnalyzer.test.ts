import { describe, it, expect } from 'vitest';
import { calculateParagraphDensityScore } from '../storyParagraphDensityScoreAnalyzer';

describe('storyParagraphDensityScoreAnalyzer utility', () => {
  it('should return Optimal density level for empty string input', () => {
    const result = calculateParagraphDensityScore('');
    expect(result.densityScore).toBe(100);
    expect(result.densityLevel).toBe('Optimal');
  });

  it('should detect Light density level for short paragraph drafts', () => {
    const text = 'Quick sentence here.\n\nAnother short phrase.';
    const result = calculateParagraphDensityScore(text);
    expect(result.densityLevel).toBe('Light');
  });
});
