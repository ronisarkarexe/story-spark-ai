import { describe, it, expect } from 'vitest';
import { calculateReadabilityScore } from '../storyReadabilityScorer';

describe('storyReadabilityScorer utility', () => {
  it('should return score 100 and Easy level for empty string', () => {
    expect(calculateReadabilityScore('')).toEqual({ score: 100, level: 'Easy' });
  });

  it('should return Easy level for simple short words', () => {
    const result = calculateReadabilityScore('Cat sat on mat');
    expect(result.level).toBe('Easy');
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it('should return Complex level for polysyllabic technical vocabulary', () => {
    const result = calculateReadabilityScore('Extraterrestrial biosignatures multidimensional astrophysicists');
    expect(result.level).toBe('Complex');
    expect(result.score).toBeLessThan(50);
  });
});
