import { describe, it, expect } from 'vitest';
import { analyzePacing, getOverallRating, refreshAnalysis } from '../pacingAnalyzer';

describe('pacingAnalyzer utility', () => {
  it('should return pacing analysis object', () => {
    const analysis = analyzePacing('A fast-paced action scene.');
    expect(analysis).toHaveProperty('overallScore');
    expect(analysis).toHaveProperty('issues');
    expect(Array.isArray(analysis.issues)).toBe(true);
  });

  it('should return correct rating categories based on score thresholds', () => {
    expect(getOverallRating(90)).toBe('Excellent');
    expect(getOverallRating(70)).toBe('Good');
    expect(getOverallRating(50)).toBe('Average');
    expect(getOverallRating(30)).toBe('Needs Improvement');
  });

  it('should refresh analysis', () => {
    const fresh = refreshAnalysis('Updated story text.');
    expect(fresh.overallScore).toBe(85);
  });
});
