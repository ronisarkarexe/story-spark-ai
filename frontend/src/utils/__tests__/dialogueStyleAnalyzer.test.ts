import { describe, it, expect } from 'vitest';
import { analyzeDialogue } from '../dialogueStyleAnalyzer';

describe('dialogueStyleAnalyzer', () => {
  it('should return character dialogue analysis array', () => {
    const storyText = 'Alice said hello. John replied with a quiet smile.';
    const analysis = analyzeDialogue(storyText);

    expect(Array.isArray(analysis)).toBe(true);
    expect(analysis.length).toBe(3);
    expect(analysis[0]).toHaveProperty('character', 'Alice');
    expect(analysis[0]).toHaveProperty('uniquenessScore');
    expect(analysis[0]).toHaveProperty('vocabularyStyle');
    expect(analysis[0]).toHaveProperty('speechPattern');
    expect(analysis[0]).toHaveProperty('suggestions');
  });

  it('should return valid uniqueness scores between 65 and 100', () => {
    const analysis = analyzeDialogue('A sample narrative text.');
    analysis.forEach((item) => {
      expect(item.uniquenessScore).toBeGreaterThanOrEqual(65);
      expect(item.uniquenessScore).toBeLessThanOrEqual(100);
    });
  });
});
