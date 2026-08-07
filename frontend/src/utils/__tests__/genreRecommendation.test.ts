import { describe, it, expect } from "vitest";
import { getGenreRecommendations } from "../genreRecommendation";

describe("getGenreRecommendations", () => {
  it("returns a non-empty list of recommendations", () => {
    const recommendations = getGenreRecommendations();
    expect(recommendations.length).toBeGreaterThan(0);
  });

  it("returns recommendations with the expected shape", () => {
    const recommendations = getGenreRecommendations();
    const item = recommendations[0];
    expect(item).toHaveProperty("genre");
    expect(item).toHaveProperty("confidence");
    expect(item).toHaveProperty("reason");
  });

  it("keeps confidence within 0-100", () => {
    const recommendations = getGenreRecommendations();
    for (const item of recommendations) {
      expect(item.confidence).toBeGreaterThanOrEqual(0);
      expect(item.confidence).toBeLessThanOrEqual(100);
    }
  });

  it("includes the Fantasy genre", () => {
    const recommendations = getGenreRecommendations();
    expect(recommendations.some((r) => r.genre === "Fantasy")).toBe(true);
  });

  it("provides a non-empty reason for every recommendation", () => {
    const recommendations = getGenreRecommendations();
    for (const item of recommendations) {
      expect(item.reason.length).toBeGreaterThan(0);
    }
  });
});
