import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useChapterTitleGenerator from "../useChapterTitleGenerator";

describe("useChapterTitleGenerator", () => {
  beforeEach(() => {
    vi.spyOn(window, "alert").mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns chapters from generateChapterTitles", () => {
    const { result } = renderHook(() => useChapterTitleGenerator());
    expect(result.current.chapters).toBeDefined();
    expect(Array.isArray(result.current.chapters)).toBe(true);
    expect(result.current.chapters.length).toBeGreaterThan(0);
  });

  it("chapters have chapter and suggestions fields", () => {
    const { result } = renderHook(() => useChapterTitleGenerator());
    const firstChapter = result.current.chapters[0];
    expect(firstChapter).toHaveProperty("chapter");
    expect(firstChapter).toHaveProperty("suggestions");
    expect(Array.isArray(firstChapter.suggestions)).toBe(true);
  });

  it("regenerateTitles is a function", () => {
    const { result } = renderHook(() => useChapterTitleGenerator());
    expect(typeof result.current.regenerateTitles).toBe("function");
  });

  it("regenerateTitles calls alert", () => {
    const { result } = renderHook(() => useChapterTitleGenerator());
    result.current.regenerateTitles();
    expect(window.alert).toHaveBeenCalled();
  });

  it("chapters are memoized and stable across re-renders", () => {
    const { result, rerender } = renderHook(() => useChapterTitleGenerator());
    const chaptersFirst = result.current.chapters;
    rerender();
    expect(result.current.chapters).toBe(chaptersFirst);
  });
});
