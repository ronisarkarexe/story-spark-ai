import { describe, it, expect } from "vitest";
import {
  analyzePacing,
  getOverallRating,
  refreshAnalysis,
} from "../pacingAnalyzer";

describe("pacingAnalyzer", () => {
  describe("getOverallRating", () => {
    it("returns 'Excellent' for score >= 80", () => {
      expect(getOverallRating(80)).toBe("Excellent");
      expect(getOverallRating(100)).toBe("Excellent");
      expect(getOverallRating(95)).toBe("Excellent");
    });

    it("returns 'Good' for score >= 60 and < 80", () => {
      expect(getOverallRating(60)).toBe("Good");
      expect(getOverallRating(70)).toBe("Good");
      expect(getOverallRating(79)).toBe("Good");
    });

    it("returns 'Average' for score >= 40 and < 60", () => {
      expect(getOverallRating(40)).toBe("Average");
      expect(getOverallRating(50)).toBe("Average");
      expect(getOverallRating(59)).toBe("Average");
    });

    it("returns 'Needs Improvement' for score < 40", () => {
      expect(getOverallRating(39)).toBe("Needs Improvement");
      expect(getOverallRating(0)).toBe("Needs Improvement");
      expect(getOverallRating(-10)).toBe("Needs Improvement");
    });

    it("handles boundary values correctly", () => {
      expect(getOverallRating(79.99)).toBe("Good");
      expect(getOverallRating(59.99)).toBe("Average");
      expect(getOverallRating(39.99)).toBe("Needs Improvement");
    });
  });

  describe("analyzePacing", () => {
    it("returns an object with issues array and overallScore number", () => {
      const result = analyzePacing("any story text");
      expect(result).toHaveProperty("issues");
      expect(result).toHaveProperty("overallScore");
      expect(Array.isArray(result.issues)).toBe(true);
      expect(typeof result.overallScore).toBe("number");
    });

    it("returns overallScore within valid range 0-100", () => {
      const result = analyzePacing("test story");
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
    });

    it("accepts empty string input", () => {
      const result = analyzePacing("");
      expect(result).toHaveProperty("issues");
      expect(result).toHaveProperty("overallScore");
    });

    it("accepts very long story input", () => {
      const longStory = "word ".repeat(10000);
      const result = analyzePacing(longStory);
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
    });
  });

  describe("refreshAnalysis", () => {
    it("returns the same shape as analyzePacing", () => {
      const input = "A test story for refresh.";
      const result = refreshAnalysis(input);

      expect(result).toHaveProperty("issues");
      expect(result).toHaveProperty("overallScore");
      expect(Array.isArray(result.issues)).toBe(true);
      expect(typeof result.overallScore).toBe("number");
    });

    it("calls analyzePacing and returns its result", () => {
      const input = "Sample story content";
      const refreshed = refreshAnalysis(input);
      const direct = analyzePacing(input);
      expect(refreshed.overallScore).toBe(direct.overallScore);
    });
  });
});
