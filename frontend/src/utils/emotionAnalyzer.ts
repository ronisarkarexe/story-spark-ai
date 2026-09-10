/**
 * Represents the emotional breakdown of a specific scene or an average across scenes.
 */
export interface EmotionPoint {
  scene: number;
  joy: number;
  fear: number;
  sadness: number;
  anger: number;
  hope: number;
  suspense: number;
}

/**
 * Analyzes the emotional journey of a story by breaking it down into scenes
 * and counting the frequency of emotion-related words in each scene.
 *
 * @param story - The full text of the story to analyze.
 * @returns An array of EmotionPoint objects representing the emotional score for each scene.
 */
export function analyzeEmotionJourney(story: string): EmotionPoint[] {
  const scenes = story
    .split(/\n\s*\n/)
    .filter((s) => s.trim().length > 0);

  return scenes.map((scene, index) => {
    const text = scene.toLowerCase();

    return {
      scene: index + 1,
      joy: (text.match(/happy|smile|laugh|celebrate/g) || []).length,
      fear: (text.match(/fear|dark|monster|terrified/g) || []).length,
      sadness: (text.match(/cry|sad|grief|lonely/g) || []).length,
      anger: (text.match(/angry|rage|fight|furious/g) || []).length,
      hope: (text.match(/hope|dream|believe|future/g) || []).length,
      suspense: (text.match(/suddenly|mystery|secret|unknown/g) || []).length,
    };
  });
}

/**
 * Computes the average emotion scores across all scenes in an emotional journey.
 *
 * @param points - An array of EmotionPoint objects representing the emotional journey.
 * @returns A single EmotionPoint object containing the average scores for each emotion.
 */
export function computeAverageEmotion(points: EmotionPoint[]): EmotionPoint {
  if (!points || points.length === 0) {
    return { scene: 0, joy: 0, fear: 0, sadness: 0, anger: 0, hope: 0, suspense: 0 };
  }

  const totals = points.reduce(
    (acc, point) => ({
      scene: 0,
      joy: acc.joy + point.joy,
      fear: acc.fear + point.fear,
      sadness: acc.sadness + point.sadness,
      anger: acc.anger + point.anger,
      hope: acc.hope + point.hope,
      suspense: acc.suspense + point.suspense,
    }),
    { scene: 0, joy: 0, fear: 0, sadness: 0, anger: 0, hope: 0, suspense: 0 }
  );

  const count = points.length;

  return {
    scene: 0,
    joy: totals.joy / count,
    fear: totals.fear / count,
    sadness: totals.sadness / count,
    anger: totals.anger / count,
    hope: totals.hope / count,
    suspense: totals.suspense / count,
  };
}