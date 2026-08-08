import { describe, it, expect } from 'vitest';
import { analyzeStorySentiment } from '../storySentimentAnalyzer';

describe('storySentimentAnalyzer utility', () => {
  it('should return Neutral tone for empty or whitespace text', () => {
    const result = analyzeStorySentiment('');
    expect(result.dominantTone).toBe('Neutral');
    expect(result.neutralScore).toBe(100);
  });

  it('should detect Positive sentiment tone', () => {
    const result = analyzeStorySentiment('A story of joy, victory, and smiling faces.');
    expect(result.dominantTone).toBe('Positive');
    expect(result.positiveScore).toBeGreaterThan(result.negativeScore);
  });

  it('should detect Negative sentiment tone', () => {
    const result = analyzeStorySentiment('A story of gloom, defeat, and tragedy.');
    expect(result.dominantTone).toBe('Negative');
    expect(result.negativeScore).toBeGreaterThan(result.positiveScore);
  });
});
