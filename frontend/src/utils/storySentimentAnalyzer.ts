export interface StorySentimentResult {
  positiveScore: number;
  negativeScore: number;
  neutralScore: number;
  dominantTone: 'Positive' | 'Negative' | 'Neutral';
}

export function analyzeStorySentiment(story: string): StorySentimentResult {
  if (!story || !story.trim()) {
    return {
      positiveScore: 0,
      negativeScore: 0,
      neutralScore: 100,
      dominantTone: 'Neutral',
    };
  }

  const text = story.toLowerCase();
  const positiveWords = ['happy', 'joy', 'bright', 'love', 'hope', 'victory', 'smile', 'triumph'];
  const negativeWords = ['sad', 'gloom', 'dark', 'loss', 'fear', 'tragedy', 'pain', 'defeat'];

  let posCount = 0;
  let negCount = 0;

  positiveWords.forEach((w) => {
    if (text.includes(w)) posCount += 1;
  });
  negativeWords.forEach((w) => {
    if (text.includes(w)) negCount += 1;
  });

  if (posCount > negCount) {
    return {
      positiveScore: 70,
      negativeScore: 20,
      neutralScore: 10,
      dominantTone: 'Positive',
    };
  } else if (negCount > posCount) {
    return {
      positiveScore: 20,
      negativeScore: 70,
      neutralScore: 10,
      dominantTone: 'Negative',
    };
  }

  return {
    positiveScore: 30,
    negativeScore: 30,
    neutralScore: 40,
    dominantTone: 'Neutral',
  };
}
