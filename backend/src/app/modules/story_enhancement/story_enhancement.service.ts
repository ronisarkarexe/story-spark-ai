import { Injectable } from '@nestjs/common';

export interface StyleTransferRequest {
  story: string;
  style: 'formal' | 'casual' | 'poetic' | 'dark' | 'humorous';
}

export interface ToneAdaptationRequest {
  story: string;
  tone: 'serious' | 'lighthearted' | 'dramatic' | 'mysterious' | 'inspiring';
}

export interface EnhancementResult {
  original: string;
  enhanced: string;
  style: string;
  tone: string;
}

@Injectable()
export class StoryEnhancementService {
  /**
   * Apply style transfer to story text
   */
  applyStyleTransfer(request: StyleTransferRequest): string {
    const stylePatterns = {
      formal: {
        replacements: [
          { regex: /\byou\b/gi, replacement: 'one' },
          { regex: /\bgotta\b/gi, replacement: 'must' },
          { regex: /\bwanna\b/gi, replacement: 'desire to' },
          { regex: /\bkinda\b/gi, replacement: 'somewhat' },
        ],
        punctuation: (text: string) => text.replace(/([.!?])\s+/g, '$1 '),
      },
      casual: {
        replacements: [
          { regex: /\bone\b/gi, replacement: 'you' },
          { regex: /\bmust\b/gi, replacement: 'gotta' },
        ],
        punctuation: (text: string) => text.replace(/\.\s+/g, '. '),
      },
      poetic: {
        replacements: [
          { regex: /\bthe\b/gi, replacement: '' },
          { regex: /\band\b/gi, replacement: '&' },
        ],
        punctuation: (text: string) => text.replace(/([,.])\s+/g, '$1\n'),
        enhancement: (text: string) => this.addPoetryAffectations(text),
      },
      dark: {
        replacements: [
          { regex: /\bhappy\b/gi, replacement: 'hollow' },
          { regex: /\bbeautiful\b/gi, replacement: 'haunting' },
          { regex: /\bright\b/gi, replacement: 'shadow' },
        ],
        enhancement: (text: string) => this.addDarkTheme(text),
      },
      humorous: {
        replacements: [
          { regex: /\bvery\b/gi, replacement: 'ridiculously' },
          { regex: /\bamazingly\b/gi, replacement: 'hilariously' },
        ],
        enhancement: (text: string) => this.addHumor(text),
      },
    };

    let enhanced = request.story;
    const pattern = stylePatterns[request.style];

    if (pattern.replacements) {
      pattern.replacements.forEach(({ regex, replacement }) => {
        enhanced = enhanced.replace(regex, replacement);
      });
    }

    if (pattern.punctuation) {
      enhanced = pattern.punctuation(enhanced);
    }

    if (pattern.enhancement) {
      enhanced = pattern.enhancement(enhanced);
    }

    return enhanced;
  }

  /**
   * Apply tone adaptation to story text
   */
  adaptTone(request: ToneAdaptationRequest): string {
    const tonePatterns = {
      serious: {
        prefixes: ['Therefore, ', 'Notably, ', 'In fact, '],
        punctuation: (text: string) => text.replace(/!/g, '.'),
        vocabulary: (text: string) =>
          text
            .replace(/\bamazing\b/gi, 'remarkable')
            .replace(/\bcool\b/gi, 'interesting'),
      },
      lighthearted: {
        prefixes: ['Well, ', 'You see, ', 'Interestingly, '],
        punctuation: (text: string) => text.replace(/\./g, '!'),
        vocabulary: (text: string) =>
          text
            .replace(/\bproblem\b/gi, 'hiccup')
            .replace(/\bfailure\b/gi, 'mishap'),
      },
      dramatic: {
        prefixes: ['Suddenly, ', 'In that moment, ', 'Fate had decided... '],
        punctuation: (text: string) => text.replace(/\.\s+/g, '... '),
        enhancement: (text: string) => this.addDramaticTension(text),
      },
      mysterious: {
        prefixes: ['Perhaps, ', 'As if by fate, ', 'Unknown to many, '],
        punctuation: (text: string) => text.replace(/([.!?])/g, '$1..'),
        enhancement: (text: string) => this.addMysteryElements(text),
      },
      inspiring: {
        prefixes: ['Beyond doubt, ', 'In triumph, ', 'Against all odds, '],
        vocabulary: (text: string) =>
          text
            .replace(/\bproblem\b/gi, 'challenge')
            .replace(/\bfailed\b/gi, 'persevered'),
        enhancement: (text: string) => this.addInspiration(text),
      },
    };

    let enhanced = request.story;
    const pattern = tonePatterns[request.tone];

    if (pattern.vocabulary) {
      enhanced = pattern.vocabulary(enhanced);
    }

    if (pattern.punctuation) {
      enhanced = pattern.punctuation(enhanced);
    }

    if (pattern.enhancement) {
      enhanced = pattern.enhancement(enhanced);
    }

    return enhanced;
  }

  /**
   * Apply both style transfer and tone adaptation
   */
  enhanceStory(
    story: string,
    style: string,
    tone: string,
  ): EnhancementResult {
    let enhanced = this.applyStyleTransfer({
      story,
      style: style as any,
    });

    enhanced = this.adaptTone({
      story: enhanced,
      tone: tone as any,
    });

    return {
      original: story,
      enhanced,
      style,
      tone,
    };
  }

  private addPoetryAffectations(text: string): string {
    return text
      .split(/([.!?])/g)
      .map((part, i) => (i % 2 === 0 && part.trim() ? `"${part.trim()}"` : part))
      .join('');
  }

  private addDarkTheme(text: string): string {
    return text
      .replace(/sun/gi, 'darkness')
      .replace(/light/gi, 'shadow')
      .replace(/hope/gi, 'despair');
  }

  private addHumor(text: string): string {
    return text
      .replace(/sighed/gi, 'let out an exasperated sigh')
      .replace(/smiled/gi, 'grinned sheepishly')
      .replace(/walked/gi, 'awkwardly shuffled');
  }

  private addDramaticTension(text: string): string {
    const sentences = text.split(/([.!?])/g);
    return sentences
      .map((s, i) => {
        if (i % 2 === 0 && s.trim().length > 10) {
          return `${s.trim()}`;
        }
        return s;
      })
      .join('');
  }

  private addMysteryElements(text: string): string {
    return text
      .replace(/\b(he|she|it)\b/gi, (match) => `${match} (or was it?)`)
      .replace(/\b(then)\b/gi, 'subsequently');
  }

  private addInspiration(text: string): string {
    return text
      .replace(/finally/gi, 'triumphantly')
      .replace(/managed to/gi, 'heroically')
      .replace(/ended/gi, 'concluded victoriously');
  }
}
