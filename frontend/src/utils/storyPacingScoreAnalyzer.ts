export interface PacingScoreAnalysis {
  pacingScore: number;
  rhythmCategory: string;
}

export function calculateStoryPacingScore(text: string): PacingScoreAnalysis {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      pacingScore: 100,
      rhythmCategory: 'Neutral',
    };
  }

  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return {
      pacingScore: 100,
      rhythmCategory: 'Neutral',
    };
  }

  const lengths = sentences.map((s) => s.split(/\s+/).filter(Boolean).length);
  const avg = lengths.reduce((acc, curr) => acc + curr, 0) / lengths.length;

  if (avg < 8) {
    return {
      pacingScore: 90,
      rhythmCategory: 'Fast Paced',
    };
  } else if (avg > 20) {
    return {
      pacingScore: 75,
      rhythmCategory: 'Slow Paced',
    };
  }

  return {
    pacingScore: 85,
    rhythmCategory: 'Moderate Paced',
  };
}
