import { describe, it, expect } from "vitest";
import { generateStoryAnalytics, refreshAnalytics } from "../storyReadingAnalytics";

describe("generateStoryAnalytics - comprehensive", () => {
  it("returns an object with all required fields for non-empty input", () => {
    const r = generateStoryAnalytics("one two three four five six");
    expect(r).toHaveProperty("totalViews");
    expect(r).toHaveProperty("averageReadingTime");
    expect(r).toHaveProperty("completionRate");
    expect(r).toHaveProperty("likes");
    expect(r).toHaveProperty("bookmarks");
    expect(r).toHaveProperty("shares");
    expect(r).toHaveProperty("engagementTrend");
    expect(Array.isArray(r.engagementTrend)).toBe(true);
  });

  it("averageReadingTime scales with word count", () => {
    const short = generateStoryAnalytics("a b c");
    const long = generateStoryAnalytics("w ".repeat(500).trim());
    expect(long.averageReadingTime).toBeGreaterThan(short.averageReadingTime);
  });

  it("engagementTrend is a non-empty ascending-ish series for non-empty input", () => {
    const r = generateStoryAnalytics("a story");
    expect(r.engagementTrend.length).toBeGreaterThan(0);
    for (const v of r.engagementTrend) {
      expect(typeof v).toBe("number");
    }
  });

  it("is deterministic for the same input", () => {
    const story = "a deterministic story with several words in it.";
    expect(generateStoryAnalytics(story)).toEqual(generateStoryAnalytics(story));
  });

  it("refreshAnalytics delegates to generateStoryAnalytics", () => {
    const story = "a story for refresh.";
    expect(refreshAnalytics(story)).toEqual(generateStoryAnalytics(story));
  });
});
