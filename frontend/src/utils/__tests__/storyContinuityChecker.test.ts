import { describe, it, expect } from "vitest";
import {
  analyzeStoryContinuity,
  refreshContinuityAnalysis,
} from "../storyContinuityChecker";

describe("analyzeStoryContinuity", () => {
  it("returns zeroed analysis for empty text", () => {
    const result = analyzeStoryContinuity("");
    expect(result.overallScore).toBe(0);
    expect(result.issues).toEqual([]);
  });

  it("returns an overall score and issues for a non-empty story", () => {
    const result = analyzeStoryContinuity("The protagonist traveled through the kingdom.");
    expect(typeof result.overallScore).toBe("number");
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it("returns issues with the expected shape", () => {
    const result = analyzeStoryContinuity("A mysterious figure watched from the shadows.");
    const issue = result.issues[0];
    expect(issue).toHaveProperty("id");
    expect(issue).toHaveProperty("category");
    expect(issue).toHaveProperty("severity");
    expect(issue).toHaveProperty("issue");
    expect(issue).toHaveProperty("suggestion");
  });

  it("classifies severity as Low, Medium, or High", () => {
    const result = analyzeStoryContinuity("The timeline shifted unexpectedly.");
    const valid = ["Low", "Medium", "High"];
    for (const issue of result.issues) {
      expect(valid).toContain(issue.severity);
    }
  });

  it("keeps the overall score within 0-100", () => {
    const result = analyzeStoryContinuity("The hero remembered the old promise.");
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it("refreshContinuityAnalysis returns the same result", () => {
    const story = "The castle gates opened at dawn.";
    expect(refreshContinuityAnalysis(story)).toEqual(analyzeStoryContinuity(story));
  });
});
