import { describe, it, expect } from 'vitest';
import { analyzeGenres } from '../genreAnalyzer';

describe('analyzeGenres', () => {
  it('should return empty array when no genres are selected', () => {
    const result = analyzeGenres('A story with magic and love', []);
    expect(result).toEqual([]);
  });

  it('should return scores for selected genres', () => {
    const result = analyzeGenres('A story with magic', ['Fantasy']);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ genre: 'Fantasy' });
  });

  it('should score Fantasy genre for magic keyword', () => {
    const result = analyzeGenres('The wizard cast a magic spell in the kingdom', ['Fantasy']);
    expect(result[0].score).toBeGreaterThan(0);
  });

  it('should score Romance genre for love keyword', () => {
    const result = analyzeGenres('She fell in love with a kiss', ['Romance']);
    expect(result[0].score).toBeGreaterThan(0);
  });

  it('should score Mystery genre for murder keyword', () => {
    const result = analyzeGenres('The detective found a clue during the investigation', ['Mystery']);
    expect(result[0].score).toBeGreaterThan(0);
  });

  it('should score Horror genre for ghost keyword', () => {
    const result = analyzeGenres('The haunted house was dark', ['Horror']);
    expect(result[0].score).toBeGreaterThan(0);
  });

  it('should score Sci-Fi genre for robot keyword', () => {
    const result = analyzeGenres('The robot traveled to space', ['Sci-Fi']);
    expect(result[0].score).toBeGreaterThan(0);
  });

  it('should give higher score for more keyword matches', () => {
    const few = analyzeGenres('A wizard with magic', ['Fantasy']);
    const many = analyzeGenres('A wizard with magic spell and a dragon and an elf', ['Fantasy']);
    expect(many[0].score).toBeGreaterThanOrEqual(few[0].score);
  });

  it('should cap score at 100', () => {
    const result = analyzeGenres(
      'magic magic magic magic magic magic magic magic magic magic magic magic magic',
      ['Fantasy']
    );
    expect(result[0].score).toBeLessThanOrEqual(100);
  });

  it('should return suggestion based on score', () => {
    const low = analyzeGenres('A simple story', ['Fantasy']);
    const high = analyzeGenres('The wizard cast magic spell in the kingdom with a sword', ['Fantasy']);
    expect(low[0].suggestion).toContain('Consider adding');
    expect(high[0].suggestion).toContain('well represented');
  });

  it('should handle unknown genre gracefully', () => {
    const result = analyzeGenres('A story', ['UnknownGenre']);
    expect(result).toHaveLength(1);
    expect(result[0].score).toBe(0);
  });

  it('should analyze multiple genres simultaneously', () => {
    const result = analyzeGenres(
      'A magical love story in space',
      ['Fantasy', 'Romance', 'Sci-Fi']
    );
    expect(result).toHaveLength(3);
    expect(result.map(r => r.genre)).toEqual(['Fantasy', 'Romance', 'Sci-Fi']);
  });

  it('should be case insensitive', () => {
    const lower = analyzeGenres('The wizard cast magic', ['Fantasy']);
    const upper = analyzeGenres('The WIZARD cast MAGIC', ['Fantasy']);
    expect(upper[0].score).toBe(lower[0].score);
  });
});
