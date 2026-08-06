import { describe, it, expect } from 'vitest';
import { calculateStoryPacingScore } from '../storyPacingScoreAnalyzer';

describe('storyPacingScoreAnalyzer utility', () => {
  it('should return score 100 and Neutral for empty string input', () => {
    const result = calculateStoryPacingScore('');
    expect(result.pacingScore).toBe(100);
    expect(result.rhythmCategory).toBe('Neutral');
  });

  it('should identify Fast Paced rhythm for short sentences', () => {
    const story = 'Run fast. Hide now. Stop there.';
    const result = calculateStoryPacingScore(story);
    expect(result.rhythmCategory).toBe('Fast Paced');
    expect(result.pacingScore).toBe(90);
  });
});
