import { describe, it, expect } from "vitest";
import {
  analyzeStorySuspense,
  refreshSuspenseAnalysis,
} from "../storySuspenseAnalyzer";

const VALID_STATUSES = ["High", "Medium", "Low"] as const;

describe("analyzeStorySuspense", () => {
  it("returns a zeroed analysis for empty/whitespace input", () => {
    const expected = { overallScore: 0, sections: [] };
    expect(analyzeStorySuspense("")).toEqual(expected);
    expect(analyzeStorySuspense("   \n  ")).toEqual(expected);
  });

  it("returns an overall score and non-empty sections for non-empty input", () => {
    const r = analyzeStorySuspense("A tense opening scene.");
    expect(typeof r.overallScore).toBe("number");
    expect(r.sections.length).toBeGreaterThan(0);
  });

  it("overallScore is finite and within 0-100 for non-empty input", () => {
    const r = analyzeStorySuspense("A story with some suspense.");
    expect(Number.isFinite(r.overallScore)).toBe(true);
    expect(r.overallScore).toBeGreaterThanOrEqual(0);
    expect(r.overallScore).toBeLessThanOrEqual(100);
  });

  it("each section has the required fields", () => {
    const r = analyzeStorySuspense("A story to analyze.");
    for (const s of r.sections) {
      expect(typeof s.id).toBe("number");
      expect(typeof s.title).toBe("string");
      expect(s.title.length).toBeGreaterThan(0);
      expect(typeof s.tensionScore).toBe("number");
      expect(VALID_STATUSES).toContain(s.status);
      expect(typeof s.observation).toBe("string");
      expect(s.observation.length).toBeGreaterThan(0);
      expect(typeof s.suggestion).toBe("string");
      expect(s.suggestion.length).toBeGreaterThan(0);
    }
  });

  it("section ids are unique and sequential", () => {
    const r = analyzeStorySuspense("A story.");
    const ids = r.sections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([...Array(ids.length).keys()].map((i) => i + 1));
  });

  it("tensionScores are finite and within 0-100", () => {
    const r = analyzeStorySuspense("A story.");
    for (const s of r.sections) {
      expect(Number.isFinite(s.tensionScore)).toBe(true);
      expect(s.tensionScore).toBeGreaterThanOrEqual(0);
      expect(s.tensionScore).toBeLessThanOrEqual(100);
    }
  });

  it("is deterministic for the same input", () => {
    const story = "A deterministic suspenseful story.";
    expect(analyzeStorySuspense(story)).toEqual(analyzeStorySuspense(story));
  });
});

describe("refreshSuspenseAnalysis", () => {
  it("delegates to analyzeStorySuspense", () => {
    const story = "A story to refresh the suspense analysis for.";
    expect(refreshSuspenseAnalysis(story)).toEqual(analyzeStorySuspense(story));
  });

  it("returns a zeroed analysis for empty input", () => {
    expect(refreshSuspenseAnalysis("")).toEqual({ overallScore: 0, sections: [] });
  });
});
