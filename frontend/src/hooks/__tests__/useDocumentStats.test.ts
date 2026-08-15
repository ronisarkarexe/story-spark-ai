import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDocumentStats } from "../useDocumentStats";
import { Chapter } from "../../types/story.types";

const makeChapter = (id: number, title: string, content: string): Chapter => ({
  id,
  title,
  content,
  createdAt: new Date().toISOString(),
});

describe("useDocumentStats", () => {
  it("returns zero stats for undefined chapters", () => {
    const { result } = renderHook(() => useDocumentStats(undefined));
    expect(result.current.docStats.totalWords).toBe(0);
    expect(result.current.docStats.uniqueWords).toBe(0);
    expect(result.current.chapterStats).toHaveLength(0);
    expect(result.current.chapterAvgWords).toBe(0);
    expect(result.current.maxChapterWords).toBe(0);
  });

  it("returns zero stats for an empty chapters array", () => {
    const { result } = renderHook(() => useDocumentStats([]));
    expect(result.current.docStats.totalWords).toBe(0);
    expect(result.current.chapterStats).toHaveLength(0);
    expect(result.current.chapterAvgWords).toBe(0);
    expect(result.current.maxChapterWords).toBe(0);
  });

  it("computes per-chapter stats and aggregate stats for a single chapter", () => {
    const chapters: Chapter[] = [makeChapter(1, "Chapter 1", "Hello world test content")];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.chapterStats).toHaveLength(1);
    expect(result.current.chapterStats[0]).toMatchObject({ id: 1, title: "Chapter 1" });
    expect(result.current.chapterStats[0].totalWords).toBe(4);
    expect(result.current.docStats.totalWords).toBe(4);
  });

  it("computes per-chapter stats for multiple chapters", () => {
    const chapters: Chapter[] = [
      makeChapter(1, "Ch1", "content one"),
      makeChapter(2, "Ch2", "content two"),
    ];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.chapterStats).toHaveLength(2);
    expect(result.current.chapterStats[0]).toMatchObject({ id: 1, title: "Ch1" });
    expect(result.current.chapterStats[1]).toMatchObject({ id: 2, title: "Ch2" });
    // combined: "content one content two" = 4 words
    expect(result.current.docStats.totalWords).toBe(4);
  });

  it("computes chapterAvgWords as docStats.totalWords / chapterCount", () => {
    const chapters: Chapter[] = [
      makeChapter(1, "Ch1", "one two three four five"), // 5
      makeChapter(2, "Ch2", "six seven eight nine ten eleven twelve"), // 7
    ];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.docStats.totalWords).toBe(12);
    expect(result.current.chapterAvgWords).toBe(12 / 2);
  });

  it("computes maxChapterWords as the maximum word count across chapters", () => {
    const chapters: Chapter[] = [
      makeChapter(1, "Short", "a b c"), // 3
      makeChapter(2, "Longest", "a b c d e f g h i j"), // 10
      makeChapter(3, "Medium", "w x y z"), // 4
    ];
    const { result } = renderHook(() => useDocumentStats(chapters));
    expect(result.current.maxChapterWords).toBe(10);
  });

  it("chapterAvgWords is 0 when there are no chapters even if totalWords is 0", () => {
    const { result } = renderHook(() => useDocumentStats([]));
    expect(result.current.chapterAvgWords).toBe(0);
  });

  it("recomputes when chapters array changes", () => {
    const { result, rerender } = renderHook(
      ({ chapters }: { chapters: Chapter[] | undefined }) => useDocumentStats(chapters),
      { initialProps: { chapters: undefined as Chapter[] | undefined } }
    );
    expect(result.current.docStats.totalWords).toBe(0);

    rerender({ chapters: [makeChapter(1, "Chapter 1", "hello world")] });
    expect(result.current.docStats.totalWords).toBe(2);
    expect(result.current.chapterStats).toHaveLength(1);
  });

  it("memoizes the result for the same chapters reference", () => {
    const chapters: Chapter[] = [makeChapter(1, "Chapter 1", "hello world")];
    const { result, rerender } = renderHook(
      ({ chapters }: { chapters: Chapter[] }) => useDocumentStats(chapters),
      { initialProps: { chapters } }
    );
    const first = result.current;
    rerender({ chapters }); // same reference
    expect(result.current).toBe(first);
  });

  it("chapterStats entries include id, title, and DocumentStats fields", () => {
    const chapters: Chapter[] = [makeChapter(1, "Chapter 1", "hello world")];
    const { result } = renderHook(() => useDocumentStats(chapters));
    const stat = result.current.chapterStats[0];
    expect(stat).toMatchObject({
      id: 1,
      title: "Chapter 1",
      totalWords: 2,
      uniqueWords: 2,
    });
    expect(typeof stat.vocabularyRichness).toBe("number");
    expect(typeof stat.readingTimeMin).toBe("number");
    expect(typeof stat.estimatedPages).toBe("number");
  });
});
