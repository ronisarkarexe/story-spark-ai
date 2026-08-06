import { describe, it, expect } from 'vitest';
import { calculateWordProgress, getProgressColor, resetGoal, WritingGoal } from '../writingGoal';

describe('writingGoal utility', () => {
  it('should return 0 progress for zero target', () => {
    expect(calculateWordProgress(500, 0)).toBe(0);
  });

  it('should return 100 max progress for target completed', () => {
    expect(calculateWordProgress(1200, 1000)).toBe(100);
  });

  it('should return correct progress color strings', () => {
    expect(getProgressColor(100)).toBe('green');
    expect(getProgressColor(80)).toBe('blue');
    expect(getProgressColor(50)).toBe('yellow');
    expect(getProgressColor(20)).toBe('red');
  });

  it('should reset goal counters', () => {
    const goal: WritingGoal = {
      goalType: 'daily',
      targetWords: 1000,
      targetStories: 2,
      targetPrompts: 5,
      wordsWritten: 500,
      storiesWritten: 1,
      promptsCompleted: 3,
    };
    const reset = resetGoal(goal);
    expect(reset.wordsWritten).toBe(0);
    expect(reset.targetWords).toBe(1000);
  });
});
