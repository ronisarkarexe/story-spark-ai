import { describe, it, expect } from "vitest";
import { calculateWritingMilestones } from "../writingMilestone";

describe("calculateWritingMilestones", () => {
  it("counts words in the story", () => {
    const result = calculateWritingMilestones("one two three four", 2);
    expect(result.totalWords).toBe(4);
  });

  it("computes completion percentage against the 5000-word target", () => {
    const result = calculateWritingMilestones("word ".repeat(2500), 1);
    expect(result.completionPercentage).toBe(50);
  });

  it("caps completion percentage at 100", () => {
    const result = calculateWritingMilestones("word ".repeat(6000), 1);
    expect(result.completionPercentage).toBe(100);
  });

  it("returns total chapters as at least 10", () => {
    const result = calculateWritingMilestones("a story", 3);
    expect(result.totalChapters).toBe(10);
  });

  it("returns the completed chapter count", () => {
    const result = calculateWritingMilestones("a story", 4);
    expect(result.completedChapters).toBe(4);
  });

  it("computes editing progress within 0-100", () => {
    const result = calculateWritingMilestones("a story with some words here", 5);
    expect(result.editingProgress).toBeGreaterThanOrEqual(0);
    expect(result.editingProgress).toBeLessThanOrEqual(100);
  });
});
