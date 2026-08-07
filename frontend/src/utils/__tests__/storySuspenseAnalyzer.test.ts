import { describe, it, expect } from "vitest";
import {
  analyzeStorySuspense,
  refreshSuspenseAnalysis,
} from "../storySuspenseAnalyzer";

describe("analyzeStorySuspense", () => {
  it("returns zeroed analysis for empty text", () => {
    const result = analyzeStorySuspense("");
    expect(result.overallScore).toBe(0);
    expect(result.sections).toEqual([]);
  });

  it("returns an overall score and sections for a non-empty story", () => {
    const result = analyzeStorySuspense("The secret unfolded slowly.");
    expect(typeof result.overallScore).toBe("number");
    expect(result.sections.length).toBeGreaterThan(0);
  });

  it("returns sections with the expected shape", () => {
    const result = analyzeStorySuspense("A tense confrontation begins.");
    const section = result.sections[0];
    expect(section).toHaveProperty("id");
    expect(section).toHaveProperty("title");
    expect(section).toHaveProperty("tensionScore");
    expect(section).toHaveProperty("status");
    expect(section).toHaveProperty("observation");
    expect(section).toHaveProperty("suggestion");
  });

  it("classifies status as High, Medium, or Low", () => {
    const result = analyzeStorySuspense("A mysterious figure approached.");
    const valid = ["High", "Medium", "Low"];
    for (const section of result.sections) {
      expect(valid).toContain(section.status);
    }
  });

  it("keeps tension scores within 0-100", () => {
    const result = analyzeStorySuspense("The clock ticked down.");
    for (const section of result.sections) {
      expect(section.tensionScore).toBeGreaterThanOrEqual(0);
      expect(section.tensionScore).toBeLessThanOrEqual(100);
    }
  });

  it("refreshSuspenseAnalysis returns the same result", () => {
    const story = "A shadow moved in the dark.";
    expect(refreshSuspenseAnalysis(story)).toEqual(analyzeStorySuspense(story));
  });
});
