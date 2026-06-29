class StyleTransferEngine {
  constructor() {
    this.styles = {
      formal: {
        vocabulary: 'elevated',
        sentenceStructure: 'complex',
        pace: 'slow',
        description: 'Sophisticated, academic, professional tone',
      },
      casual: {
        vocabulary: 'common',
        sentenceStructure: 'simple',
        pace: 'natural',
        description: 'Relaxed, conversational, friendly tone',
      },
      poetic: {
        vocabulary: 'literary',
        sentenceStructure: 'varied',
        pace: 'rhythmic',
        description: 'Lyrical, metaphorical, artistic tone',
      },
      technical: {
        vocabulary: 'specialized',
        sentenceStructure: 'precise',
        pace: 'efficient',
        description: 'Detailed, exact, informative tone',
      },
      humorous: {
        vocabulary: 'witty',
        sentenceStructure: 'playful',
        pace: 'unpredictable',
        description: 'Funny, ironic, entertaining tone',
      },
      dark: {
        vocabulary: 'intense',
        sentenceStructure: 'dramatic',
        pace: 'suspenseful',
        description: 'Ominous, mysterious, grim tone',
      },
    };
  }

  applyStyle(text, styleName) {
    if (!this.styles[styleName]) {
      throw new Error(`Style "${styleName}" not supported`);
    }

    const style = this.styles[styleName];
    let styledText = text;

    styledText = this.adjustVocabulary(styledText, style.vocabulary);
    styledText = this.adjustSentenceStructure(styledText, style.sentenceStructure);
    styledText = this.adjustPace(styledText, style.pace);

    return styledText;
  }

  adjustVocabulary(text, vocabularyLevel) {
    const replacements = {
      elevated: {
        'said': 'articulated',
        'happy': 'elated',
        'sad': 'melancholic',
        'big': 'substantial',
        'small': 'diminutive',
        'good': 'exemplary',
        'bad': 'deplorable',
      },
      common: {
        'articulated': 'said',
        'elated': 'happy',
        'melancholic': 'sad',
        'substantial': 'big',
        'diminutive': 'small',
        'exemplary': 'good',
        'deplorable': 'bad',
      },
      literary: {
        'said': 'whispered',
        'happy': 'blissful',
        'sad': 'sorrowful',
        'big': 'vast',
        'small': 'petite',
        'good': 'magnificent',
        'bad': 'wretched',
      },
      specialized: {
        'said': 'reported',
        'happy': 'optimized',
        'sad': 'degraded',
        'big': 'scalable',
        'small': 'minimal',
        'good': 'functional',
        'bad': 'inefficient',
      },
      witty: {
        'sad': 'as cheerful as a tax audit',
        'big': 'ginormous',
        'good': '*chef kiss*',
        'bad': 'a total trainwreck',
      },
      intense: {
        'sad': 'devastated',
        'happy': 'exhilarated',
        'dark': 'shadowed',
        'light': 'brilliant',
      },
    };

    let result = text;
    const wordMap = replacements[vocabularyLevel] || {};

    for (const [word, replacement] of Object.entries(wordMap)) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      result = result.replace(regex, replacement);
    }

    return result;
  }

  adjustSentenceStructure(text, structure) {
    const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);

    let adjusted;

    if (structure === 'simple') {
      adjusted = sentences.map((s) => {
        const parts = s.split(/[,;]/);
        return parts[0].trim();
      }).join('. ');
    } else if (structure === 'complex') {
      adjusted = sentences.map((s, i) => {
        if (i < sentences.length - 1) {
          return `${s}, which led to`;
        }
        return s;
      }).join(' ');
    } else if (structure === 'varied') {
      adjusted = sentences.map((s, i) => {
        if (i % 3 === 0) return `Perhaps ${s}`;
        if (i % 3 === 1) return `Indeed, ${s}`;
        return s;
      }).join('. ');
    } else if (structure === 'precise') {
      adjusted = sentences.map((s) => s.replace(/\s{2,}/g, ' ')).join('. ');
    } else if (structure === 'playful') {
      adjusted = sentences.map((s) => {
        if (Math.random() > 0.5) return `${s}!`;
        return s;
      }).join('. ');
    } else if (structure === 'dramatic') {
      adjusted = sentences.map((s) => `${s}...`).join(' ');
    }

    return adjusted || text;
  }

  adjustPace(text, pace) {
    if (pace === 'slow') {
      return text.replace(/\./g, '. ').replace(/\s{2,}/g, ' ');
    }
    if (pace === 'fast') {
      return text.replace(/\. /g, '. ').replace(/\s+/g, ' ');
    }
    if (pace === 'rhythmic') {
      const words = text.split(' ');
      return words.map((w, i) => (i % 3 === 0 ? `${w}` : w)).join(' ');
    }
    return text;
  }

  supportedStyles() {
    return Object.entries(this.styles).map(([name, config]) => ({
      name,
      ...config,
    }));
  }
}

export default new StyleTransferEngine();
