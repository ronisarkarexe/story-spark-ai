import { describe, it, expect } from 'vitest';
import { calculateStoryDialogueRatio } from '../storyDialogueRatioAnalyzer';

describe('storyDialogueRatioAnalyzer utility', () => {
  it('should return Narrative Heavy for empty string input', () => {
    const result = calculateStoryDialogueRatio('');
    expect(result.dialoguePercentage).toBe(0);
    expect(result.balanceCategory).toBe('Narrative Heavy');
  });

  it('should detect Dialogue Heavy for text dominated by quotes', () => {
    const text = '"Hello!" "How are you doing today?" "I am doing well, thank you!"';
    const result = calculateStoryDialogueRatio(text);
    expect(result.balanceCategory).toBe('Dialogue Heavy');
  });
});
