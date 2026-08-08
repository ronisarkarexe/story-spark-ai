import { describe, it, expect } from 'vitest';
import { analyzeParagraphStructure } from '../storyParagraphStructureAnalyzer';

describe('storyParagraphStructureAnalyzer utility', () => {
  it('should return score 100 for empty string input', () => {
    const result = analyzeParagraphStructure('');
    expect(result.structureScore).toBe(100);
    expect(result.pacingAdvice).toBe('Empty story text.');
  });

  it('should analyze single and multi-paragraph stories correctly', () => {
    const single = analyzeParagraphStructure('Single paragraph story text.');
    expect(single.structureScore).toBe(70);

    const multi = analyzeParagraphStructure('Para 1.\n\nPara 2.');
    expect(multi.structureScore).toBe(85);
  });
});
