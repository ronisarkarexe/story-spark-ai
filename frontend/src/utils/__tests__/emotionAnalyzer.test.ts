import { describe, it, expect } from 'vitest';
import { analyzeEmotionJourney } from '../emotionAnalyzer';

describe('analyzeEmotionJourney', () => {
  it('should return empty array for empty string', () => {
    const result = analyzeEmotionJourney('');
    expect(result).toEqual([]);
  });

  it('should return empty array for whitespace-only string', () => {
    const result = analyzeEmotionJourney('   \n\n   ');
    expect(result).toEqual([]);
  });

  it('should return one scene for text without paragraph breaks', () => {
    const result = analyzeEmotionJourney('This is a happy story.');
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ scene: 1 });
  });

  it('should count joy keywords in a scene', () => {
    const result = analyzeEmotionJourney('She felt happy and wanted to smile and laugh and celebrate.');
    expect(result[0].joy).toBeGreaterThan(0);
  });

  it('should count fear keywords in a scene', () => {
    const result = analyzeEmotionJourney('Dark fear the monster was terrifying.');
    expect(result[0].fear).toBeGreaterThan(0);
  });

  it('should count sadness keywords in a scene', () => {
    const result = analyzeEmotionJourney('She began to cry and felt sad grief.');
    expect(result[0].sadness).toBeGreaterThan(0);
  });

  it('should count anger keywords in a scene', () => {
    const result = analyzeEmotionJourney('He was angry and full of rage and wanted to fight.');
    expect(result[0].anger).toBeGreaterThan(0);
  });

  it('should count hope keywords in a scene', () => {
    const result = analyzeEmotionJourney('She hoped to dream and believe in the future.');
    expect(result[0].hope).toBeGreaterThan(0);
  });

  it('should count suspense keywords in a scene', () => {
    const result = analyzeEmotionJourney('Suddenly a mystery secret was revealed.');
    expect(result[0].suspense).toBeGreaterThan(0);
  });

  it('should return zero counts when no emotion keywords are present', () => {
    const result = analyzeEmotionJourney('The cat sat on the mat.');
    expect(result[0].joy).toBe(0);
    expect(result[0].fear).toBe(0);
    expect(result[0].sadness).toBe(0);
    expect(result[0].anger).toBe(0);
    expect(result[0].hope).toBe(0);
    expect(result[0].suspense).toBe(0);
  });

  it('should split text by paragraph breaks into multiple scenes', () => {
    const text = 'Happy smile.\n\nDark fear.\n\nCry sad.';
    const result = analyzeEmotionJourney(text);
    expect(result).toHaveLength(3);
  });

  it('should be case insensitive', () => {
    const lower = analyzeEmotionJourney('happy smile');
    const upper = analyzeEmotionJourney('HAPPY SMILE');
    expect(upper[0].joy).toBe(lower[0].joy);
  });

  it('should count multiple occurrences of the same keyword', () => {
    const result = analyzeEmotionJourney('happy happy happy');
    expect(result[0].joy).toBe(3);
  });
});
