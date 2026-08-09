import { describe, it, expect } from 'vitest';
import { normalizeWhitespace } from '../sanitization';

describe('normalizeWhitespace', () => {
  it('collapses multiple spaces into a single space', () => {
    expect(normalizeWhitespace('hello    world')).toBe('hello world');
  });

  it('collapses tabs into a single space', () => {
    expect(normalizeWhitespace('hello\tworld')).toBe('hello world');
  });

  it('collapses newlines into a single space', () => {
    expect(normalizeWhitespace('hello\nworld')).toBe('hello world');
  });

  it('collapses mixed whitespace characters', () => {
    expect(normalizeWhitespace('  hello   \t\n  world  \t\n')).toBe('hello world');
  });

  it('trims leading whitespace', () => {
    expect(normalizeWhitespace('   hello world')).toBe('hello world');
  });

  it('trims trailing whitespace', () => {
    expect(normalizeWhitespace('hello world   ')).toBe('hello world');
  });

  it('returns empty string for empty input', () => {
    expect(normalizeWhitespace('')).toBe('');
  });

  it('returns empty string for null input', () => {
    expect(normalizeWhitespace(null as any)).toBe('');
  });

  it('returns empty string for undefined input', () => {
    expect(normalizeWhitespace(undefined as any)).toBe('');
  });

  it('returns empty string for whitespace-only string', () => {
    expect(normalizeWhitespace('   \t\n   ')).toBe('');
  });

  it('returns a single character string unchanged', () => {
    expect(normalizeWhitespace('a')).toBe('a');
  });

  it('returns a string with no whitespace unchanged', () => {
    expect(normalizeWhitespace('helloworld')).toBe('helloworld');
  });

  it('handles a string with a single space', () => {
    expect(normalizeWhitespace(' ')).toBe('');
  });

  it('handles multiple consecutive tabs and spaces', () => {
    expect(normalizeWhitespace('hello\t\t\t\tworld')).toBe('hello world');
  });
});
