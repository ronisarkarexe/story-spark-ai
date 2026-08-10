import { describe, it, expect } from "vitest";
import { calculateSessionProgress } from "../storyWritingSessionGoalsTracker";

const now = Date.now();

describe("calculateSessionProgress - zero/NaN division guards", () => {
  it("returns 0 progress (no NaN/Infinity) when targets are zero", () => {
    const r = calculateSessionProgress("one two three", {
      targetWords: 0,
      targetMinutes: 0,
      targetChapters: 0,
    }, now);
    expect(Number.isFinite(r.wordProgress)).toBe(true);
    expect(Number.isFinite(r.timeProgress)).toBe(true);
    expect(Number.isFinite(r.chapterProgress)).toBe(true);
    expect(r.wordProgress).toBe(0);
    expect(r.timeProgress).toBe(0);
    expect(r.chapterProgress).toBe(0);
  });

  it("returns 0 progress when targets are NaN", () => {
    const r = calculateSessionProgress("one two three", {
      targetWords: Number.NaN,
      targetMinutes: Number.NaN,
      targetChapters: Number.NaN,
    }, now);
    expect(Number.isFinite(r.wordProgress)).toBe(true);
    expect(Number.isFinite(r.timeProgress)).toBe(true);
    expect(Number.isFinite(r.chapterProgress)).toBe(true);
    expect(r.wordProgress).toBe(0);
    expect(r.timeProgress).toBe(0);
    expect(r.chapterProgress).toBe(0);
  });

  it("caps progress at 100 when target is exceeded", () => {
    const r = calculateSessionProgress("one two three four five", {
      targetWords: 2,
      targetMinutes: 100000,
      targetChapters: 1,
    }, now);
    expect(r.wordProgress).toBe(100);
    expect(r.chapterProgress).toBe(100);
    // time progress is small relative to a huge target.
    expect(r.timeProgress).toBeLessThanOrEqual(100);
  });

  it("counts current words and chapters correctly", () => {
    const r = calculateSessionProgress("one two\n\nthree four", {
      targetWords: 10,
      targetMinutes: 60,
      targetChapters: 5,
    }, now);
    expect(r.currentWords).toBe(4);
    expect(r.completedChapters).toBe(2);
  });
});
