/**
 * useGenreRecommendation.test.ts
 * Unit tests for the useGenreRecommendation React hook.
 */
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useGenreRecommendation from "../useGenreRecommendation";

describe("useGenreRecommendation", () => {
  it("returns an array of genre recommendations", () => {
    const { result } = renderHook(() => useGenreRecommendation());
    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current.length).toBeGreaterThan(0);
  });

  it("each recommendation has genre, confidence, and reason fields", () => {
    const { result } = renderHook(() => useGenreRecommendation());
    result.current.forEach((rec) => {
      expect(typeof rec.genre).toBe("string");
      expect(typeof rec.confidence).toBe("number");
      expect(typeof rec.reason).toBe("string");
    });
  });

  it("confidence scores are within valid range", () => {
    const { result } = renderHook(() => useGenreRecommendation());
    result.current.forEach((rec) => {
      expect(rec.confidence).toBeGreaterThanOrEqual(0);
      expect(rec.confidence).toBeLessThanOrEqual(100);
    });
  });

  it("returns the same reference on repeated renders (memoization)", () => {
    const { result, rerender } = renderHook(() => useGenreRecommendation());
    const firstResult = result.current;

    rerender();
    rerender();
    rerender();

    expect(result.current).toBe(firstResult);
  });

  it("includes at least one genre recommendation", () => {
    const { result } = renderHook(() => useGenreRecommendation());
    expect(result.current.length).toBeGreaterThanOrEqual(1);
  });
});
