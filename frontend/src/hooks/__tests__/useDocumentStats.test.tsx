/**
 * @jest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDocumentStats } from "../useDocumentStats";
import type { Chapter } from "../types/story.types";

vi.mock("../utils/story-utils", () => ({
  computeDocumentStats: vi.fn((content: string | undefined) => {
    if (!content || !content.trim()) {
      return { totalWords: 0, uniqueWords: 0, vocabularyRichness: 0, readingTimeMin: 0, estimatedPages: 0 };
    }
    const words = content.trim().split(/\s+/);
    const unique = new Set(words.map(w => w.toLowerCase()));
    return {
      totalWords: words.length,
      uniqueWords: unique.size,
      vocabularyRichness: unique.size / words.length,
      readingTimeMin: Math.ceil(words.length / 200),
      estimatedPages: Math.ceil(words.length / 250),
    };
  }),
}));

const mockChapter = (id: number, title: string, content: string): Chapter => ({
  id,
  title,
  content,
  createdAt: new Date().toISOString(),
});

describe("useDocumentStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns zero stats when chapters is undefined", () => {
    const { result } = renderHook(() => useDocumentStats(undefined));
    expect(result.current.docStats.totalWords).toBe(0);
    expect(result.current.chapterStats).toEqual([]);
    expect(result.current.chapterAvgWords).toBe(0);
    expect(result.current.maxChapterWords).toBe(0);
  });

  it("returns zero stats for empty chapters array", () => {
    const { result } = renderHook(() => useDocumentStats([]));
    expect(result.current.docStats.totalWords).toBe(0);
    expect(result.current.chapterStats).toEqual([]);
    expect(result.current.chapterAvgWords).toBe(0);
    expect(result.current.maxChapterWords).toBe(0);
  });

  it("computes chapter stats for a single chapter", () => {
    const chapters = [mockChapter(1, "Chapter 1", "hello world test content here")];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.chapterStats).toHaveLength(1);
    expect(result.current.chapterStats[0].id).toBe(1);
    expect(result.current.chapterStats[0].title).toBe("Chapter 1");
    expect(result.current.chapterStats[0].totalWords).toBeGreaterThan(0);
  });

  it("computes overall docStats by joining all chapter contents", () => {
    const chapters = [
      mockChapter(1, "Chapter 1", "hello world"),
      mockChapter(2, "Chapter 2", "foo bar baz"),
    ];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.docStats.totalWords).toBe(6);
    expect(result.current.chapterAvgWords).toBe(3);
  });

  it("computes maxChapterWords correctly", () => {
    const chapters = [
      mockChapter(1, "Short", "a b c"),
      mockChapter(2, "Long", "one two three four five six seven eight nine ten"),
    ];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.maxChapterWords).toBeGreaterThan(result.current.chapterStats[0].totalWords);
  });

  it("chapterAvgWords is 0 when there are no chapters", () => {
    const { result } = renderHook(() => useDocumentStats([]));
    expect(result.current.chapterAvgWords).toBe(0);
  });
});
