// backend/src/utils/tests/contentModeration.test.ts
import { checkContent, assertContentSafe } from '../contentModeration';

describe('Content Moderation Utility', () => {
  describe('checkContent()', () => {
    it('should return { blocked: false } for safe text', () => {
      const safeTexts = [
        'Hello, how are you today?',
        'This is a friendly message about coding.',
        'I love programming and open source!',
        'The weather is nice today.',
        "Let's collaborate on this project together.",
      ];

      for (const text of safeTexts) {
        const result = checkContent(text);
        expect(result).toEqual({ blocked: false });
      }
    });

    it('should return { blocked: true, reason: "csam" } for CSAM patterns', () => {
      const csamTexts = [
        'child porn is bad',
        'underage sex content',
        'minor sexual abuse',
        'child exploitation material',
      ];

      for (const text of csamTexts) {
        const result = checkContent(text);
        expect(result.blocked).toBe(true);
        expect(result.reason).toBe('csam');
      }
    });

    it('should return { blocked: true, reason: "hateSpeech" } for hate speech patterns', () => {
      const hateTexts = [
        'racial slur against black people',
        'white supremacy is wrong',
        'antisemitic hate speech',
        'homophobic comments',
      ];

      for (const text of hateTexts) {
        const result = checkContent(text);
        expect(result.blocked).toBe(true);
        expect(result.reason).toBe('hateSpeech');
      }
    });

    it('should return { blocked: true, reason: "violence" } for violence patterns', () => {
      const violenceTexts = [
        'kill all people in the building',
        'shoot the school',
        'bomb the city',
        'massacre the crowd',
      ];

      for (const text of violenceTexts) {
        const result = checkContent(text);
        expect(result.blocked).toBe(true);
        expect(result.reason).toBe('violence');
      }
    });

    it('should return { blocked: true, reason: "selfHarm" } for self-harm patterns', () => {
      const selfHarmTexts = [
        'I want to kill myself',
        'self harm is a problem',
        'cutting my wrist',
        'suicide is not the answer',
      ];

      for (const text of selfHarmTexts) {
        const result = checkContent(text);
        expect(result.blocked).toBe(true);
        expect(result.reason).toBe('selfHarm');
      }
    });

    it('should return { blocked: false } for empty string', () => {
      const result = checkContent('');
      expect(result).toEqual({ blocked: false });
    });

    it('should return { blocked: false } for whitespace-only string', () => {
      const result = checkContent('   ');
      expect(result).toEqual({ blocked: false });
    });

    it('should be case-insensitive', () => {
      const result = checkContent('CHILD PORN IS BAD');
      expect(result.blocked).toBe(true);
      expect(result.reason).toBe('csam');
    });

    it('should handle special characters and punctuation', () => {
      const result = checkContent('Child porn! Is this? Bad!');
      expect(result.blocked).toBe(true);
      expect(result.reason).toBe('csam');
    });

    it('should not block safe text with partial matches', () => {
      const safeTexts = [
        'The child was playing in the park.',
        'I like black coffee.',
        'White chocolate is my favorite.',
        'The school is closed today.',
        'I will not kill this project.',
      ];

      for (const text of safeTexts) {
        const result = checkContent(text);
        expect(result.blocked).toBe(false);
      }
    });
  });

  describe('assertContentSafe()', () => {
    it('should not throw for safe text', () => {
      const safeTexts = [
        'Hello, how are you?',
        "Let's work together on this project.",
        'Thank you for your contribution.',
      ];

      for (const text of safeTexts) {
        expect(() => assertContentSafe(text)).not.toThrow();
      }
    });

    it('should throw Error with reason for blocked content', () => {
      const blockedTexts = [
        { text: 'child porn', expectedReason: 'csam' },
        { text: 'racial hate speech', expectedReason: 'hateSpeech' },
        { text: 'kill all people', expectedReason: 'violence' },
        { text: 'kill myself', expectedReason: 'selfHarm' },
      ];

      for (const { text, expectedReason } of blockedTexts) {
        expect(() => assertContentSafe(text)).toThrow(`Content blocked: ${expectedReason}`);
      }
    });

    it('should not throw for empty string', () => {
      expect(() => assertContentSafe('')).not.toThrow();
    });

    it('should not throw for whitespace-only string', () => {
      expect(() => assertContentSafe('   ')).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long text', () => {
      const longText = 'A'.repeat(10000) + 'child porn' + 'A'.repeat(10000);
      const result = checkContent(longText);
      expect(result.blocked).toBe(true);
      expect(result.reason).toBe('csam');
    });

    it('should handle text with mixed casing', () => {
      const result = checkContent('cHiLd PoRn Is BaD');
      expect(result.blocked).toBe(true);
      expect(result.reason).toBe('csam');
    });

    it('should handle text with newlines', () => {
      const result = checkContent('child\nporn\nis\nbad');
      expect(result.blocked).toBe(true);
      expect(result.reason).toBe('csam');
    });
  });
});