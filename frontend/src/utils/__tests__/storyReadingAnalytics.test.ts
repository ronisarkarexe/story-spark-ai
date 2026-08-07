import { describe, it, expect } from "vitest";
import { generateStoryAnalytics, refreshAnalytics } from "../storyReadingAnalytics";

describe("generateStoryAnalytics", () => {
  it("returns the expected analytics shape", () => {
    const result = generateStoryAnalytics("A short story.");
    expect(result).toHaveProperty("totalViews");
    expect(result).toHaveProperty("averageReadingTime");
    expect(result).toHaveProperty("completionRate");
    expect(result).toHaveProperty("likes");
    expect(result).toHaveProperty("bookmarks");
    expect(result).toHaveProperty("shares");
    expect(result).toHaveProperty("engagementTrend");
  });

  it("computes average reading time from word count", () => {
    const result = generateStoryAnalytics("word ".repeat(400));
    expect(result.averageReadingTime).toBe(2);
  });

  it("returns a positive reading time for short text", () => {
    const result = generateStoryAnalytics("A tiny story.");
    expect(result.averageReadingTime).toBeGreaterThanOrEqual(1);
  });

  it("returns an engagement trend array", () => {
    const result = generateStoryAnalytics("A story.");
    expect(Array.isArray(result.engagementTrend)).toBe(true);
    expect(result.engagementTrend.length).toBeGreaterThan(0);
  });

  it("returns non-negative view and like counts", () => {
    const result = generateStoryAnalytics("A story.");
    expect(result.totalViews).toBeGreaterThanOrEqual(0);
    expect(result.likes).toBeGreaterThanOrEqual(0);
  });

  it("refreshAnalytics returns the same result", () => {
    const story = "A story about a journey.";
    expect(refreshAnalytics(story)).toEqual(generateStoryAnalytics(story));
  });
});
