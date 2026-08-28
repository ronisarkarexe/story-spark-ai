import { describe, it, expect } from "vitest";
import { analyzeStoryThemes, reanalyzeStoryThemes } from "../storyThemeAnalyzer";

describe("analyzeStoryThemes", () => {
  it("returns an empty array for empty text", () => {
    expect(analyzeStoryThemes("")).toEqual([]);
    expect(analyzeStoryThemes("   ")).toEqual([]);
  });

  it("returns themes for a non-empty story", () => {
    const result = analyzeStoryThemes("The friends stood together through hardship.");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns themes with the expected shape", () => {
    const result = analyzeStoryThemes("A story about hope and sacrifice.");
    const theme = result[0];
    expect(theme).toHaveProperty("id");
    expect(theme).toHaveProperty("name");
    expect(theme).toHaveProperty("description");
    expect(theme).toHaveProperty("highlightedSection");
    expect(theme).toHaveProperty("confidence");
  });

  it("keeps confidence within 0-100", () => {
    const result = analyzeStoryThemes("A story about friendship.");
    for (const theme of result) {
      expect(theme.confidence).toBeGreaterThanOrEqual(0);
      expect(theme.confidence).toBeLessThanOrEqual(100);
    }
  });

  it("assigns sequential ids", () => {
    const result = analyzeStoryThemes("A story about courage.");
    result.forEach((theme, index) => {
      expect(theme.id).toBe(index + 1);
    });
  });

  it("reanalyzeStoryThemes returns the same result", () => {
    const story = "A story about loyalty.";
    expect(reanalyzeStoryThemes(story)).toEqual(analyzeStoryThemes(story));
  });
});
