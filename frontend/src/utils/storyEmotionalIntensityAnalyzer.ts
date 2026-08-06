export interface EmotionalIntensityAnalysis {
  intensityScore: number;
  isHighIntensity: boolean;
}

export function calculateStoryEmotionalIntensity(text: string): EmotionalIntensityAnalysis {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      intensityScore: 0,
      isHighIntensity: false,
    };
  }

  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return {
      intensityScore: 0,
      isHighIntensity: false,
    };
  }

  const intenseKeywords = [
    'scream', 'shout', 'furious', 'rage', 'terrified', 'panic',
    'ecstasy', 'thrilled', 'agonizing', 'devastated', 'exclamation', 'desperate',
  ];

  let hitCount = 0;
  words.forEach((w) => {
    if (intenseKeywords.some((k) => w.includes(k))) hitCount++;
  });

  const exclamations = (text.match(/!/g) || []).length;
  const rawScore = hitCount * 15 + exclamations * 10;
  const score = Math.min(100, rawScore);

  return {
    intensityScore: score,
    isHighIntensity: score >= 40,
  };
}
