class ToneAdaptationEngine {
  constructor() {
    this.tones = {
      optimistic: {
        markers: ['bright', 'hope', 'victory', 'triumph'],
        emotionalShift: 1.5,
        intensityLevel: 'high',
      },
      pessimistic: {
        markers: ['dark', 'despair', 'defeat', 'grim'],
        emotionalShift: -1.5,
        intensityLevel: 'high',
      },
      neutral: {
        markers: ['fact', 'report', 'observe'],
        emotionalShift: 0,
        intensityLevel: 'low',
      },
      sentimental: {
        markers: ['love', 'nostalgic', 'tender', 'heartfelt'],
        emotionalShift: 1.2,
        intensityLevel: 'medium',
      },
      cynical: {
        markers: ['irony', 'mockery', 'ironic', 'sarcasm'],
        emotionalShift: -0.8,
        intensityLevel: 'medium',
      },
      epic: {
        markers: ['legendary', 'grand', 'heroic', 'monumental'],
        emotionalShift: 2,
        intensityLevel: 'very-high',
      },
    };
  }

  adaptTone(text, toneName, intensity = 1.0) {
    if (!this.tones[toneName]) {
      throw new Error(`Tone "${toneName}" not supported`);
    }

    const tone = this.tones[toneName];
    let adaptedText = text;

    adaptedText = this.injectToneMarkers(adaptedText, tone.markers, intensity);
    adaptedText = this.adjustEmotionalWeight(adaptedText, tone.emotionalShift, intensity);
    adaptedText = this.modifyIntensity(adaptedText, tone.intensityLevel, intensity);

    return adaptedText;
  }

  injectToneMarkers(text, markers, intensity) {
    if (intensity < 0.5) return text;

    const sentences = text.split(/[.!?]+/).filter(Boolean);

    const enhancedSentences = sentences.map((sentence, index) => {
      if (index === 0 || Math.random() > intensity) {
        return sentence;
      }

      const marker = markers[Math.floor(Math.random() * markers.length)];
      return `${sentence} [${marker}]`;
    });

    return enhancedSentences.join('. ').replace(/\[\w+\]/g, '');
  }

  adjustEmotionalWeight(text, shift, intensity) {
    if (shift > 0) {
      const positiveWords = ['beautiful', 'wonderful', 'amazing', 'incredible', 'delightful'];
      const words = text.split(' ');
      return words
        .map((word, i) => {
          if (Math.random() < 0.1 * intensity && i % 5 === 0) {
            const adjective = positiveWords[Math.floor(Math.random() * positiveWords.length)];
            return `${adjective} ${word}`;
          }
          return word;
        })
        .join(' ');
    }

    if (shift < 0) {
      const negativeWords = ['bleak', 'grim', 'dreary', 'ominous', 'haunting'];
      const words = text.split(' ');
      return words
        .map((word, i) => {
          if (Math.random() < 0.08 * intensity && i % 6 === 0) {
            const adjective = negativeWords[Math.floor(Math.random() * negativeWords.length)];
            return `${adjective} ${word}`;
          }
          return word;
        })
        .join(' ');
    }

    return text;
  }

  modifyIntensity(text, intensityLevel, intensity) {
    if (intensityLevel === 'low') {
      return text.replace(/[!?]/g, '.');
    }

    if (intensityLevel === 'high' || intensityLevel === 'very-high') {
      const sentences = text.split(/[.!?]+/);
      return sentences
        .map((sentence, i) => {
          if (intensityLevel === 'very-high' && Math.random() > 0.5) {
            return `${sentence.trim()}!!!`;
          }
          return `${sentence.trim()}!`;
        })
        .join(' ');
    }

    return text;
  }

  blendTones(text, primaryTone, secondaryTone, primaryWeight = 0.7) {
    const primaryAdapted = this.adaptTone(text, primaryTone, primaryWeight);
    const secondaryAdapted = this.adaptTone(text, secondaryTone, 1 - primaryWeight);

    const primaryWords = primaryAdapted.split(' ');
    const secondaryWords = secondaryAdapted.split(' ');

    const blended = primaryWords.map((word, i) => {
      if (i % 3 === 0 && secondaryWords[i]) {
        return secondaryWords[i];
      }
      return word;
    });

    return blended.join(' ');
  }

  detectTone(text) {
    const toneScores = {};

    for (const [toneName, config] of Object.entries(this.tones)) {
      let score = 0;
      for (const marker of config.markers) {
        const regex = new RegExp(marker, 'gi');
        score += (text.match(regex) || []).length;
      }
      toneScores[toneName] = score;
    }

    const maxScore = Math.max(...Object.values(toneScores));
    return Object.keys(toneScores).find((tone) => toneScores[tone] === maxScore);
  }

  supportedTones() {
    return Object.keys(this.tones);
  }
}

export default new ToneAdaptationEngine();
