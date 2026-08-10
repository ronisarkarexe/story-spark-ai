import { describe, it, expect } from 'vitest';
import { generateStoryTitleOptions, regenerateStoryTitles } from '../storyTitleABComparison';

describe('storyTitleABComparison', () => {
  it('should return empty array when story text is empty or whitespace', () => {
    expect(generateStoryTitleOptions('')).toEqual([]);
    expect(generateStoryTitleOptions('   \n\t ')).toEqual([]);
    expect(regenerateStoryTitles('')).toEqual([]);
  });

  it('should generate story title options for valid story input', () => {
    const story = 'Once upon a time in a galaxy far away...';
    const options = generateStoryTitleOptions(story);

    expect(options.length).toBeGreaterThan(0);
    expect(options[0]).toHaveProperty('id');
    expect(options[0]).toHaveProperty('title');
    expect(options[0]).toHaveProperty('creativity');
    expect(options[0]).toHaveProperty('relevance');
    expect(options[0]).toHaveProperty('memorability');
    expect(options[0]).toHaveProperty('emotionalAppeal');
    expect(options[0]).toHaveProperty('feedback');
  });

  it('should produce identical results for regenerateStoryTitles', () => {
    const story = 'A hero begins an unexpected journey.';
    const options1 = generateStoryTitleOptions(story);
    const options2 = regenerateStoryTitles(story);

    expect(options1).toEqual(options2);
  });
});
