import { describe, it, expect } from 'vitest';
import { calculateReadingStats } from '../readingStats';

describe('readingStats utility', () => {
  it('should return zero metrics for empty string input', () => {
    const stats = calculateReadingStats('');
    expect(stats.words).toBe(0);
    expect(stats.paragraphs).toBe(0);
    expect(stats.sentences).toBe(0);
    expect(stats.chapters).toBe(0);
    expect(stats.readingTime).toBe(0);
  });

  it('should calculate reading statistics for sample story text correctly', () => {
    const text = 'Chapter 1: The Beginning.\n\nOnce upon a time in a faraway land.';
    const stats = calculateReadingStats(text);
    expect(stats.words).toBe(11);
    expect(stats.paragraphs).toBe(2);
    expect(stats.chapters).toBe(1);
    expect(stats.sentences).toBe(2);
  });
});
