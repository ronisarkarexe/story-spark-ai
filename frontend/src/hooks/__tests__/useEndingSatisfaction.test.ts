import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import useEndingSatisfaction from "../useEndingSatisfaction";

describe("useEndingSatisfaction", () => {
  it("returns a metrics array", () => {
    const { result } = renderHook(() => useEndingSatisfaction());
    expect(Array.isArray(result.current.metrics)).toBe(true);
  });

  it("returns an overallScore number", () => {
    const { result } = renderHook(() => useEndingSatisfaction());
    expect(typeof result.current.overallScore).toBe("number");
  });

  it("returns a rerunAnalysis function", () => {
    const { result } = renderHook(() => useEndingSatisfaction());
    expect(typeof result.current.rerunAnalysis).toBe("function");
  });

  it("computes overallScore as average of metric scores", () => {
    const { result } = renderHook(() => useEndingSatisfaction());
    const { metrics, overallScore } = result.current;
    const expected = Math.round(
      metrics.reduce((sum, item) => sum + item.score, 0) / metrics.length
    );
    expect(overallScore).toBe(expected);
  });

  it("calls onComplete when rerunAnalysis is invoked", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useEndingSatisfaction({ onComplete }));
    result.current.rerunAnalysis();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("does not throw when onComplete is not provided", () => {
    const { result } = renderHook(() => useEndingSatisfaction());
    expect(() => result.current.rerunAnalysis()).not.toThrow();
  });
});
