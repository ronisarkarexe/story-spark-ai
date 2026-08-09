// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import {
  analyzePacing,
  getOverallRating,
  refreshAnalysis,
} from "./pacingAnalyzer";

describe("pacingAnalyzer", () => {
  describe("getOverallRating", () => {
    it('returns "Excellent" for score >= 80', () => {
      expect(getOverallRating(80)).toBe("Excellent");
      expect(getOverallRating(100)).toBe("Excellent");
    });

    it('returns "Good" for score >= 60 and < 80', () => {
      expect(getOverallRating(60)).toBe("Good");
      expect(getOverallRating(79)).toBe("Good");
    });

    it('returns "Average" for score >= 40 and < 60', () => {
      expect(getOverallRating(40)).toBe("Average");
      expect(getOverallRating(59)).toBe("Average");
    });

    it('returns "Needs Improvement" for score < 40', () => {
      expect(getOverallRating(39)).toBe("Needs Improvement");
      expect(getOverallRating(0)).toBe("Needs Improvement");
    });
  });

  describe("analyzePacing", () => {
    it("returns an object with issues array and overallScore", () => {
      const result = analyzePacing("some story content");
      expect(result).toHaveProperty("issues");
      expect(result).toHaveProperty("overallScore");
      expect(Array.isArray(result.issues)).toBe(true);
      expect(typeof result.overallScore).toBe("number");
    });

    it("accepts empty string input", () => {
      const result = analyzePacing("");
      expect(result).toHaveProperty("issues");
      expect(result).toHaveProperty("overallScore");
    });
  });

  describe("refreshAnalysis", () => {
    it("returns same shape as analyzePacing", () => {
      const result = refreshAnalysis("story text");
      expect(result).toHaveProperty("issues");
      expect(result).toHaveProperty("overallScore");
    });
  });
});
