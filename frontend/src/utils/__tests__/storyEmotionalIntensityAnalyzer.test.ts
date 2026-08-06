import { describe, it, expect } from 'vitest';
import { calculateStoryEmotionalIntensity } from '../storyEmotionalIntensityAnalyzer';

describe('storyEmotionalIntensityAnalyzer utility', () => {
  it('should return score 0 and false for empty string input', () => {
    const result = calculateStoryEmotionalIntensity('');
    expect(result.intensityScore).toBe(0);
    expect(result.isHighIntensity).toBe(false);
  });

  it('should detect high intensity for furious shouting text with exclamations', () => {
    const text = 'He was furious and started to scream and shout! Absolutely terrified!';
    const result = calculateStoryEmotionalIntensity(text);
    expect(result.isHighIntensity).toBe(true);
    expect(result.intensityScore).toBeGreaterThanOrEqual(40);
  });
});
