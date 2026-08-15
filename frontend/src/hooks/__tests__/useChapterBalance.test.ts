import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useChapterBalance from "../../hooks/useChapterBalance";

describe("useChapterBalance", () => {
  it("returns the analysis from analyzeChapterBalance for the given story", () => {
    const story = "chapter 1 " + "word ".repeat(500);
    const { result } = renderHook(() => useChapterBalance(story));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].chapter).toBe(1);
    expect(result.current[0].words).toBeGreaterThan(0);
  });

  it("returns an empty array for an empty story", () => {
    const { result } = renderHook(() => useChapterBalance(""));
    expect(result.current).toEqual([]);
  });

  it("memoizes: returns a stable reference for the same story value", () => {
    const story = "chapter 1 " + "word ".repeat(500);
    const { result, rerender } = renderHook(() => useChapterBalance(story));
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it("returns a new reference when the story changes", () => {
    const storyA = "chapter 1 " + "word ".repeat(500);
    const storyB = "chapter 1 " + "word ".repeat(600);
    const { result, rerender } = renderHook(
      ({ s }) => useChapterBalance(s),
      { initialProps: { s: storyA } }
    );
    const first = result.current;
    rerender({ s: storyB });
    expect(result.current).not.toBe(first);
    expect(result.current[0].words).toBeGreaterThan(first[0].words);
  });

  it("returns chapter analysis with balanced/needs-review status", () => {
    const story = "chapter 1 " + "word ".repeat(500);
    const { result } = renderHook(() => useChapterBalance(story));
    for (const c of result.current) {
      expect(["Balanced", "Needs Review"]).toContain(c.status);
    }
  });
});
