export interface EmotionPoint {
  scene: number;
  joy: number;
  fear: number;
 sadness: number;
 anger: number;
 hope: number;
 suspense: number;
}

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

export function computeAverageEmotion(
  points: EmotionPoint[]
): { joy: number; fear: number; sadness: number; anger: number; hope: number; suspense: number } {
  if (points.length === 0) {
    return { joy: 0, fear: 0, sadness: 0, anger: 0, hope: 0, suspense: 0 };
  }

  const total = points.reduce(
    (acc, point) => ({
      joy: acc.joy + point.joy,
      fear: acc.fear + point.fear,
      sadness: acc.sadness + point.sadness,
      anger: acc.anger + point.anger,
      hope: acc.hope + point.hope,
      suspense: acc.suspense + point.suspense,
    }),
    { joy: 0, fear: 0, sadness: 0, anger: 0, hope: 0, suspense: 0 }
  );

  return {
    joy: Math.round(total.joy / points.length),
    fear: Math.round(total.fear / points.length),
    sadness: Math.round(total.sadness / points.length),
    anger: Math.round(total.anger / points.length),
    hope: Math.round(total.hope / points.length),
    suspense: Math.round(total.suspense / points.length),
  };
}