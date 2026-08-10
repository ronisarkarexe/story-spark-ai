import { describe, it, expect } from "vitest";
import {
  evaluateOpeningHook,
  regenerateOpeningEvaluation,
} from "../storyOpeningHookEvaluator";

describe("evaluateOpeningHook", () => {
  it("returns a zeroed report for empty/whitespace input", () => {
    const expected = {
      engagement: 0,
      curiosity: 0,
      clarity: 0,
      emotionalImpact: 0,
      overallScore: 0,
      strengths: [],
      weaknesses: [],
      suggestedOpening: "",
    };
    expect(evaluateOpeningHook("")).toEqual(expected);
    expect(evaluateOpeningHook("   \n  ")).toEqual(expected);
  });

  it("returns a full report with all fields for non-empty input", () => {
    const r = evaluateOpeningHook("It was a dark and stormy night.");
    expect(r).toHaveProperty("engagement");
    expect(r).toHaveProperty("curiosity");
    expect(r).toHaveProperty("clarity");
    expect(r).toHaveProperty("emotionalImpact");
    expect(r).toHaveProperty("overallScore");
    expect(r).toHaveProperty("strengths");
    expect(r).toHaveProperty("weaknesses");
    expect(r).toHaveProperty("suggestedOpening");
  });

  it("scores are finite numbers within 0-100 for non-empty input", () => {
    const r = evaluateOpeningHook("An opening line with tension.");
    for (const s of [r.engagement, r.curiosity, r.clarity, r.emotionalImpact, r.overallScore]) {
      expect(Number.isFinite(s)).toBe(true);
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(100);
    }
  });

  it("strengths and weaknesses are arrays of non-empty strings", () => {
    const r = evaluateOpeningHook("A story opening here.");
    expect(Array.isArray(r.strengths)).toBe(true);
    expect(Array.isArray(r.weaknesses)).toBe(true);
    for (const s of r.strengths) {
      expect(typeof s).toBe("string");
      expect(s.length).toBeGreaterThan(0);
    }
    for (const w of r.weaknesses) {
      expect(typeof w).toBe("string");
      expect(w.length).toBeGreaterThan(0);
    }
  });

  it("suggestedOpening is a non-empty string for non-empty input", () => {
    const r = evaluateOpeningHook("Some opening text.");
    expect(typeof r.suggestedOpening).toBe("string");
    expect(r.suggestedOpening.length).toBeGreaterThan(0);
  });

  it("is deterministic for the same input", () => {
    const story = "A consistent opening for determinism checks.";
    expect(evaluateOpeningHook(story)).toEqual(evaluateOpeningHook(story));
  });
});

describe("regenerateOpeningEvaluation", () => {
  it("delegates to evaluateOpeningHook", () => {
    const story = "A story to regenerate the opening evaluation for.";
    expect(regenerateOpeningEvaluation(story)).toEqual(evaluateOpeningHook(story));
  });

  it("returns a zeroed report for empty input", () => {
    expect(regenerateOpeningEvaluation("")).toEqual(evaluateOpeningHook(""));
  });
});
