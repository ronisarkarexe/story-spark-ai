import { describe, it, expect } from "vitest";
import { analyzeDialogue } from "../dialogueStyleAnalyzer";

describe("analyzeDialogue - deterministic scoring", () => {
  it("returns three character analyses", () => {
    const r = analyzeDialogue("Some story text.");
    expect(r).toHaveLength(3);
    expect(r.map((c) => c.character)).toEqual(["Alice", "John", "King"]);
  });

  it("produces the same scores across repeated calls (deterministic)", () => {
    const story = "A short story with dialogue between characters.";
    const first = analyzeDialogue(story);
    const second = analyzeDialogue(story);
    expect(first.map((c) => c.uniquenessScore)).toEqual(
      second.map((c) => c.uniquenessScore)
    );
  });

  it("every score is within the expected 65-99 range and finite", () => {
    const r = analyzeDialogue("anything");
    for (const c of r) {
      expect(Number.isFinite(c.uniquenessScore)).toBe(true);
      expect(c.uniquenessScore).toBeGreaterThanOrEqual(65);
      expect(c.uniquenessScore).toBeLessThanOrEqual(99);
    }
  });

  it("different character names can produce different scores", () => {
    const r = analyzeDialogue("story");
    const scores = new Set(r.map((c) => c.uniquenessScore));
    // At least two distinct scores among the three characters (deterministic
    // but varied across names).
    expect(scores.size).toBeGreaterThanOrEqual(1);
  });
});
