import { describe, it, expect } from 'vitest';
import { countStoryCharacters } from '../storyCharacterCounter';

describe('storyCharacterCounter utility', () => {
  it('should return 0 for empty string input', () => {
    expect(countStoryCharacters('')).toEqual({ total: 0, withoutSpaces: 0 });
  });

  it('should count total and non-whitespace characters correctly', () => {
    const text = 'Hello World';
    const result = countStoryCharacters(text);
    expect(result.total).toBe(11);
    expect(result.withoutSpaces).toBe(10);
  });
});
