import { describe, it, expect } from 'vitest';
import { normalizeWeights, validateWeights, buildGenrePrompt } from '../genreWeights';

describe('genreWeights utility', () => {
  it('should normalize genre weights to sum to 100', () => {
    const config = {
      genres: [
        { genre: 'Sci-Fi', weight: 30 },
        { genre: 'Fantasy', weight: 70 },
      ],
    };
    const normalized = normalizeWeights(config);

    expect(normalized.genres[0].weight).toBe(30);
    expect(normalized.genres[1].weight).toBe(70);
  });

  it('should validate weights that total 100', () => {
    const validConfig = {
      genres: [
        { genre: 'Mystery', weight: 40 },
        { genre: 'Horror', weight: 60 },
      ],
    };
    expect(validateWeights(validConfig)).toBe(true);

    const invalidConfig = {
      genres: [
        { genre: 'Mystery', weight: 10 },
      ],
    };
    expect(validateWeights(invalidConfig)).toBe(false);
  });

  it('should build formatted genre prompt string', () => {
    const config = {
      genres: [
        { genre: 'Drama', weight: 50 },
        { genre: 'Romance', weight: 50 },
      ],
    };
    const prompt = buildGenrePrompt(config);
    expect(prompt).toBe('Drama (50%), Romance (50%)');
  });
});
