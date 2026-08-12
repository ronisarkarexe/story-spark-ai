import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useEndingSatisfaction from "../useEndingSatisfaction";

describe("useEndingSatisfaction", () => {
  it("returns an array of ending metrics", () => {
    const { result } = renderHook(() => useEndingSatisfaction());
    expect(Array.isArray(result.current.metrics)).toBe(true);
    expect(result.current.metrics.length).toBeGreaterThan(0);
  });

  it("each metric has required fields", () => {
    const { result } = renderHook(() => useEndingSatisfaction());
    for (const metric of result.current.metrics) {
      expect(typeof metric.title).toBe("string");
      expect(typeof metric.score).toBe("number");
      expect(typeof metric.description).toBe("string");
      expect(typeof metric.suggestion).toBe("string");
    }
  });

  it("metrics include expected titles", () => {
    const { result } = renderHook(() => useEndingSatisfaction());
    const titles = result.current.metrics.map((m) => m.title);
    expect(titles).toContain("Conflict Resolution");
    expect(titles).toContain("Character Arc");
    expect(titles).toContain("Emotional Payoff");
    expect(titles).toContain("Pacing");
  });

  it("overallScore is a rounded number", () => {
    const { result } = renderHook(() => useEndingSatisfaction());
    expect(typeof result.current.overallScore).toBe("number");
    expect(Number.isInteger(result.current.overallScore)).toBe(true);
  });

  it("overallScore is the average of all metric scores", () => {
    const { result } = renderHook(() => useEndingSatisfaction());
    const expectedScore = Math.round(
      result.current.metrics.reduce((sum, m) => sum + m.score, 0) /
        result.current.metrics.length
    );
    expect(result.current.overallScore).toBe(expectedScore);
  });

  it("rerunAnalysis is a function", () => {
    const { result } = renderHook(() => useEndingSatisfaction());
    expect(typeof result.current.rerunAnalysis).toBe("function");
  });
});
