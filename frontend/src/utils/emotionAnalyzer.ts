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