import { renderHook } from "@testing-library/react";
import { useDocumentStats } from "../useDocumentStats";
import { computeDocumentStats } from "../../utils/story-utils";
import type { Chapter } from "../../types/story.types";

vi.mock("../../utils/story-utils", () => ({
  computeDocumentStats: vi.fn(),
}));

const mockStats = {
  totalWords: 100,
  uniqueWords: 80,
  vocabularyRichness: 0.8,
  readingTimeMin: 1.0,
  estimatedPages: 0.5,
};

const zeroStats = {
  totalWords: 0,
  uniqueWords: 0,
  vocabularyRichness: 0,
  readingTimeMin: 0,
  estimatedPages: 0,
};

const makeChapter = (id: number, title: string, content: string): Chapter =>
  ({ id, title, content } as Chapter);

describe("useDocumentStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (computeDocumentStats as ReturnType<typeof vi.fn>).mockReturnValue(mockStats);
  });

  it("handles undefined chapters gracefully", () => {
    (computeDocumentStats as ReturnType<typeof vi.fn>).mockReturnValueOnce(zeroStats);
    const { result } = renderHook(() => useDocumentStats(undefined));
    expect(result.current.chapterStats).toEqual([]);
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDocumentStats } from "../useDocumentStats";
import { Chapter } from "../../types/story.types";

describe("useDocumentStats hook", () => {
  const makeChapter = (id: number, title: string, content: string): Chapter => ({
    id,
    title,
    content,
    createdAt: new Date().toISOString(),
  });

  it("should return zero stats for undefined chapters", () => {
    const { result } = renderHook(() => useDocumentStats(undefined));

    expect(result.current.docStats.totalWords).toBe(0);
    expect(result.current.docStats.uniqueWords).toBe(0);
    expect(result.current.chapterStats).toHaveLength(0);

    expect(result.current.chapterAvgWords).toBe(0);
    expect(result.current.maxChapterWords).toBe(0);
  });


  it("computes per-chapter stats and aggregate stats for a single chapter", () => {
    const chapters: Chapter[] = [makeChapter(1, "Chapter 1", "Hello world test content")];
    const { result } = renderHook(() => useDocumentStats(chapters));

    expect(result.current.chapterStats).toHaveLength(1);
    expect(result.current.chapterStats[0]).toMatchObject({
      id: 1,
      title: "Chapter 1",
    });
    expect(result.current.docStats).toEqual(mockStats);
  });

  it("computes per-chapter stats for multiple chapters", () => {
    const chapters: Chapter[] = [
      makeChapter(1, "Ch1", "content one"),
      makeChapter(2, "Ch2", "content two"),
    ];
    const { result } = renderHook(() => useDocumentStats(chapters));

    // called once per chapter + once for combined
    expect(computeDocumentStats).toHaveBeenCalledTimes(3);
    expect(result.current.chapterStats).toHaveLength(2);
    expect(result.current.chapterStats[0]).toMatchObject({ id: 1, title: "Ch1" });
    expect(result.current.chapterStats[1]).toMatchObject({ id: 2, title: "Ch2" });
  });

  it("computes chapterAvgWords as docStats.totalWords / chapterCount", () => {
    (computeDocumentStats as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce({ ...mockStats, totalWords: 100 })
      .mockReturnValueOnce({ ...mockStats, totalWords: 100 })
      .mockReturnValueOnce({ ...mockStats, totalWords: 200 });

    const chapters: Chapter[] = [
      makeChapter(1, "Ch1", "chapter one"),
      makeChapter(2, "Ch2", "chapter two"),
    ];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.chapterAvgWords).toBe(200 / 2);
  });

  it("computes maxChapterWords as the maximum word count across chapters", () => {
    (computeDocumentStats as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce({ ...mockStats, totalWords: 50 })
      .mockReturnValueOnce({ ...mockStats, totalWords: 200 })
      .mockReturnValueOnce({ ...mockStats, totalWords: 100 });

    const chapters: Chapter[] = [
      makeChapter(1, "Ch1", "short chapter"),
      makeChapter(2, "Ch2", "long chapter"),
    ];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.maxChapterWords).toBe(200);
  });

  it("memoizes results — does not recompute for same chapters reference", () => {
    const chapters: Chapter[] = [makeChapter(1, "Ch1", "content")];
    const { result, rerender } = renderHook(() => useDocumentStats(chapters));
    const firstStats = result.current;
    rerender();
    expect(result.current).toBe(firstStats);

  it("should return zero stats for empty chapters array", () => {
    const { result } = renderHook(() => useDocumentStats([]));

    expect(result.current.docStats.totalWords).toBe(0);
    expect(result.current.chapterStats).toHaveLength(0);
    expect(result.current.chapterAvgWords).toBe(0);
    expect(result.current.maxChapterWords).toBe(0);
  });

  it("should compute per-chapter and aggregate stats for a single chapter", () => {
    const chapters: Chapter[] = [
      makeChapter(1, "Chapter 1", "Hello world hello"),
    ];

    const { result } = renderHook(() => useDocumentStats(chapters));

    // Per-chapter: 3 words total, 2 unique
    expect(result.current.chapterStats).toHaveLength(1);
    expect(result.current.chapterStats[0].id).toBe(1);
    expect(result.current.chapterStats[0].title).toBe("Chapter 1");
    expect(result.current.chapterStats[0].totalWords).toBe(3);
    expect(result.current.chapterStats[0].uniqueWords).toBe(2);

    // Aggregate: 3 words total, 2 unique, avg = 3, max = 3
    expect(result.current.docStats.totalWords).toBe(3);
    expect(result.current.docStats.uniqueWords).toBe(2);
    expect(result.current.chapterAvgWords).toBe(3);
    expect(result.current.maxChapterWords).toBe(3);
  });

  it("should compute correct aggregate stats across multiple chapters", () => {
    const chapters: Chapter[] = [
      makeChapter(1, "Chapter 1", "one two three four five"),
      makeChapter(2, "Chapter 2", "six seven eight nine ten eleven twelve"),
    ];

    const { result } = renderHook(() => useDocumentStats(chapters));

    // Chapter 1: 5 words, Chapter 2: 7 words
    expect(result.current.chapterStats).toHaveLength(2);
    expect(result.current.chapterStats[0].totalWords).toBe(5);
    expect(result.current.chapterStats[1].totalWords).toBe(7);

    // Aggregate: 12 total words, avg = 12/2 = 6, max = 7
    expect(result.current.docStats.totalWords).toBe(12);
    expect(result.current.chapterAvgWords).toBe(6);
    expect(result.current.maxChapterWords).toBe(7);
  });

  it("should set maxChapterWords to the chapter with the most words", () => {
    const chapters: Chapter[] = [
      makeChapter(1, "Short", "a b c"),
      makeChapter(2, "Longest", "a b c d e f g h i j"),
      makeChapter(3, "Medium", "w x y z"),
    ];

    const { result } = renderHook(() => useDocumentStats(chapters));

    expect(result.current.maxChapterWords).toBe(10);
    expect(result.current.chapterAvgWords).toBeCloseTo(6.0);
  });

  it("should recompute when chapters array changes", () => {
    const { result, rerender } = renderHook(
      ({ chapters }: { chapters: Chapter[] | undefined }) =>
        useDocumentStats(chapters),
      { initialProps: { chapters: undefined as Chapter[] | undefined } }
    );

    expect(result.current.docStats.totalWords).toBe(0);

    rerender({
      chapters: [makeChapter(1, "Chapter 1", "hello world")],
    });

    expect(result.current.docStats.totalWords).toBe(2);
  });
});
