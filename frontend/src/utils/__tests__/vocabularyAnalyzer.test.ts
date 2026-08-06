import { describe, it, expect } from 'vitest';
import { analyzeVocabulary, getReadabilityLevel } from '../vocabularyAnalyzer';

describe('vocabularyAnalyzer utility', () => {
  it('should return 0 scores for empty string input', () => {
    const result = analyzeVocabulary('');
    expect(result.readabilityScore).toBe(0);
    expect(result.diversityScore).toBe(0);
    expect(result.repeatedWords).toEqual([]);
  });

  it('should map scores to readability levels correctly', () => {
    expect(getReadabilityLevel(95)).toBe('Excellent');
    expect(getReadabilityLevel(80)).toBe('Good');
    expect(getReadabilityLevel(65)).toBe('Average');
    expect(getReadabilityLevel(40)).toBe('Needs Improvement');
    expect(getReadabilityLevel(-10)).toBe('Needs Improvement');
  });
});