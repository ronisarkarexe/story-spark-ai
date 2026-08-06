import { describe, it, expect, beforeEach } from 'vitest';
import { saveReadingPosition, getReadingPosition, resetReadingPosition } from '../readingProgress';

describe('readingProgress utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save and retrieve reading position', () => {
    saveReadingPosition('story-123', 450);
    expect(getReadingPosition('story-123')).toBe(450);
  });

  it('should reset reading position', () => {
    saveReadingPosition('story-123', 450);
    resetReadingPosition('story-123');
    expect(getReadingPosition('story-123')).toBe(0);
  });

  it('should return 0 when storyId is empty or non-existent', () => {
    expect(getReadingPosition('')).toBe(0);
    expect(getReadingPosition('non-existent')).toBe(0);
  });
});
