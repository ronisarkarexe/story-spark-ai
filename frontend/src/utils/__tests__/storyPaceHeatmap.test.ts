import { describe, it, expect } from "vitest";
import { analyzeStoryPace } from "../storyPaceHeatmap";

describe("analyzeStoryPace - computed pacing", () => {
  it("returns [] for empty/whitespace input", () => {
    expect(analyzeStoryPace("")).toEqual([]);
    expect(analyzeStoryPace("   \n  ")).toEqual([]);
  });

  it("derives score from section density, not a fixed cycle", () => {
    const story = "one two three four five six seven eight nine ten.\n\na.";
    const r = analyzeStoryPace(story);
    expect(r).toHaveLength(2);
    // Scores must be finite numbers within range.
    for (const s of r) {
      expect(Number.isFinite(s.score)).toBe(true);
      expect(s.score).toBeGreaterThanOrEqual(30);
      expect(s.score).toBeLessThanOrEqual(95);
      expect(["Fast", "Balanced", "Slow"]).toContain(s.pace);
    }
    // The first (long-sentence) section scores higher than the second (1 word).
    expect(r[0].score).toBeGreaterThan(r[1].score);
  });

  it("no longer cycles Fast/Balanced/Slow by index", () => {
    // Three identical-length sections previously produced Fast/Balanced/Slow
    // purely by position. They should now all share the same pace/score.
    const para = "one two three four five six seven eight nine ten.";
    const story = [para, para, para].join("\n\n");
    const r = analyzeStoryPace(story);
    expect(r).toHaveLength(3);
    const paces = r.map((s) => s.pace);
    const scores = r.map((s) => s.score);
    expect(new Set(paces).size).toBe(1);
    expect(new Set(scores).size).toBe(1);
  });

  it("long-sentence sections are classified as Fast", () => {
    const long = ("word ".repeat(25).trim()) + ".";
    const r = analyzeStoryPace(long);
    expect(r[0].pace).toBe("Fast");
  });
});
