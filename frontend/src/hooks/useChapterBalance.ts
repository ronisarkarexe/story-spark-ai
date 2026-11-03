import { useMemo } from "react";
import { analyzeChapterBalance } from "../utils/chapterBalance";

export default function useChapterBalance(story: string) {
  return useMemo(() => {
    return analyzeChapterBalance(story);
  }, [story]);
}