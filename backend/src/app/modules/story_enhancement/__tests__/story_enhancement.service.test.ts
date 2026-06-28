import { Test, TestingModule } from '@nestjs/testing';
import { StoryEnhancementService } from '../story_enhancement.service';

describe('StoryEnhancementService', () => {
  let service: StoryEnhancementService;
  const baseStory =
    'The hero walked to the store. He was happy. It was a beautiful day.';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoryEnhancementService],
    }).compile();

    service = module.get<StoryEnhancementService>(StoryEnhancementService);
  });

  describe('applyStyleTransfer', () => {
    it('should convert casual to formal style', () => {
      const result = service.applyStyleTransfer({
        story: "You gotta wanna go, kinda nice.",
        style: 'formal',
      });

      expect(result.toLowerCase()).toContain('one');
      expect(result).not.toContain('gotta');
      expect(result).not.toContain('wanna');
    });

    it('should convert formal to casual style', () => {
      const result = service.applyStyleTransfer({
        story: 'One must desire to proceed.',
        style: 'casual',
      });

      expect(result.toLowerCase()).toContain('you');
      expect(result).not.toContain('one');
    });

    it('should apply poetic style', () => {
      const result = service.applyStyleTransfer({
        story: baseStory,
        style: 'poetic',
      });

      expect(result.length > 0).toBe(true);
      expect(typeof result).toBe('string');
    });

    it('should apply dark theme style', () => {
      const result = service.applyStyleTransfer({
        story: baseStory,
        style: 'dark',
      });

      expect(result.toLowerCase()).toContain('shadow');
      expect(result.toLowerCase()).toContain('darkness');
    });

    it('should apply humorous style', () => {
      const result = service.applyStyleTransfer({
        story: 'He walked and smiled.',
        style: 'humorous',
      });

      expect(result).toContain('grinned sheepishly');
      expect(result).toContain('awkwardly shuffled');
    });
  });

  describe('adaptTone', () => {
    it('should convert to serious tone', () => {
      const result = service.adaptTone({
        story: baseStory + '!',
        tone: 'serious',
      });

      expect(result).not.toContain('!');
      expect(result).toContain('.');
    });

    it('should convert to lighthearted tone', () => {
      const result = service.adaptTone({
        story: baseStory,
        tone: 'lighthearted',
      });

      expect(result).toContain('!');
    });

    it('should convert to dramatic tone', () => {
      const result = service.adaptTone({
        story: baseStory,
        tone: 'dramatic',
      });

      expect(result.length > 0).toBe(true);
    });

    it('should convert to mysterious tone', () => {
      const result = service.adaptTone({
        story: baseStory,
        tone: 'mysterious',
      });

      expect(result).toContain('..');
    });

    it('should convert to inspiring tone', () => {
      const result = service.adaptTone({
        story: 'He failed but managed to continue.',
        tone: 'inspiring',
      });

      expect(result).toContain('challenge');
      expect(result).toContain('persevered');
    });

    it('should replace problem vocabulary', () => {
      const result = service.adaptTone({
        story: 'The problem was solved.',
        tone: 'inspiring',
      });

      expect(result).toContain('challenge');
    });
  });

  describe('enhanceStory', () => {
    it('should apply both style and tone', () => {
      const result = service.enhanceStory(
        baseStory,
        'formal',
        'serious',
      );

      expect(result.original).toBe(baseStory);
      expect(result.enhanced).not.toBe(baseStory);
      expect(result.style).toBe('formal');
      expect(result.tone).toBe('serious');
    });

    it('should handle multiple style and tone combinations', () => {
      const styles = ['formal', 'casual', 'poetic', 'dark', 'humorous'];
      const tones = ['serious', 'lighthearted', 'dramatic', 'mysterious', 'inspiring'];

      styles.forEach((style) => {
        tones.forEach((tone) => {
          const result = service.enhanceStory(baseStory, style, tone);
          expect(result.enhanced).toBeDefined();
          expect(result.style).toBe(style);
          expect(result.tone).toBe(tone);
        });
      });
    });

    it('should preserve story length approximately', () => {
      const result = service.enhanceStory(
        baseStory,
        'casual',
        'lighthearted',
      );

      const originalLength = baseStory.length;
      const enhancedLength = result.enhanced.length;

      // Allow 20% variance
      expect(enhancedLength).toBeGreaterThan(originalLength * 0.8);
      expect(enhancedLength).toBeLessThan(originalLength * 1.5);
    });

    it('should not lose content', () => {
      const result = service.enhanceStory(
        'The quick brown fox',
        'formal',
        'serious',
      );

      expect(result.enhanced).toBeTruthy();
      expect(result.enhanced.length > 0).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty story', () => {
      const result = service.applyStyleTransfer({
        story: '',
        style: 'formal',
      });

      expect(result).toBe('');
    });

    it('should handle story with special characters', () => {
      const storyWithSpecialChars =
        "He said, \"Hello!\" She replied, \"Hi there.\"";
      const result = service.enhanceStory(
        storyWithSpecialChars,
        'casual',
        'lighthearted',
      );

      expect(result.enhanced).toBeTruthy();
    });

    it('should be case-insensitive for replacements', () => {
      const result = service.applyStyleTransfer({
        story: 'YOU GOTTA GO. you gotta go.',
        style: 'formal',
      });

      expect(result).not.toContain('GOTTA');
      expect(result).not.toContain('gotta');
    });
  });
});
