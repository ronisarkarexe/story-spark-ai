import { describe, it, expect } from 'vitest';
import { getReadingTime } from '../readingTime';

describe('readingTime utility', () => {
  it('should return 0 minutes and 0 wordCount for empty text', () => {
    const result = getReadingTime('');
    expect(result.minutes).toBe(0);
    expect(result.wordCount).toBe(0);
  });

  it('should calculate reading time and word count for sample text', () => {
    const text = 'This is a test story string to calculate reading time.';
    const result = getReadingTime(text);
    expect(result.wordCount).toBe(10);
    expect(result.minutes).toBeGreaterThanOrEqual(1);
  });
});
