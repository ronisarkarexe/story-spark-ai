export interface StoryMetrics {
  wordCount: number;
  readingTime: number;
  vocabularyRichness: number;
  dialoguePercentage: number;
  pacing: number;
  sentiment: "Positive" | "Neutral" | "Negative";
}

export function calculateStoryMetrics(
  story: string
): StoryMetrics {
  const words = story.trim().split(/\s+/).filter(Boolean);

  const wordCount = words.length;

  const uniqueWords = new Set(
    words.map((word) => word.toLowerCase())
  );

  return {
    wordCount,
    readingTime: Math.max(1, Math.ceil(wordCount / 200)),
    vocabularyRichness: Math.round(
      (uniqueWords.size / Math.max(wordCount, 1)) * 100
    ),
    dialoguePercentage: Math.min(
      100,
      Math.round(
        ((story.match(/"/g)?.length || 0) / 2) * 5
      )
    ),
    pacing:
      wordCount > 800
        ? 90
        : wordCount > 400
        ? 75
        : 60,
    sentiment: "Neutral",
  };
}

export function compareStories(
  storyA: string,
  storyB: string
) {
  return {
    first: calculateStoryMetrics(storyA),
    second: calculateStoryMetrics(storyB),
  };
}