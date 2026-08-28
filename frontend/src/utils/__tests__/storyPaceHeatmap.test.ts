import { describe, it, expect } from "vitest";
import { analyzeStoryPace, refreshPaceAnalysis } from "../storyPaceHeatmap";

describe("analyzeStoryPace", () => {
  it("returns an empty array for empty text", () => {
    expect(analyzeStoryPace("")).toEqual([]);
    expect(analyzeStoryPace("   ")).toEqual([]);
  });

  it("splits the story into sections by double newline", () => {
    const result = analyzeStoryPace("First section.\n\nSecond section.\n\nThird section.");
    expect(result).toHaveLength(3);
  });

  it("assigns sequential ids and titles to sections", () => {
    const result = analyzeStoryPace("Alpha.\n\nBeta.");
    expect(result[0].id).toBe(1);
    expect(result[0].title).toBe("Section 1");
    expect(result[1].id).toBe(2);
    expect(result[1].title).toBe("Section 2");
  });

  it("classifies pace as Fast, Balanced, or Slow", () => {
    const result = analyzeStoryPace("A.\n\nB.\n\nC.\n\nD.");
    const valid = ["Fast", "Balanced", "Slow"];
    for (const section of result) {
      expect(valid).toContain(section.pace);
    }
  });

  it("returns scores within the valid range", () => {
    const result = analyzeStoryPace("A.\n\nB.\n\nC.");
    for (const section of result) {
      expect(section.score).toBeGreaterThanOrEqual(0);
      expect(section.score).toBeLessThanOrEqual(100);
    }
  });

  it("provides a suggestion for every section", () => {
    const result = analyzeStoryPace("A.\n\nB.");
    for (const section of result) {
      expect(section.suggestion.length).toBeGreaterThan(0);
    }
  });

  it("refreshPaceAnalysis returns the same result as analyzeStoryPace", () => {
    const story = "Alpha.\n\nBeta.";
    expect(refreshPaceAnalysis(story)).toEqual(analyzeStoryPace(story));
  });
});
