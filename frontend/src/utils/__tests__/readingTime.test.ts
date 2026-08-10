import { describe, it, expect } from 'vitest';
import { getReadingTime } from '../readingTime';

describe('readingTime utility', () => {
  it('should return 0 minutes and 0 wordCount for empty text', () => {
    expect(getReadingTime('')).toEqual({ minutes: 0, wordCount: 0 });
    expect(getReadingTime('   ')).toEqual({ minutes: 0, wordCount: 0 });
  });

  it('should return 1 minute for short story text', () => {
    const text = 'Once upon a time in a land far away.';
    const result = getReadingTime(text);
    expect(result.wordCount).toBe(8);
    expect(result.minutes).toBe(1);
  });

  it('should calculate correct reading minutes for long text', () => {
    const words = Array(500).fill('story').join(' ');
    const result = getReadingTime(words);
    expect(result.wordCount).toBe(500);
    expect(result.minutes).toBe(3);
  });
});
