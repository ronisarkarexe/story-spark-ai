import { describe, it, expect } from 'vitest';
import { formatPreview } from '../previewFormatter';

describe('previewFormatter utility', () => {
  it('should format preview for story data correctly', () => {
    const story = {
      title: 'Title',
      author: 'Author',
      content: 'First paragraph.\n\nSecond paragraph.',
    };
    const result = formatPreview(story);
    expect(result.paragraphs.length).toBe(2);
    expect(result.wordCount).toBe(4);
  });
});
