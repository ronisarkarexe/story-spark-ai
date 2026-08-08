export interface SentenceLengthAnalysis {
  totalSentences: number;
  averageWordsPerSentence: number;
  longestSentenceWords: number;
}

export function analyzeStorySentenceLength(text: string): SentenceLengthAnalysis {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      totalSentences: 0,
      averageWordsPerSentence: 0,
      longestSentenceWords: 0,
    };
  }

  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return {
      totalSentences: 0,
      averageWordsPerSentence: 0,
      longestSentenceWords: 0,
    };
  }

  let totalWords = 0;
  let maxWords = 0;

  sentences.forEach((s) => {
    const wordCount = s.split(/\s+/).filter(Boolean).length;
    totalWords += wordCount;
    if (wordCount > maxWords) {
      maxWords = wordCount;
    }
  });

  return {
    totalSentences: sentences.length,
    averageWordsPerSentence: Math.round(totalWords / sentences.length),
    longestSentenceWords: maxWords,
  };
}
