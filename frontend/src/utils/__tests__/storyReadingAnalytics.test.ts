import { describe, it, expect } from "vitest";
import { generateStoryAnalytics, refreshAnalytics } from "../storyReadingAnalytics";

describe("generateStoryAnalytics - zero-length input guard", () => {
  it("returns zeroed metrics for an empty string", () => {
    const r = generateStoryAnalytics("");
    expect(r.totalViews).toBe(0);
    expect(r.averageReadingTime).toBe(0);
    expect(r.completionRate).toBe(0);
    expect(r.likes).toBe(0);
    expect(r.bookmarks).toBe(0);
    expect(r.shares).toBe(0);
    expect(r.engagementTrend).toEqual([]);
  });

  it("returns zeroed metrics for a whitespace-only string", () => {
    const r = generateStoryAnalytics("    \n\t  ");
    expect(r.averageReadingTime).toBe(0);
    expect(r.totalViews).toBe(0);
    expect(r.engagementTrend).toEqual([]);
  });

  it("returns normal analytics for non-empty input", () => {
    const r = generateStoryAnalytics("one two three four");
    expect(r.totalViews).toBe(1248);
    expect(r.averageReadingTime).toBeGreaterThanOrEqual(1);
    expect(r.engagementTrend.length).toBeGreaterThan(0);
  });

  it("averageReadingTime grows with word count for non-empty input", () => {
    const short = generateStoryAnalytics("a b c d");
    const long = generateStoryAnalytics("w ".repeat(500).trim());
    expect(long.averageReadingTime).toBeGreaterThan(short.averageReadingTime);
  });

  it("refreshAnalytics delegates to generateStoryAnalytics", () => {
    expect(refreshAnalytics("")).toEqual(generateStoryAnalytics(""));
  });
});
