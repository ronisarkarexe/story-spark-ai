export type StoryStyle = 'literary' | 'casual' | 'poetic' | 'technical' | 'children' | 'noir' | 'romantic' | 'adventure';

interface StyleCharacteristics {
  vocabulary: 'formal' | 'informal' | 'mixed';
  sentenceLength: 'short' | 'medium' | 'long' | 'varied';
  narrativeTechnique: 'first' | 'second' | 'third' | 'mixed';
  description: string;
  emotionalTone: string;
  examples: string[];
}

interface StyleTransferResult {
  original: string;
  transformed: string;
  style: StoryStyle;
  metadata: {
    wordCountBefore: number;
    wordCountAfter: number;
    sentenceCountBefore: number;
    sentenceCountAfter: number;
    processingTime: number;
  };
}

export class StyleTransferEngine {
  private styles: Map<StoryStyle, StyleCharacteristics> = new Map();
  private transformationCache: Map<string, StyleTransferResult> = new Map();

  constructor() {
    this.initializeStyles();
  }

  private initializeStyles(): void {
    this.styles.set('literary', {
      vocabulary: 'formal',
      sentenceLength: 'varied',
      narrativeTechnique: 'third',
      description: 'Sophisticated, academic tone with complex sentence structures',
      emotionalTone: 'Contemplative and reflective',
      examples: ['The inexorable march of time pressed upon her weary soul'],
    });

    this.styles.set('casual', {
      vocabulary: 'informal',
      sentenceLength: 'short',
      narrativeTechnique: 'first',
      description: 'Conversational, friendly tone with simple sentences',
      emotionalTone: 'Approachable and relatable',
      examples: ['So there I was, totally stuck without a clue'],
    });

    this.styles.set('poetic', {
      vocabulary: 'formal',
      sentenceLength: 'varied',
      narrativeTechnique: 'mixed',
      description: 'Lyrical and rhythmic with vivid imagery',
      emotionalTone: 'Evocative and dreamy',
      examples: ['Moonlight danced through whispered leaves like silver gossip'],
    });

    this.styles.set('technical', {
      vocabulary: 'formal',
      sentenceLength: 'medium',
      narrativeTechnique: 'third',
      description: 'Precise and informative with structured sentences',
      emotionalTone: 'Objective and analytical',
      examples: ['The system architecturecomprises three discrete modules'],
    });

    this.styles.set('children', {
      vocabulary: 'informal',
      sentenceLength: 'short',
      narrativeTechnique: 'third',
      description: 'Simple, playful language with imaginative elements',
      emotionalTone: 'Joyful and wonderful',
      examples: ['Once upon a time, there was a tiny dragon'],
    });

    this.styles.set('noir', {
      vocabulary: 'formal',
      sentenceLength: 'short',
      narrativeTechnique: 'first',
      description: 'Dark, cynical tone with hardboiled dialogue',
      emotionalTone: 'Gritty and mysterious',
      examples: ['The rain fell like bullets on the city streets'],
    });

    this.styles.set('romantic', {
      vocabulary: 'formal',
      sentenceLength: 'long',
      narrativeTechnique: 'third',
      description: 'Emotional and passionate with focus on feelings',
      emotionalTone: 'Tender and passionate',
      examples: ['Their hearts found each other across the crowded room'],
    });

    this.styles.set('adventure', {
      vocabulary: 'mixed',
      sentenceLength: 'varied',
      narrativeTechnique: 'third',
      description: 'Action-packed and exciting with dynamic pacing',
      emotionalTone: 'Thrilling and energetic',
      examples: ['The cavern erupted in chaos as the ground shook violently'],
    });
  }

  transferStyle(story: string, targetStyle: StoryStyle): StyleTransferResult {
    const startTime = Date.now();
    const cacheKey = `${story.substring(0, 100)}_${targetStyle}`;

    if (this.transformationCache.has(cacheKey)) {
      const cached = this.transformationCache.get(cacheKey);
      if (cached) return cached;
    }

    const wordCountBefore = this.countWords(story);
    const sentenceCountBefore = this.countSentences(story);

    const transformed = this.applyStyleTransformation(story, targetStyle);

    const wordCountAfter = this.countWords(transformed);
    const sentenceCountAfter = this.countSentences(transformed);

    const result: StyleTransferResult = {
      original: story,
      transformed,
      style: targetStyle,
      metadata: {
        wordCountBefore,
        wordCountAfter,
        sentenceCountBefore,
        sentenceCountAfter,
        processingTime: Date.now() - startTime,
      },
    };

    this.transformationCache.set(cacheKey, result);
    return result;
  }

