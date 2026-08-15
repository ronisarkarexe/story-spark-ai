import { describe, it, expect } from "vitest";
import { calculateWritingMilestones } from "../writingMilestone";

describe("calculateWritingMilestones", () => {
  it("counts total words from the story", () => {
    const r = calculateWritingMilestones("one two three four", 2);
    expect(r.totalWords).toBe(4);
  });

  it("reports completedChapters equal to chapterCount", () => {
    const r = calculateWritingMilestones("some story", 7);
    expect(r.completedChapters).toBe(7);
  });

  it("totalChapters is at least 10 even when chapterCount is small", () => {
    expect(calculateWritingMilestones("x", 3).totalChapters).toBe(10);
    expect(calculateWritingMilestones("x", 25).totalChapters).toBe(25);
  });

  it("completionPercentage is words/5000 capped at 100", () => {
    // 250 words / 5000 = 5%
    const story = "w ".repeat(250).trim();
    expect(calculateWritingMilestones(story, 1).completionPercentage).toBe(5);

    // 10000 words → capped at 100
    const big = "w ".repeat(10000).trim();
    expect(calculateWritingMilestones(big, 1).completionPercentage).toBe(100);
  });

  it("editingProgress is derived from completionPercentage + chapterCount*5, capped at 100", () => {
    const r = calculateWritingMilestones("w ".repeat(250).trim(), 10);
    const expected = Math.min(Math.round((5 + 10 * 5) / 2), 100);
    expect(r.editingProgress).toBe(expected);
  });

  it("returns 0 completion for empty/whitespace-only stories", () => {
    expect(calculateWritingMilestones("", 0).totalWords).toBe(0);
    expect(calculateWritingMilestones("", 0).completionPercentage).toBe(0);
    expect(calculateWritingMilestones("   \n  ", 0).totalWords).toBe(0);
  });

  it("returns the full WritingMilestone shape", () => {
    const r = calculateWritingMilestones("a b c", 4);
    expect(r).toHaveProperty("totalWords");
    expect(r).toHaveProperty("completedChapters");
    expect(r).toHaveProperty("totalChapters");
    expect(r).toHaveProperty("completionPercentage");
    expect(r).toHaveProperty("editingProgress");
  });
});
