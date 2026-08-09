import { useMemo } from "react";
import { generateChapterTitles } from "../utils/chapterTitleGenerator";

export default function useChapterTitleGenerator() {
  const chapters = useMemo(() => generateChapterTitles(), []);

  const regenerateTitles = () => {
    alert("AI generated new title suggestions.");
  };

  return {
    chapters,
    regenerateTitles,
  };
}