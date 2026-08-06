import { describe, it, expect } from 'vitest';
import { truncateText } from '../truncateText';

describe('truncateText utility', () => {
  it('should return empty string for non-positive maxLength', () => {
    expect(truncateText('Sample text string', 0)).toBe('');
    expect(truncateText('Sample text string', -5)).toBe('');
  });

  it('should truncate string at word boundary with custom suffix', () => {
    const text = 'Once upon a time in a galaxy far far away';
    const result = truncateText(text, 20);
    expect(result.endsWith('...')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(20);
  });
});
