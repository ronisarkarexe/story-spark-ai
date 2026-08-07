import { describe, it, expect } from "vitest";
import { calculateSessionProgress } from "../storyWritingSessionGoalsTracker";

describe("calculateSessionProgress", () => {
  const goals = { targetWords: 1000, targetMinutes: 60, targetChapters: 5 };
  const startTime = Date.now();

  it("returns the expected progress shape", () => {
    const result = calculateSessionProgress("a story", goals, startTime);
    expect(result).toHaveProperty("currentWords");
    expect(result).toHaveProperty("currentMinutes");
    expect(result).toHaveProperty("completedChapters");
    expect(result).toHaveProperty("wordProgress");
    expect(result).toHaveProperty("timeProgress");
    expect(result).toHaveProperty("chapterProgress");
    expect(result).toHaveProperty("milestone");
  });

  it("counts the current word count", () => {
    const result = calculateSessionProgress("one two three", goals, startTime);
    expect(result.currentWords).toBe(3);
  });

  it("computes word progress as a capped percentage", () => {
    const result = calculateSessionProgress("word ".repeat(500), goals, startTime);
    expect(result.wordProgress).toBe(50);
  });

  it("caps progress percentages at 100", () => {
    const result = calculateSessionProgress("word ".repeat(2000), goals, startTime);
    expect(result.wordProgress).toBe(100);
    expect(result.timeProgress).toBeLessThanOrEqual(100);
    expect(result.chapterProgress).toBeLessThanOrEqual(100);
  });

  it("counts chapters by double-newline separation", () => {
    const result = calculateSessionProgress("One.\n\nTwo.\n\nThree.", goals, startTime);
    expect(result.completedChapters).toBe(3);
  });

  it("returns a milestone string", () => {
    const result = calculateSessionProgress("a story", goals, startTime);
    expect(result.milestone.length).toBeGreaterThan(0);
  });

  it("returns the word-completed milestone at 100 percent", () => {
    const result = calculateSessionProgress("word ".repeat(1000), goals, startTime);
    expect(result.milestone).toContain("Word Goal Completed");
  });
});
