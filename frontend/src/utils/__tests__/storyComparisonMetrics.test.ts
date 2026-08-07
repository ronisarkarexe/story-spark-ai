import { describe, it, expect } from "vitest";
import { calculateStoryMetrics, compareStories } from "../storyComparisonMetrics";

describe("calculateStoryMetrics", () => {
  it("counts words in the story", () => {
    const result = calculateStoryMetrics("The hero and the dragon fought.");
    expect(result.wordCount).toBe(6);
  });

  it("computes reading time as ceil(words / 200)", () => {
    const result = calculateStoryMetrics("word ".repeat(400));
    expect(result.readingTime).toBe(2);
  });

  it("computes vocabulary richness from unique words", () => {
    const result = calculateStoryMetrics("cat dog bird");
    expect(result.vocabularyRichness).toBe(100);
  });

  it("computes dialogue percentage from quote pairs", () => {
    const result = calculateStoryMetrics('"Hello," she said.');
    expect(result.dialoguePercentage).toBeGreaterThan(0);
  });

  it("caps dialogue percentage at 100", () => {
    const result = calculateStoryMetrics('"'.repeat(100));
    expect(result.dialoguePercentage).toBeLessThanOrEqual(100);
  });

  it("assigns pacing by word count tiers", () => {
    const long = calculateStoryMetrics("word ".repeat(900));
    const medium = calculateStoryMetrics("word ".repeat(500));
    const short = calculateStoryMetrics("a short story here");
    expect(long.pacing).toBe(90);
    expect(medium.pacing).toBe(75);
    expect(short.pacing).toBe(60);
  });

  it("returns the expected metric fields", () => {
    const result = calculateStoryMetrics("A story.");
    expect(result).toHaveProperty("wordCount");
    expect(result).toHaveProperty("readingTime");
    expect(result).toHaveProperty("vocabularyRichness");
    expect(result).toHaveProperty("dialoguePercentage");
    expect(result).toHaveProperty("pacing");
    expect(result).toHaveProperty("sentiment");
  });
});

describe("compareStories", () => {
  it("returns metrics for both stories", () => {
    const result = compareStories("First story.", "Second story.");
    expect(result.first).toHaveProperty("wordCount");
    expect(result.second).toHaveProperty("wordCount");
  });

  it("compares different word counts", () => {
    const result = compareStories("short", "long ".repeat(50));
    expect(result.second.wordCount).toBeGreaterThan(result.first.wordCount);
  });
});
