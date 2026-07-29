import { describe, test, expect } from 'vitest';
import { truncateText } from './truncateText';

describe('truncateText utility', () => {
  test('should return original text if length is within maxLength', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
    expect(truncateText('Hello', 5)).toBe('Hello');
  });

  test('should truncate text and append default suffix', () => {
    expect(truncateText('Learn JavaScript today', 12)).toBe('Learn...');
  });

  test('should respect word boundaries and avoid cutting words', () => {
    expect(truncateText('Learn JavaScript', 11)).toBe('Learn...');
  });

  test('should support a custom suffix', () => {
    expect(truncateText('Read more of this story', 14, '---')).toBe('Read more---');
  });

  test('should truncate suffix if maxLength is smaller than suffix length', () => {
    expect(truncateText('Long Text', 2, '...')).toBe('..');
  });
});