import { describe, it, expect, beforeEach } from 'vitest';
import { saveReadingPosition, getReadingPosition, resetReadingPosition } from '../readingProgress';

describe('readingProgress utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save and retrieve reading position for a story', () => {
    saveReadingPosition('story-1', 250);
    expect(getReadingPosition('story-1')).toBe(250);
  });

  it('should reset reading position for a story', () => {
    saveReadingPosition('story-2', 500);
    resetReadingPosition('story-2');
    expect(getReadingPosition('story-2')).toBe(0);
  });
});
