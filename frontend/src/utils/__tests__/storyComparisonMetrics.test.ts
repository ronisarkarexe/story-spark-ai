import { describe, it, expect } from "vitest";
import { calculateStoryMetrics, compareStories } from "../storyComparisonMetrics";

describe("calculateStoryMetrics - dialogue quote pairs", () => {
  it("counts paired quotes as dialogue lines, not every quote char", () => {
    // Two dialogue lines = two pairs of quotes.
    const story = `He said, "hello there". She replied, "goodbye now".`;
    const metrics = calculateStoryMetrics(story);
    // Each pair contributes 5%, capped at 100. Two pairs => 10%.
    expect(metrics.dialoguePercentage).toBe(10);
  });

  it("handles a single unmatched quote without inflating dialogue", () => {
    const story = `An odd number of quotes like " this one`;
    const metrics = calculateStoryMetrics(story);
    // One quote char => 0 pairs => 0%.
    expect(metrics.dialoguePercentage).toBe(0);
  });

  it("caps dialoguePercentage at 100", () => {
    // 30 pairs => 150%, capped to 100.
    const pairs = `"a" `.repeat(30);
    const metrics = calculateStoryMetrics(pairs);
    expect(metrics.dialoguePercentage).toBe(100);
  });

  it("returns zero dialogue percentage for text with no quotes", () => {
    const metrics = calculateStoryMetrics("A story with no dialogue at all.");
    expect(metrics.dialoguePercentage).toBe(0);
  });
});

describe("compareStories", () => {
  it("returns metrics for both stories", () => {
    const r = compareStories("one two three", "four five six");
    expect(r.first.wordCount).toBe(3);
    expect(r.second.wordCount).toBe(3);
  });
});
