import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useNarrativeComplexity from "../useNarrativeComplexity";

describe("useNarrativeComplexity", () => {
  it("returns an array of complexity metrics", () => {
    const { result } = renderHook(() => useNarrativeComplexity());
    expect(Array.isArray(result.current.metrics)).toBe(true);
    expect(result.current.metrics.length).toBeGreaterThan(0);
  });

  it("each metric has required fields", () => {
    const { result } = renderHook(() => useNarrativeComplexity());
    for (const metric of result.current.metrics) {
      expect(typeof metric.title).toBe("string");
      expect(typeof metric.score).toBe("number");
      expect(typeof metric.description).toBe("string");
    }
  });

  it("metrics include expected titles", () => {
    const { result } = renderHook(() => useNarrativeComplexity());
    const titles = result.current.metrics.map((m) => m.title);
    expect(titles).toContain("Subplots");
    expect(titles).toContain("Character Interactions");
    expect(titles).toContain("Timeline Depth");
    expect(titles).toContain("World Building");
    expect(titles).toContain("Vocabulary Diversity");
  });

  it("average is a rounded number", () => {
    const { result } = renderHook(() => useNarrativeComplexity());
    expect(typeof result.current.average).toBe("number");
    expect(Number.isInteger(result.current.average)).toBe(true);
  });

  it("average is computed as sum of scores divided by count", () => {
    const { result } = renderHook(() => useNarrativeComplexity());
    const expectedAvg = Math.round(
      result.current.metrics.reduce((sum, m) => sum + m.score, 0) /
        result.current.metrics.length
    );
    expect(result.current.average).toBe(expectedAvg);
  });

  it("recommendation is a non-empty string", () => {
    const { result } = renderHook(() => useNarrativeComplexity());
    expect(typeof result.current.recommendation).toBe("string");
    expect(result.current.recommendation.length).toBeGreaterThan(0);
  });

  it("recommendation matches threshold for high average (>=80)", () => {
    const highScore = 82;
    const { getRecommendation } = require("../../utils/narrativeComplexity");
    const rec = getRecommendation(highScore);
    expect(rec).toBe("Story complexity is excellent. Maintain consistency.");
  });

  it("recommendation matches threshold for mid average (>=60, <80)", () => {
    const { getRecommendation } = require("../../utils/narrativeComplexity");
    const rec = getRecommendation(65);
    expect(rec).toBe("Balanced complexity. Add depth only where needed.");
  });

  it("recommendation matches threshold for low average (<60)", () => {
    const { getRecommendation } = require("../../utils/narrativeComplexity");
    const rec = getRecommendation(50);
    expect(rec).toBe("Consider enriching plot and character development.");
  });
});
