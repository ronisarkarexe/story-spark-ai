import { useMemo } from "react";
import { Chapter } from "../types/story.types";
import { computeDocumentStats, DocumentStats } from "../utils/story-utils";

export interface ChapterStats extends DocumentStats {
  id: number;
  title: string;
}

export interface UseDocumentStatsResult {
  docStats: DocumentStats;
  chapterStats: ChapterStats[];
  chapterAvgWords: number;
  maxChapterWords: number;
}

/**
 * Computes Document Stats Dashboard metrics for a story.
 *
 * Why no debounce: the issue spec (#4424) calls for a 2s debounce on
 * typing pauses, modeled on a live text editor. This app's chapters
 * arrive whole from a single non-streaming AI response (see
 * continuation.service.ts -> addChapter), not via continuous keystrokes,
 * so there's no rapid-fire input to debounce against. useMemo keyed on
 * the chapters array already guarantees we only recompute when the
 * story actually changes, which is the real performance requirement
 * here. If a streaming/live-editing mode is added later, debounce
 * should be reintroduced at that point using the existing
 * hooks/useDebounce.ts (value-debounce) on the chapters array.
 */
export function useDocumentStats(chapters: Chapter[] | undefined): UseDocumentStatsResult {
  return useMemo(() => {
    const safeChapters = chapters ?? [];

    const chapterStats: ChapterStats[] = safeChapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      ...computeDocumentStats(chapter.content),
    }));

    const fullText = safeChapters.map((c) => c.content).join(" ");
    const docStats = computeDocumentStats(fullText);

    const chapterAvgWords =
      safeChapters.length > 0 ? docStats.totalWords / safeChapters.length : 0;

    const maxChapterWords = chapterStats.reduce(
      (max, c) => Math.max(max, c.totalWords),
      0
    );

    return { docStats, chapterStats, chapterAvgWords, maxChapterWords };
  }, [chapters]);
}