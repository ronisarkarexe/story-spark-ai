import { describe, it, expect } from 'vitest';
import { calculateProgress } from '../writingGoals';

describe('writingGoals utility', () => {
  it('should return 0 when target is 0', () => {
    expect(calculateProgress(500, 0)).toBe(0);
  });

  it('should calculate percentage progress capped at 100%', () => {
    expect(calculateProgress(500, 1000)).toBe(50);
    expect(calculateProgress(1500, 1000)).toBe(100);
  });
});
