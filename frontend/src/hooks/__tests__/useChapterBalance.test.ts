import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useChapterBalance from "../useChapterBalance";

describe("useChapterBalance", () => {
  it("returns an array of chapter analyses", () => {
    const story = "chapter 1 Some text here chapter 2 More text here";
    const { result } = renderHook(() => useChapterBalance(story));
    expect(Array.isArray(result.current)).toBe(true);
  });

  it("marks chapters with 400-1200 words as Balanced", () => {
    // 800 words of dummy text = should be Balanced (score 100, status Balanced)
    const filler = "word ".repeat(800);
    const story = `chapter 1 ${filler} chapter 2 ${filler}`;
    const { result } = renderHook(() => useChapterBalance(story));
    const balanced = result.current.filter((c) => c.status === "Balanced");
    expect(balanced.length).toBeGreaterThan(0);
  });

  it("marks chapters under 400 words as Needs Review", () => {
    const story = "chapter 1 short";
    const { result } = renderHook(() => useChapterBalance(story));
    const needsReview = result.current.filter((c) => c.status === "Needs Review");
    expect(needsReview.length).toBeGreaterThan(0);
  });

  it("marks chapters over 1200 words as Needs Review", () => {
    const filler = "word ".repeat(1300);
    const story = `chapter 1 ${filler}`;
    const { result } = renderHook(() => useChapterBalance(story));
    const needsReview = result.current.filter((c) => c.status === "Needs Review");
    expect(needsReview.length).toBeGreaterThan(0);
  });

  it("returns chapter number starting from 1", () => {
    const story = "chapter 1 First chapter content here chapter 2 Second chapter content";
    const { result } = renderHook(() => useChapterBalance(story));
    if (result.current.length > 0) {
      expect(result.current[0].chapter).toBe(1);
    }
  });

  it("handles empty story string without error", () => {
    const { result } = renderHook(() => useChapterBalance(""));
    expect(Array.isArray(result.current)).toBe(true);
  });

  it("each chapter analysis has required fields", () => {
    const story = "chapter 1 Some words here and more content chapter 2 More words here";
    const { result } = renderHook(() => useChapterBalance(story));
    if (result.current.length > 0) {
      const chapter = result.current[0];
      expect(chapter).toHaveProperty("chapter");
      expect(chapter).toHaveProperty("words");
      expect(chapter).toHaveProperty("score");
      expect(chapter).toHaveProperty("status");
      expect(typeof chapter.chapter).toBe("number");
      expect(typeof chapter.words).toBe("number");
      expect(typeof chapter.score).toBe("number");
      expect(["Balanced", "Needs Review"]).toContain(chapter.status);
    }
  });
});
