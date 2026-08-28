import { describe, it, expect } from 'vitest';
import { calculateReadingStats } from '../readingStats';

describe('calculateReadingStats', () => {
  it('should return 0 stats for empty or whitespace-only text', () => {
    const stats = calculateReadingStats('');
    expect(stats.words).toBe(0);
    expect(stats.paragraphs).toBe(0);
    expect(stats.chapters).toBe(0);
    expect(stats.sentences).toBe(0);
    expect(stats.averageSentenceLength).toBe(0);
    expect(stats.readingTime).toBe(0);

    const statsWhitespace = calculateReadingStats('   \n  \t ');
    expect(statsWhitespace.words).toBe(0);
    expect(statsWhitespace.readingTime).toBe(0);
  });

  it('should correctly calculate statistics for simple text', () => {
    const text = 'Hello world. This is a story spark test!';
    const stats = calculateReadingStats(text);

    expect(stats.words).toBe(8);
    expect(stats.paragraphs).toBe(1);
    expect(stats.chapters).toBe(1);
    expect(stats.sentences).toBe(2);
    expect(stats.averageSentenceLength).toBe(4);
    expect(stats.readingTime).toBe(1);
  });

  it('should count multiple chapters correctly', () => {
    const text = 'Chapter 1: The Beginning. Hello world.\n\nChapter 2: The Adventure continues here.';
    const stats = calculateReadingStats(text);

    expect(stats.chapters).toBe(2);
    expect(stats.paragraphs).toBe(2);
  });
});
