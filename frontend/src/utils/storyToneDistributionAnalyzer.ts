export interface ToneDistributionAnalysis {
  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;
  dominantTone: string;
}

export function analyzeStoryToneDistribution(text: string): ToneDistributionAnalysis {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      positivePercentage: 0,
      negativePercentage: 0,
      neutralPercentage: 100,
      dominantTone: 'Neutral',
    };
  }

  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return {
      positivePercentage: 0,
      negativePercentage: 0,
      neutralPercentage: 100,
      dominantTone: 'Neutral',
    };
  }

  const positiveKeywords = ['happy', 'joy', 'bright', 'love', 'hope', 'victory', 'peace', 'smile', 'light'];
  const negativeKeywords = ['sad', 'gloom', 'dark', 'fear', 'pain', 'loss', 'shadow', 'cry', 'grief'];

  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach((w) => {
    if (positiveKeywords.some((k) => w.includes(k))) positiveCount++;
    if (negativeKeywords.some((k) => w.includes(k))) negativeCount++;
  });

  const totalHits = positiveCount + negativeCount;
  if (totalHits === 0) {
    return {
      positivePercentage: 0,
      negativePercentage: 0,
      neutralPercentage: 100,
      dominantTone: 'Neutral',
    };
  }

  const posPct = Math.round((positiveCount / words.length) * 100);
  const negPct = Math.round((negativeCount / words.length) * 100);
  const neuPct = Math.max(0, 100 - posPct - negPct);

  let dominant = 'Neutral';
  if (positiveCount > negativeCount) dominant = 'Positive';
  else if (negativeCount > positiveCount) dominant = 'Negative';

  return {
    positivePercentage: posPct,
    negativePercentage: negPct,
    neutralPercentage: neuPct,
    dominantTone: dominant,
  };
}
