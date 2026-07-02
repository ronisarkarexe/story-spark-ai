import { stripHtmlTags, truncate, normalizeWhitespace } from '../sanitization';

describe('Sanitization Helpers', () => {
  describe('stripHtmlTags', () => {
    it('should return empty string for empty input', () => {
      expect(stripHtmlTags('')).toBe('');
      expect(stripHtmlTags(undefined as any)).toBe('');
    });

    it('should remove complete HTML tags', () => {
      expect(stripHtmlTags('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
      expect(stripHtmlTags('<div>Test</div>')).toBe('Test');
    });

    it('should remove incomplete tag openers', () => {
      expect(stripHtmlTags('Hello <script src="malicious.js"')).toBe('Hello');
      expect(stripHtmlTags('<img src="x" onerror="alert(1)"')).toBe('');
    });

    it('should remove standalone less-than characters that look tag-like', () => {
      expect(stripHtmlTags('value < 5')).toBe('value');
    });

    it('should trim whitespace around the final string', () => {
      expect(stripHtmlTags('   <span>   hello   </span>   ')).toBe('hello');
    });
  });

  describe('truncate', () => {
    it('should return empty string for empty input', () => {
      expect(truncate('', 10)).toBe('');
      expect(truncate(undefined as any, 10)).toBe('');
    });

    it('should return the original string if it is shorter than maxLength', () => {
      expect(truncate('hello', 10)).toBe('hello');
      expect(truncate('hello', 5)).toBe('hello');
    });

    it('should truncate and append suffix if length exceeds maxLength', () => {
      expect(truncate('hello world', 8)).toBe('hello...');
      expect(truncate('hello world', 5)).toBe('he...');
    });

    it('should respect custom suffixes', () => {
      expect(truncate('hello world', 8, '!')).toBe('hello w!');
    });
  });

  describe('normalizeWhitespace', () => {
    it('should return empty string for empty input', () => {
      expect(normalizeWhitespace('')).toBe('');
      expect(normalizeWhitespace(undefined as any)).toBe('');
    });

    it('should collapse multiple spaces into a single space', () => {
      expect(normalizeWhitespace('hello     world')).toBe('hello world');
    });

    it('should collapse tabs and newlines', () => {
      expect(normalizeWhitespace('hello\n\tworld\r\nagain')).toBe('hello world again');
    });

    it('should trim leading and trailing whitespace', () => {
      expect(normalizeWhitespace('   hello world   ')).toBe('hello world');
    });
  });
});
