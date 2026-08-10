import { describe, it, expect } from "vitest";
import { analyzeStorySuspense } from "../storySuspenseAnalyzer";

describe("analyzeStorySuspense - derived scores", () => {
  it("returns a zeroed report for empty/whitespace input", () => {
    expect(analyzeStorySuspense("")).toEqual({ overallScore: 0, sections: [] });
    expect(analyzeStorySuspense("   \n  ")).toEqual({ overallScore: 0, sections: [] });
  });

  it("overallScore is the average of section tension scores, not a fixed 84", () => {
    const story = "A calm day.\n\nSuddenly danger appeared from the unknown shadow.";
    const r = analyzeStorySuspense(story);
    expect(r.sections.length).toBe(2);
    const avg =
      r.sections.reduce((s, x) => s + x.tensionScore, 0) / r.sections.length;
    expect(r.overallScore).toBe(Math.round(avg));
    // Must not be the old hardcoded value for a generic input.
    expect(r.overallScore).not.toBe(84);
  });

  it("sections with more suspense keywords get higher tension scores", () => {
    const calm = "A calm ordinary day with clear skies.";
    const tense = "Suddenly a shadow whispered a secret threat and panic.";
    const rCalm = analyzeStorySuspense(calm);
    const rTense = analyzeStorySuspense(tense);
    expect(rTense.sections[0].tensionScore).toBeGreaterThan(
      rCalm.sections[0].tensionScore
    );
  });

  it("every section has finite scores within 0-100 and a valid status", () => {
    const r = analyzeStorySuspense(
      "Normal text here.\n\nSuddenly danger and fear!\n\nThe end."
    );
    for (const s of r.sections) {
      expect(Number.isFinite(s.tensionScore)).toBe(true);
      expect(s.tensionScore).toBeGreaterThanOrEqual(0);
      expect(s.tensionScore).toBeLessThanOrEqual(100);
      expect(["High", "Medium", "Low"]).toContain(s.status);
    }
    expect(r.overallScore).toBeGreaterThanOrEqual(0);
    expect(r.overallScore).toBeLessThanOrEqual(100);
  });
});
