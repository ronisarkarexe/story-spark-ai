import { describe, it, expect, beforeEach } from 'vitest';
import { clearStorySession } from '../storyStorage';

describe('storyStorage utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should remove storySession from localStorage', () => {
    localStorage.setItem('storySession', 'test-data');
    expect(localStorage.getItem('storySession')).toBe('test-data');

    clearStorySession();
    expect(localStorage.getItem('storySession')).toBeNull();
  });
});
