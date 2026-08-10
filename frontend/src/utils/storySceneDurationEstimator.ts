export interface SceneDuration {
  id: number;
  title: string;
  wordCount: number;
  readingTime: number;
}

const WORDS_PER_MINUTE = 200;

export function estimateSceneDurations(
  story: string
): {
  scenes: SceneDuration[];
  totalReadingTime: number;
} {
  if (!story.trim()) {
    return {
      scenes: [],
      totalReadingTime: 0,
    };
  }

  const scenes = story
    .split(/\n{2,}/)
    .filter((scene) => scene.trim())
    .map((scene, index) => {
      const wordCount = scene.trim().split(/\s+/).filter(Boolean).length;

      return {
        id: index + 1,
        title: `Scene ${index + 1}`,
        wordCount,
        readingTime:
          wordCount === 0
            ? 0
            : Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE)),
      };
    });

  const totalReadingTime = scenes.reduce(
    (sum, scene) => sum + scene.readingTime,
    0
  );

  return {
    scenes,
    totalReadingTime,
  };
}

export function refreshSceneDurations(
  story: string
) {
  return estimateSceneDurations(story);
}