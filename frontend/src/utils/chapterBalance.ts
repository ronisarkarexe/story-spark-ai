export interface ChapterAnalysis {
  chapter: number;
  words: number;
  score: number;
  status: "Balanced" | "Needs Review";
}

export function analyzeChapterBalance(story: string): ChapterAnalysis[] {
  const chapters = story
    .split(/chapter\s+\d+/i)
    .filter((c) => c.trim());

  return chapters.map((chapter, index) => {
    const words = chapter.trim().split(/\s+/).length;

    const score = Math.min(
      100,
      Math.round((words / 800) * 100)
    );

    return {
      chapter: index + 1,
      words,
      score,
      status:
        words >= 400 && words <= 1200
          ? "Balanced"
          : "Needs Review",
    };
  });
}