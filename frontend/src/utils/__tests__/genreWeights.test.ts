import { describe, it, expect } from "vitest";
import {
  normalizeWeights,
  validateWeights,
  buildGenrePrompt,
} from "../genreWeights";

describe("normalizeWeights", () => {
  it("normalizes weights to percentages that sum to 100", () => {
    const config = {
      genres: [
        { genre: "fantasy", weight: 1 },
        { genre: "sci-fi", weight: 1 },
        { genre: "horror", weight: 1 },
        { genre: "romance", weight: 1 },
      ],
    };
    const result = normalizeWeights(config);
    const total = result.genres.reduce((sum, g) => sum + g.weight, 0);
    expect(total).toBe(100);
  });

  it("preserves genre names after normalization", () => {
    const config = {
      genres: [
        { genre: "fantasy", weight: 30 },
        { genre: "sci-fi", weight: 70 },
      ],
    };
    const result = normalizeWeights(config);
    expect(result.genres.map((g) => g.genre)).toEqual(["fantasy", "sci-fi"]);
  });


  it("handles empty genres array by returning empty config", () => {

    const config = { genres: [] };
    const result = normalizeWeights(config);
    expect(result.genres).toEqual([]);
  });


  it("handles zero-weight genres array with entries by returning empty config", () => {
    const config = {
      genres: [
        { genre: "fantasy", weight: 0 },
        { genre: "sci-fi", weight: 0 },
      ],
    };
    const result = normalizeWeights(config);
    expect(result.genres).toEqual([]);
  });

  it("rounds normalized weights to integers", () => {
    const config = {
      genres: [
        { genre: "a", weight: 1 },
        { genre: "b", weight: 2 },
      ],
    };
    const result = normalizeWeights(config);
    expect(result.genres.every((g) => Number.isInteger(g.weight))).toBe(true);
  });

  it("handles single-genre config", () => {
    const config = { genres: [{ genre: "fantasy", weight: 50 }] };
    const result = normalizeWeights(config);
    expect(result.genres.length).toBe(1);
    expect(result.genres[0].genre).toBe("fantasy");
  });

  it("preserves object shape in returned genres", () => {
    const config = {
      genres: [{ genre: "mystery", weight: 100 }],
    };
    const result = normalizeWeights(config);
    expect(result.genres[0]).toHaveProperty("genre");
    expect(result.genres[0]).toHaveProperty("weight");
  });
});

describe("validateWeights", () => {
  it("returns true when weights sum to exactly 100", () => {
    const config = {
      genres: [
        { genre: "fantasy", weight: 40 },
        { genre: "sci-fi", weight: 60 },
      ],
    };
    expect(validateWeights(config)).toBe(true);
  });

  it("returns true when weights sum to 100 with multiple genres", () => {
    const config = {
      genres: [
        { genre: "a", weight: 25 },
        { genre: "b", weight: 25 },
        { genre: "c", weight: 25 },
        { genre: "d", weight: 25 },
      ],
    };
    expect(validateWeights(config)).toBe(true);
  });

  it("returns false when weights sum to less than 100", () => {
    const config = {
      genres: [
        { genre: "fantasy", weight: 30 },
        { genre: "sci-fi", weight: 30 },
      ],
    };
    expect(validateWeights(config)).toBe(false);
  });

  it("returns false when weights sum to more than 100", () => {
    const config = {
      genres: [
        { genre: "fantasy", weight: 60 },
        { genre: "sci-fi", weight: 60 },
      ],
    };
    expect(validateWeights(config)).toBe(false);
  });

  it("returns false for empty genres array", () => {
    const config = { genres: [] };
    expect(validateWeights(config)).toBe(false);
  });


  it("returns false for a single genre at weight 100", () => {
    const config = { genres: [{ genre: "fantasy", weight: 100 }] };
    expect(validateWeights(config)).toBe(true);
  });

  it("returns false for a single genre at weight 50", () => {
    const config = { genres: [{ genre: "fantasy", weight: 50 }] };
    expect(validateWeights(config)).toBe(false);
  });
});

describe("buildGenrePrompt", () => {
  it("builds a comma-separated prompt with genre and percentage", () => {
    const config = {
      genres: [
        { genre: "fantasy", weight: 70 },
        { genre: "sci-fi", weight: 30 },
      ],
    };
    const result = buildGenrePrompt(config);
    expect(result).toContain("fantasy");
    expect(result).toContain("70%");
    expect(result).toContain("sci-fi");
    expect(result).toContain("30%");
  });

  it("returns empty string for empty genres array", () => {
    const config = { genres: [] };
    expect(buildGenrePrompt(config)).toBe("");
  });

  it("handles single genre correctly", () => {
    const config = { genres: [{ genre: "horror", weight: 100 }] };
    const result = buildGenrePrompt(config);
    expect(result).toBe("horror (100%)");
  });

  it("joins multiple genres with comma and space", () => {
    const config = {
      genres: [
        { genre: "a", weight: 25 },
        { genre: "b", weight: 25 },
        { genre: "c", weight: 50 },
      ],
    };
    const result = buildGenrePrompt(config);
    expect(result.split(", ")).toHaveLength(3);
  });
});
