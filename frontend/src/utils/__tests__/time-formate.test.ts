import { describe, it, expect } from 'vitest';
import { timeAgo, formatDateShort } from '../time-formate';

describe('time-formate utility', () => {
  it('should return just now for empty or future date input', () => {
    expect(timeAgo('')).toBe('just now');
  });

  it('should format date string into short format', () => {
    const formatted = formatDateShort('2026-01-15T00:00:00Z');
    expect(formatted).toContain('2026');
  });
});
