import { describe, it, expect } from 'vitest';
import { analyzeStoryParagraphs } from '../storyParagraphAnalyzer';

describe('storyParagraphAnalyzer utility', () => {
  it('should return zeros for empty string input', () => {
    expect(analyzeStoryParagraphs('')).toEqual({
      totalParagraphs: 0,
      averageWordsPerParagraph: 0,
      longestParagraphWords: 0,
    });
  });

  it('should analyze single and multi-paragraph story drafts correctly', () => {
    const story = 'Paragraph one has four words.\n\nParagraph two has five more words.';
    const result = analyzeStoryParagraphs(story);
    expect(result.totalParagraphs).toBe(2);
    expect(result.averageWordsPerParagraph).toBe(5);
    expect(result.longestParagraphWords).toBe(5);
  });
});
