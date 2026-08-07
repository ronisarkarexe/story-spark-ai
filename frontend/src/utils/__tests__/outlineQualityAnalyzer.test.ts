import { describe, it, expect } from "vitest";
import {
  analyzeOutline,
  refreshAnalysis,
  getQualityRating,
} from "../outlineQualityAnalyzer";

describe("analyzeOutline", () => {
  it("returns an analysis with a score and issues array", () => {
    const result = analyzeOutline("An outline for a story.");
    expect(result).toHaveProperty("score");
    expect(Array.isArray(result.issues)).toBe(true);
  });

  it("keeps the score within 0-100", () => {
    const result = analyzeOutline("An outline.");
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("refreshAnalysis returns the same result", () => {
    const outline = "An outline.";
    expect(refreshAnalysis(outline)).toEqual(analyzeOutline(outline));
  });
});

describe("getQualityRating", () => {
  it("returns Excellent for scores at or above 90", () => {
    expect(getQualityRating(90)).toBe("Excellent");
    expect(getQualityRating(100)).toBe("Excellent");
  });

  it("returns Good for scores from 75 to 89", () => {
    expect(getQualityRating(75)).toBe("Good");
    expect(getQualityRating(89)).toBe("Good");
  });

  it("returns Average for scores from 60 to 74", () => {
    expect(getQualityRating(60)).toBe("Average");
    expect(getQualityRating(74)).toBe("Average");
  });

  it("returns Needs Improvement for scores below 60", () => {
    expect(getQualityRating(59)).toBe("Needs Improvement");
    expect(getQualityRating(0)).toBe("Needs Improvement");
  });
});