  private applyStyleTransformation(story: string, targetStyle: StoryStyle): string {
    const characteristics = this.styles.get(targetStyle);
    if (!characteristics) {
      throw new Error(`Unknown style: ${targetStyle}`);
    }

    let transformed = story;

    if (characteristics.vocabulary === 'formal') {
      transformed = this.makeMoreFormal(transformed);
    } else if (characteristics.vocabulary === 'informal') {
      transformed = this.makeMoreCasual(transformed);
    }

    if (characteristics.sentenceLength === 'short') {
      transformed = this.shortenSentences(transformed);
    } else if (characteristics.sentenceLength === 'long') {
      transformed = this.lengthenSentences(transformed);
    }

    if (characteristics.narrativeTechnique === 'first') {
      transformed = this.convertToFirstPerson(transformed);
    } else if (characteristics.narrativeTechnique === 'third') {
      transformed = this.convertToThirdPerson(transformed);
    }

    return transformed;
  }

  private makeMoreFormal(text: string): string {
    const replacements: Record<string, string> = {
      gonna: 'going to',
      wanna: 'want to',
      cant: 'cannot',
      dont: 'do not',
      shouldnt: 'should not',
      wasnt: 'was not',
      isnt: 'is not',
      arent: 'are not',
      theres: 'there is',
      thats: 'that is',
      its: 'it is',
      wheres: 'where is',
    };

    let result = text;
    for (const [informal, formal] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${informal}\\b`, 'gi');
      result = result.replace(regex, formal);
    }

    return result;
  }

  private makeMoreCasual(text: string): string {
    const replacements: Record<string, string> = {
      'going to': 'gonna',
      'want to': 'wanna',
      'cannot': 'can\'t',
      'do not': 'don\'t',
      'should not': 'shouldn\'t',
      'was not': 'wasn\'t',
      'is not': 'isn\'t',
      'are not': 'aren\'t',
    };

    let result = text;
    for (const [formal, casual] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${formal}\\b`, 'gi');
      result = result.replace(regex, casual);
    }

    return result;
  }

  private shortenSentences(text: string): string {
    const sentences = text.split(/(?<=[.!?])\s+/);
    return sentences
      .map((sentence) => {
        if (sentence.length > 100) {
          const clauses = sentence.split(/,|;/);
          return clauses.map((c) => c.trim()).join('. ');
        }
        return sentence;
      })
      .join(' ');
  }

  private lengthenSentences(text: string): string {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const lengthened: string[] = [];

    for (let i = 0; i < sentences.length; i += 2) {
      if (i + 1 < sentences.length) {
        lengthened.push(
          sentences[i].replace(/[.!?]$/, ',') + ' ' + sentences[i + 1]
        );
      } else {
        lengthened.push(sentences[i]);
      }
    }

    return lengthened.join(' ');
  }

  private convertToFirstPerson(text: string): string {
    const replacements: Record<string, string> = {
      'The character': 'I',
      'He ': 'I ',
      'She ': 'I ',
      'They ': 'We ',
      'The protagonist': 'I',
    };

    let result = text;
    for (const [original, replacement] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${original}\\b`, 'g');
      result = result.replace(regex, replacement);
    }

    return result;
  }

  private convertToThirdPerson(text: string): string {
    const replacements: Record<string, string> = {
      'I ': 'The protagonist ',
      'We ': 'They ',
      'my ': 'their ',
      'me ': 'them ',
      'our ': 'their ',
    };

    let result = text;
    for (const [original, replacement] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${original}\\b`, 'gi');
      result = result.replace(regex, replacement);
    }

    return result;
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  private countSentences(text: string): number {
    return (text.match(/[.!?]/g) || []).length;
  }

  getAvailableStyles(): Array<{ style: StoryStyle; characteristics: StyleCharacteristics }> {
    return Array.from(this.styles.entries()).map(([style, characteristics]) => ({
      style,
      characteristics,
    }));
  }

  clearCache(): void {
    this.transformationCache.clear();
  }

  getCacheSize(): number {
    return this.transformationCache.size;
  }
}

export const styleTransferEngine = new StyleTransferEngine();
