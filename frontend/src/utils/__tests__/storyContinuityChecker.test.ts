import { describe, it, expect } from "vitest";
import {
  analyzeStoryContinuity,
  refreshContinuityAnalysis,
} from "../storyContinuityChecker";

const VALID_CATEGORIES = [
  "Character",
  "Timeline",
  "Location",
  "Object",
  "Story Logic",
] as const;
const VALID_SEVERITIES = ["Low", "Medium", "High"] as const;

describe("analyzeStoryContinuity", () => {
  it("returns a zeroed analysis for empty/whitespace input", () => {
    const expected = { overallScore: 0, issues: [] };
    expect(analyzeStoryContinuity("")).toEqual(expected);
    expect(analyzeStoryContinuity("   \n  ")).toEqual(expected);
  });

  it("returns an overallScore and non-empty issues for non-empty input", () => {
    const r = analyzeStoryContinuity("A story to check for continuity.");
    expect(typeof r.overallScore).toBe("number");
    expect(r.issues.length).toBeGreaterThan(0);
  });

  it("overallScore is finite and within 0-100 for non-empty input", () => {
    const r = analyzeStoryContinuity("A story.");
    expect(Number.isFinite(r.overallScore)).toBe(true);
    expect(r.overallScore).toBeGreaterThanOrEqual(0);
    expect(r.overallScore).toBeLessThanOrEqual(100);
  });

  it("each issue has the required fields with valid category/severity", () => {
    const r = analyzeStoryContinuity("A story.");
    for (const i of r.issues) {
      expect(typeof i.id).toBe("number");
      expect(VALID_CATEGORIES).toContain(i.category);
      expect(typeof i.section).toBe("string");
      expect(i.section.length).toBeGreaterThan(0);
      expect(VALID_SEVERITIES).toContain(i.severity);
      expect(typeof i.issue).toBe("string");
      expect(i.issue.length).toBeGreaterThan(0);
      expect(typeof i.suggestion).toBe("string");
      expect(i.suggestion.length).toBeGreaterThan(0);
    }
  });

  it("issue ids are unique and sequential", () => {
    const r = analyzeStoryContinuity("A story.");
    const ids = r.issues.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...Array(ids.length).keys()].map((i) => i + 1));
  });

  it("is deterministic for the same input", () => {
    const story = "A deterministic story.";
    expect(analyzeStoryContinuity(story)).toEqual(analyzeStoryContinuity(story));
  });
});

describe("refreshContinuityAnalysis", () => {
  it("delegates to analyzeStoryContinuity", () => {
    const story = "A story to refresh continuity for.";
    expect(refreshContinuityAnalysis(story)).toEqual(analyzeStoryContinuity(story));
  });

  it("returns the zeroed analysis for empty input", () => {
    expect(refreshContinuityAnalysis("")).toEqual({ overallScore: 0, issues: [] });
  });
});
