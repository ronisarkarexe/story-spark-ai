import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useChapterBalance from "../useChapterBalance";

describe("useChapterBalance", () => {
  it("returns empty array for empty string story", () => {
    const { result } = renderHook(() => useChapterBalance(""));
    expect(result.current).toEqual([]);
  });

  it("returns one chapter analysis for story with no explicit chapter markers", () => {
    // When no "Chapter N" pattern is found, the whole story is treated as chapter 1
    const { result } = renderHook(() =>
      useChapterBalance("Once upon a time there was a story.")
    );
    expect(result.current.length).toBe(1);
    expect(result.current[0].chapter).toBe(1);
    expect(result.current[0].status).toBe("Needs Review");
  });

  it("returns analysis for story with one chapter", () => {
    const story = "Chapter 1\nOnce upon a time in a land far away.";
    const { result } = renderHook(() => useChapterBalance(story));
    expect(result.current.length).toBe(1);
    expect(result.current[0].chapter).toBe(1);
    expect(result.current[0].words).toBeGreaterThan(0);
    expect(["Balanced", "Needs Review"]).toContain(result.current[0].status);
  });

  it("marks chapter as Balanced when words between 400 and 1200", () => {
    // 800 words is the sweet spot for "Balanced"
    const filler = Array.from({ length: 800 }, (_, i) => `word${i}`).join(" ");
    const story = `Chapter 1\n${filler}`;
    const { result } = renderHook(() => useChapterBalance(story));
    expect(result.current[0].status).toBe("Balanced");
  });

  it("marks chapter as Needs Review when words below 400", () => {
    const story = "Chapter 1\nShort story content.";
    const { result } = renderHook(() => useChapterBalance(story));
    expect(result.current[0].status).toBe("Needs Review");
  });

  it("marks chapter as Needs Review when words above 1200", () => {
    const filler = Array.from({ length: 1300 }, (_, i) => `word${i}`).join(" ");
    const story = `Chapter 1\n${filler}`;
    const { result } = renderHook(() => useChapterBalance(story));
    expect(result.current[0].status).toBe("Needs Review");
  });

  it("returns analysis for story with multiple chapters", () => {
    const story = "Chapter 1\nWord word word.\n\nChapter 2\nMore words here.\n\nChapter 3\nFinal chapter content.";
    const { result } = renderHook(() => useChapterBalance(story));
    expect(result.current.length).toBe(3);
    expect(result.current[0].chapter).toBe(1);
    expect(result.current[1].chapter).toBe(2);
    expect(result.current[2].chapter).toBe(3);
  });

  it("calculates score as percentage of 800-word target, capped at 100", () => {
    const filler = Array.from({ length: 1000 }, (_, i) => `word${i}`).join(" ");
    const story = `Chapter 1\n${filler}`;
    const { result } = renderHook(() => useChapterBalance(story));
    expect(result.current[0].score).toBe(100);
  });

  it("handles chapter keyword case-insensitively", () => {
    const story = "CHAPTER 1\nSome content.\n\nchapter 2\nMore content.";
    const { result } = renderHook(() => useChapterBalance(story));
    expect(result.current.length).toBe(2);
  });
});
