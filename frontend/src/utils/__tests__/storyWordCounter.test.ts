import { describe, it, expect } from 'vitest';
import { countStoryWords } from '../storyWordCounter';

describe('storyWordCounter utility', () => {
  it('should return 0 words and 0 paragraphs for empty input', () => {
    expect(countStoryWords('')).toEqual({ words: 0, paragraphs: 0 });
  });

  it('should count words and paragraphs correctly', () => {
    const text = 'First paragraph text.\n\nSecond paragraph text.';
    const result = countStoryWords(text);
    expect(result.words).toBe(6);
    expect(result.paragraphs).toBe(2);
  });
});
