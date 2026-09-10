import { useMemo } from "react";
import { calculateReadingStats } from "../utils/readingStats";

export default function useReadingStats(text: string) {
  return useMemo(() => {
    return calculateReadingStats(text);
  }, [text]);
}