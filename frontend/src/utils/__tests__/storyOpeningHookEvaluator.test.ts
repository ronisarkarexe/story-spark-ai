import { describe, it, expect } from "vitest";
import {
  evaluateOpeningHook,
  regenerateOpeningEvaluation,
} from "../storyOpeningHookEvaluator";

describe("evaluateOpeningHook", () => {
  it("returns a zeroed report for empty text", () => {
    const result = evaluateOpeningHook("");
    expect(result.overallScore).toBe(0);
    expect(result.engagement).toBe(0);
    expect(result.strengths).toEqual([]);
    expect(result.weaknesses).toEqual([]);
  });

  it("returns a report for a non-empty story", () => {
    const result = evaluateOpeningHook("The last light disappeared behind the mountains.");
    expect(typeof result.overallScore).toBe("number");
    expect(typeof result.engagement).toBe("number");
  });

  it("returns the expected report shape", () => {
    const result = evaluateOpeningHook("A letter changed everything.");
    expect(result).toHaveProperty("engagement");
    expect(result).toHaveProperty("curiosity");
    expect(result).toHaveProperty("clarity");
    expect(result).toHaveProperty("emotionalImpact");
    expect(result).toHaveProperty("overallScore");
    expect(result).toHaveProperty("strengths");
    expect(result).toHaveProperty("weaknesses");
    expect(result).toHaveProperty("suggestedOpening");
  });

  it("keeps scores within 0-100", () => {
    const result = evaluateOpeningHook("The old house creaked in the wind.");
    expect(result.engagement).toBeGreaterThanOrEqual(0);
    expect(result.engagement).toBeLessThanOrEqual(100);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it("returns a non-empty suggested opening for a real story", () => {
    const result = evaluateOpeningHook("The storm was coming.");
    expect(result.suggestedOpening.length).toBeGreaterThan(0);
  });

  it("regenerateOpeningEvaluation returns the same result", () => {
    const story = "The letter in her hands could change everything.";
    expect(regenerateOpeningEvaluation(story)).toEqual(evaluateOpeningHook(story));
  });
});
