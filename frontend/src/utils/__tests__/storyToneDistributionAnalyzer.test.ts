import { describe, it, expect } from 'vitest';
import { analyzeStoryToneDistribution } from '../storyToneDistributionAnalyzer';

describe('storyToneDistributionAnalyzer utility', () => {
  it('should return Neutral for empty string input', () => {
    const result = analyzeStoryToneDistribution('');
    expect(result.dominantTone).toBe('Neutral');
    expect(result.neutralPercentage).toBe(100);
  });

  it('should detect Positive dominant tone for joyful text', () => {
    const text = 'Full of happy joy and bright love for all.';
    const result = analyzeStoryToneDistribution(text);
    expect(result.dominantTone).toBe('Positive');
  });
});
