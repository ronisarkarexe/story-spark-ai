export type EmotionalTone = 'cheerful' | 'melancholic' | 'suspenseful' | 'calm' | 'dramatic' | 'humorous' | 'serious' | 'whimsical';

interface ToneCharacteristics {
  intensity: number;
  sentiment: number;
  description: string;
  emotionalCues: string[];
}

interface ToneAdaptationResult {
  original: string;
  adapted: string;
  tone: EmotionalTone;
  intensity: number;
  metadata: {
    emotionalShiftScore: number;
    cuesAdded: number;
    processingTime: number;
  };
}

export class ToneAdaptationEngine {
  private tones: Map<EmotionalTone, ToneCharacteristics> = new Map();
  private adaptationCache: Map<string, ToneAdaptationResult> = new Map();

  constructor() {
    this.initializeTones();
  }

  private initializeTones(): void {
    this.tones.set('cheerful', {
      intensity: 0.9,
      sentiment: 1.0,
      description: 'Uplifting, joyful, and optimistic',
      emotionalCues: [
        'bright',
        'glowed',
        'laughed',
        'gleamed',
        'wonderful',
        'beautiful',
        'sang',
        'danced',
      ],
    });

    this.tones.set('melancholic', {
      intensity: 0.7,
      sentiment: -0.8,
      description: 'Sad, pensive, and reflective',
      emotionalCues: [
        'sighed',
        'tears',
        'lonely',
        'faded',
        'forgotten',
        'heavy',
        'ache',
        'whispered',
      ],
    });

    this.tones.set('suspenseful', {
      intensity: 0.95,
      sentiment: 0.0,
      description: 'Tense, uncertain, and filled with anticipation',
      emotionalCues: [
        'lurked',
        'sudden',
        'darkness',
        'gasped',
        'peered',
        'trembled',
        'shadow',
        'waited',
      ],
    });

    this.tones.set('calm', {
      intensity: 0.3,
      sentiment: 0.5,
      description: 'Peaceful, serene, and tranquil',
      emotionalCues: [
        'gently',
        'soft',
        'peaceful',
        'quiet',
        'breeze',
        'serene',
        'tranquil',
        'still',
      ],
    });

    this.tones.set('dramatic', {
      intensity: 0.95,
      sentiment: -0.5,
      description: 'Intense, powerful, and emotionally charged',
      emotionalCues: [
        'crashed',
        'exploded',
        'roared',
        'shattered',
        'fury',
        'fierce',
        'vicious',
        'terrible',
      ],
    });

    this.tones.set('humorous', {
      intensity: 0.6,
      sentiment: 0.8,
      description: 'Light, funny, and entertaining',
      emotionalCues: [
        'grinned',
        'absurd',
        'ridiculous',
        'amusing',
        'comical',
        'snorted',
        'hilarious',
        'witty',
      ],
    });

    this.tones.set('serious', {
      intensity: 0.7,
      sentiment: -0.3,
      description: 'Grave, solemn, and important',
      emotionalCues: [
        'gravely',
        'solemnly',
        'grimly',
        'grave',
        'solemn',
        'weight',
        'burden',
        'dire',
      ],
    });

    this.tones.set('whimsical', {
      intensity: 0.6,
      sentiment: 0.9,
      description: 'Fanciful, playful, and imaginative',
      emotionalCues: [
        'sparkled',
        'magical',
        'enchanted',
        'whimsical',
        'fanciful',
        'delightful',
        'charming',
        'fantastical',
      ],
    });
  }

  adaptTone(story: string, targetTone: EmotionalTone, intensity: number = 1.0): ToneAdaptationResult {
    const startTime = Date.now();
    const cacheKey = `${story.substring(0, 100)}_${targetTone}_${intensity}`;

    if (this.adaptationCache.has(cacheKey)) {
      const cached = this.adaptationCache.get(cacheKey);
      if (cached) return cached;
    }

    const characteristics = this.tones.get(targetTone);
    if (!characteristics) {
      throw new Error(`Unknown tone: ${targetTone}`);
    }

    const emotionalShiftScore = this.calculateEmotionalShift(story, characteristics);
    let adapted = this.injectEmotionalCues(story, characteristics, intensity);
    adapted = this.adjustVocabulary(adapted, characteristics, intensity);
    adapted = this.adjustPacing(adapted, characteristics, intensity);

    const cuesAdded = this.countEmotionalCuesAdded(story, adapted);

    const result: ToneAdaptationResult = {
      original: story,
      adapted,
      tone: targetTone,
      intensity,
      metadata: {
        emotionalShiftScore,
        cuesAdded,
        processingTime: Date.now() - startTime,
      },
    };

    this.adaptationCache.set(cacheKey, result);
    return result;
  }

