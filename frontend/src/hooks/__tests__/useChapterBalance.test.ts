import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useChapterBalance from "../useChapterBalance";

describe("useChapterBalance", () => {
  it("returns an empty array for an empty story", () => {
    const { result } = renderHook(() => useChapterBalance(""));
    expect(result.current).toEqual([]);
  });

  it("treats a story without chapter markers as a single chapter", () => {
    const { result } = renderHook(() => useChapterBalance("This is a story with no chapter markers."));
    // Without chapter markers the entire story is treated as one chapter
    expect(result.current).toHaveLength(1);
    expect(result.current[0].chapter).toBe(1);
  });

  it("parses a single chapter and computes word count and score", () => {
    const story = "chapter 1 Some long text that is clearly more than eight hundred words long and should produce a high score for this chapter test case to ensure the analysis works correctly and returns the expected chapter object with word count and balance status.";
    const { result } = renderHook(() => useChapterBalance(story));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].chapter).toBe(1);
    expect(typeof result.current[0].words).toBe("number");
    expect(typeof result.current[0].score).toBe("number");
    expect(["Balanced", "Needs Review"]).toContain(result.current[0].status);
  });

  it("parses multiple chapters correctly", () => {
    const story =
      "chapter 1 Some content here for chapter one. " +
      "chapter 2 Some content here for chapter two. " +
      "chapter 3 Some content here for chapter three.";
    const { result } = renderHook(() => useChapterBalance(story));
    expect(result.current).toHaveLength(3);
    expect(result.current[0].chapter).toBe(1);
    expect(result.current[1].chapter).toBe(2);
    expect(result.current[2].chapter).toBe(3);
  });

  it("marks chapter as Needs Review when too short", () => {
    const story = "chapter 1 Short.";
    const { result } = renderHook(() => useChapterBalance(story));
    expect(result.current[0].status).toBe("Needs Review");
  });

  it("marks chapter as Balanced when within 400-1200 words", () => {
    const story = "chapter 1 " + "word ".repeat(600);
    const { result } = renderHook(() => useChapterBalance(story));
    expect(result.current[0].status).toBe("Balanced");
  });
});
