import { describe, it, expect } from 'vitest';
import { getSeverityClasses } from './StoryConsistencyGuardian';

describe('StoryConsistencyGuardian severity styling', () => {
  it('returns the known class string for high severity', () => {
    expect(getSeverityClasses('high')).toBe('bg-red-500/10 border-red-500/30 text-red-400');
  });

  it('returns the known class string for medium severity', () => {
    expect(getSeverityClasses('medium')).toBe('bg-yellow-500/10 border-yellow-500/30 text-yellow-400');
  });

  it('returns the default class string for unknown severity values', () => {
    expect(getSeverityClasses('critical')).toBe('border-white/10 bg-white/5 text-white');
  });

  it('returns the default class string for missing severity values', () => {
    expect(getSeverityClasses(undefined)).toBe('border-white/10 bg-white/5 text-white');
  });
});
