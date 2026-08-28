import { describe, it, expect } from 'vitest';
import { calculateActionPacingDensity } from '../storyActionPacingDensityAnalyzer';

describe('storyActionPacingDensityAnalyzer utility', () => {
  it('should return Leisurely for empty string input', () => {
    const result = calculateActionPacingDensity('');
    expect(result.actionDensityScore).toBe(0);
    expect(result.paceCategory).toBe('Leisurely');
  });

  it('should detect Fast Paced for action-packed text', () => {
    const text = 'Sprint rush charge leap dash sprint fight chase escape!';
    const result = calculateActionPacingDensity(text);
    expect(result.paceCategory).toBe('Fast Paced');
    expect(result.actionDensityScore).toBeGreaterThan(50);
  });
});
