export interface StoryMetrics {
  title: string;
  wordCount: number;
  avgSentenceLength: number;
  dialogueCount: number;
  readability: number;
}

export function getStoryMetrics(
  title: string,
  story: string
): StoryMetrics {
  const words = story.trim().split(/\s+/).filter(Boolean);

  const sentences = story
    .split(/[.!?]+/)
    .filter((s) => s.trim());

  const dialogueCount =
    (story.match(/"/g) || []).length / 2;

  return {
    title,
    wordCount: words.length,
    avgSentenceLength:
      sentences.length > 0
        ? Math.round(words.length / sentences.length)
        : 0,
    dialogueCount,
    readability: Math.max(
      0,
      100 - Math.floor(words.length / 100)
    ),
  };
}