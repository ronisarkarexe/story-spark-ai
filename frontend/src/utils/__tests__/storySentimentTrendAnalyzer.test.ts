import { describe, it, expect } from 'vitest';
import { analyzeStorySentimentTrend } from '../storySentimentTrendAnalyzer';

describe('storySentimentTrendAnalyzer utility', () => {
  it('should return Steady trend for empty string input', () => {
    const result = analyzeStorySentimentTrend('');
    expect(result.overallTrend).toBe('Steady');
    expect(result.beginningScore).toBe(50);
  });

  it('should detect Uplifting overall trend when narrative sentiment improves', () => {
    const text = 'Fear dark grief sad pain. Neutral middle section here. Hope peace happy love joy victory.';
    const result = analyzeStorySentimentTrend(text);
    expect(result.overallTrend).toBe('Uplifting');
  });
});
