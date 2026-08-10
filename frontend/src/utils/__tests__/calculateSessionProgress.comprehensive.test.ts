import { describe, it, expect } from "vitest";
import { calculateSessionProgress } from "../storyWritingSessionGoalsTracker";

describe("calculateSessionProgress - comprehensive", () => {
  it("counts current words from the story", () => {
    const r = calculateSessionProgress("one two three four", {
      targetWords: 100,
      targetMinutes: 60,
      targetChapters: 5,
    }, Date.now());
    expect(r.currentWords).toBe(4);
  });

  it("counts chapters via blank-line paragraph splits", () => {
    const r = calculateSessionProgress("a\n\nb\n\nc", {
      targetWords: 100,
      targetMinutes: 60,
      targetChapters: 5,
    }, Date.now());
    expect(r.completedChapters).toBe(3);
  });

  it("wordProgress is the percentage of targetWords capped at 100", () => {
    const half = calculateSessionProgress("a b c d d", {
      targetWords: 10,
      targetMinutes: 60,
      targetChapters: 5,
    }, Date.now());
    // 5 words / 10 target = 50%
    expect(half.wordProgress).toBe(50);

    const over = calculateSessionProgress("a ".repeat(200).trim(), {
      targetWords: 10,
      targetMinutes: 100000,
      targetChapters: 5,
    }, Date.now());
    expect(over.wordProgress).toBe(100);
  });

  it("caps wordProgress at 100 when target is exceeded", () => {
    const r = calculateSessionProgress("w ".repeat(50).trim(), {
      targetWords: 2,
      targetMinutes: 100000,
      targetChapters: 1,
    }, Date.now());
    expect(r.wordProgress).toBe(100);
    expect(r.chapterProgress).toBe(100);
  });

  it("milestone reflects wordProgress thresholds", () => {
    const zero = calculateSessionProgress("a", {
      targetWords: 100,
      targetMinutes: 60,
      targetChapters: 5,
    }, Date.now());
    expect(zero.milestone).toBe("Keep Writing!");

    const half = calculateSessionProgress("a ".repeat(50).trim(), {
      targetWords: 100,
      targetMinutes: 60,
      targetChapters: 5,
    }, Date.now());
    expect(half.wordProgress).toBeGreaterThanOrEqual(50);
    expect(["💪 Halfway Done!", "🔥 Almost There!", "🎉 Word Goal Completed!"])
      .toContain(half.milestone);

    const done = calculateSessionProgress("a ".repeat(100).trim(), {
      targetWords: 100,
      targetMinutes: 60,
      targetChapters: 5,
    }, Date.now());
    expect(done.wordProgress).toBe(100);
    expect(done.milestone).toBe("🎉 Word Goal Completed!");
  });

  it("returns finite word/chapter progress for positive targets", () => {
    const r = calculateSessionProgress("one two three", {
      targetWords: 10,
      targetMinutes: 60,
      targetChapters: 5,
    }, Date.now());
    expect(Number.isFinite(r.wordProgress)).toBe(true);
    expect(Number.isFinite(r.chapterProgress)).toBe(true);
    expect(r.wordProgress).toBe(30);
    expect(r.chapterProgress).toBe(20);
  });
});
