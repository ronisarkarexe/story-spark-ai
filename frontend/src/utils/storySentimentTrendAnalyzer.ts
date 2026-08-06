export interface SentimentTrendAnalysis {
  beginningScore: number;
  middleScore: number;
  endingScore: number;
  overallTrend: string;
}

export function analyzeStorySentimentTrend(text: string): SentimentTrendAnalysis {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      beginningScore: 50,
      middleScore: 50,
      endingScore: 50,
      overallTrend: 'Steady',
    };
  }

  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return {
      beginningScore: 50,
      middleScore: 50,
      endingScore: 50,
      overallTrend: 'Steady',
    };
  }

  const positiveWords = ['happy', 'joy', 'hope', 'peace', 'victory', 'love', 'smile', 'light'];
  const negativeWords = ['sad', 'fear', 'dark', 'pain', 'loss', 'gloom', 'cry', 'grief'];

  const evaluateSection = (sectionWords: string[]) => {
    if (sectionWords.length === 0) return 50;
    let pos = 0;
    let neg = 0;
    sectionWords.forEach((w) => {
      if (positiveWords.some((k) => w.includes(k))) pos++;
      if (negativeWords.some((k) => w.includes(k))) neg++;
    });
    if (pos === 0 && neg === 0) return 50;
    return Math.round(50 + ((pos - neg) / sectionWords.length) * 50);
  };

  const third = Math.ceil(words.length / 3);
  const beginning = words.slice(0, third);
  const middle = words.slice(third, third * 2);
  const ending = words.slice(third * 2);

  const begScore = evaluateSection(beginning);
  const midScore = evaluateSection(middle);
  const endScore = evaluateSection(ending);

  let trend = 'Steady';
  if (endScore > begScore + 10) trend = 'Uplifting';
  else if (begScore > endScore + 10) trend = 'Darkening';

  return {
    beginningScore: begScore,
    middleScore: midScore,
    endingScore: endScore,
    overallTrend: trend,
  };
}
