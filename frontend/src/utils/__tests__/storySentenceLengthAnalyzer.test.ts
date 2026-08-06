import { describe, it, expect } from 'vitest';
import { analyzeStorySentenceLength } from '../storySentenceLengthAnalyzer';

describe('storySentenceLengthAnalyzer utility', () => {
  it('should return zeros for empty string input', () => {
    expect(analyzeStorySentenceLength('')).toEqual({
      totalSentences: 0,
      averageWordsPerSentence: 0,
      longestSentenceWords: 0,
    });
  });

  it('should calculate sentence length metrics correctly', () => {
    const story = 'Short sentence here. This is a longer sentence with more words!';
    const result = analyzeStorySentenceLength(story);
    expect(result.totalSentences).toBe(2);
    expect(result.averageWordsPerSentence).toBe(6);
    expect(result.longestSentenceWords).toBe(8);
  });
});