  private calculateEmotionalShift(story: string, characteristics: ToneCharacteristics): number {
    const storyWords = story.toLowerCase().split(/\s+/);
    const cueMatches = characteristics.emotionalCues.filter((cue) =>
      storyWords.some((word) => word.includes(cue.toLowerCase()))
    ).length;

    return (cueMatches / characteristics.emotionalCues.length) * 100;
  }

  private injectEmotionalCues(
    story: string,
    characteristics: ToneCharacteristics,
    intensity: number
  ): string {
    const sentences = story.split(/(?<=[.!?])\s+/);
    const cuesToInject = Math.ceil(sentences.length * intensity * 0.3);
    const selectedCues = characteristics.emotionalCues.slice(0, cuesToInject);

    selectedCues.forEach((cue) => {
      const randomSentenceIdx = Math.floor(Math.random() * sentences.length);
      const sentence = sentences[randomSentenceIdx];

      if (sentence && !sentence.toLowerCase().includes(cue.toLowerCase())) {
        const position = sentence.indexOf(' ');
        if (position > 0) {
          sentences[randomSentenceIdx] = `${sentence.substring(0, position)} ${cue}${sentence.substring(position)}`;
        }
      }
    });

    return sentences.join(' ');
  }

  private adjustVocabulary(
    story: string,
    characteristics: ToneCharacteristics,
    intensity: number
  ): string {
    if (characteristics.sentiment > 0.5) {
      const positiveWords: Record<string, string> = {
        said: 'exclaimed',
        saw: 'beheld',
        looked: 'gazed',
        walked: 'strode',
        ran: 'raced',
        smiled: 'beamed',
        happy: 'joyful',
        good: 'wonderful',
        nice: 'delightful',
      };

      let result = story;
      for (const [original, replacement] of Object.entries(positiveWords)) {
        const regex = new RegExp(`\\b${original}\\b`, 'gi');
        result = result.replace(regex, replacement);
      }
      return result;
    } else if (characteristics.sentiment < -0.3) {
      const negativeWords: Record<string, string> = {
        said: 'muttered',
        saw: 'glimpsed',
        looked: 'peered',
        walked: 'trudged',
        ran: 'fled',
        smiled: 'grimaced',
        happy: 'content',
        good: 'acceptable',
        nice: 'tolerable',
      };

      let result = story;
      for (const [original, replacement] of Object.entries(negativeWords)) {
        const regex = new RegExp(`\\b${original}\\b`, 'gi');
        result = result.replace(regex, replacement);
      }
      return result;
    }

    return story;
  }

  private adjustPacing(
    story: string,
    characteristics: ToneCharacteristics,
    intensity: number
  ): string {
    if (characteristics.intensity > 0.7) {
      return this.increasePacing(story, intensity);
    } else if (characteristics.intensity < 0.4) {
      return this.decreasePacing(story, intensity);
    }

    return story;
  }

  private increasePacing(text: string, intensity: number): string {
    let result = text
      .replace(/\.\s+/g, '. ')
      .replace(/,\s+/g, ', ')
      .replace(/\s{2,}/g, ' ');

    const sentences = result.split(/(?<=[.!?])\s+/);
    if (sentences.length > 5) {
      result = sentences.slice(0, Math.ceil(sentences.length * intensity)).join(' ');
    }

    return result;
  }

  private decreasePacing(text: string, intensity: number): string {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const slowed = sentences
      .map((sentence) => {
        if (sentence.length > 20) {
          return sentence.replace(/,/g, ', ').replace(/;/g, '; ');
        }
        return sentence;
      })
      .join(' ');

    return slowed;
  }

  private countEmotionalCuesAdded(original: string, adapted: string): number {
    const originalWords = new Set(original.toLowerCase().split(/\s+/));
    const adaptedWords = adapted.toLowerCase().split(/\s+/);

    return adaptedWords.filter((word) => !originalWords.has(word)).length;
  }

  getAvailableTones(): Array<{ tone: EmotionalTone; characteristics: ToneCharacteristics }> {
    return Array.from(this.tones.entries()).map(([tone, characteristics]) => ({
      tone,
      characteristics,
    }));
  }

  clearCache(): void {
    this.adaptationCache.clear();
  }

  getCacheSize(): number {
    return this.adaptationCache.size;
  }
}

export const toneAdaptationEngine = new ToneAdaptationEngine();
