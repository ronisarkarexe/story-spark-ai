class NarrativeRefinement {
  constructor() {
    this.refinementLevels = {
      basic: {
        checkGrammar: true,
        improvePacing: false,
        enhanceDescription: false,
        deepenCharacters: false,
      },
      standard: {
        checkGrammar: true,
        improvePacing: true,
        enhanceDescription: true,
        deepenCharacters: false,
      },
      premium: {
        checkGrammar: true,
        improvePacing: true,
        enhanceDescription: true,
        deepenCharacters: true,
      },
    };
  }

  refineNarrative(text, level = 'standard') {
    if (!this.refinementLevels[level]) {
      throw new Error(`Refinement level "${level}" not supported`);
    }

    const config = this.refinementLevels[level];
    let refined = text;

    if (config.checkGrammar) {
      refined = this.improveGrammar(refined);
    }
    if (config.improvePacing) {
      refined = this.improvePacing(refined);
    }
    if (config.enhanceDescription) {
      refined = this.enhanceDescription(refined);
    }
    if (config.deepenCharacters) {
      refined = this.deepenCharacterization(refined);
    }

    return refined;
  }

  improveGrammar(text) {
    let improved = text;

    improved = improved.replace(/\bi\b/g, 'I');
    improved = improved.replace(/\s{2,}/g, ' ');
    improved = improved.replace(/([.!?])\s+([a-z])/g, (match, p1, p2) => `${p1} ${p2.toUpperCase()}`);

    return improved;
  }

  improvePacing(text) {
    const sentences = text.split(/[.!?]+/).filter(Boolean);

    if (sentences.length < 3) return text;

    const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    const pacer = sentences.map((sentence) => {
      const length = sentence.trim().length;
      if (length > avgLength * 1.5) {
        return this.breakLongSentence(sentence);
      }
      if (length < avgLength * 0.5 && sentences.indexOf(sentence) > 0) {
        return this.expandShortSentence(sentence);
      }
      return sentence;
    });

    return pacer.join('. ').trim();
  }

  breakLongSentence(sentence) {
    const maxLength = 80;
    if (sentence.length <= maxLength) return sentence;

    const parts = sentence.split(' ');
    const result = [];
    let current = [];

    parts.forEach((word) => {
      current.push(word);
      if (current.join(' ').length >= maxLength) {
        result.push(current.join(' '));
        current = [];
      }
    });

    if (current.length) result.push(current.join(' '));
    return result.join('. ');
  }

  expandShortSentence(sentence) {
    const expanders = [
      'Meanwhile, ',
      'Furthermore, ',
      'Interestingly, ',
      'Surprisingly, ',
      'As it turned out, ',
    ];

    const expander = expanders[Math.floor(Math.random() * expanders.length)];
    return `${expander}${sentence.trim()}`;
  }

  enhanceDescription(text) {
    const descriptionBoosts = {
      'he walked': 'he strode purposefully',
      'she ran': 'she sprinted frantically',
      'it was dark': 'an oppressive darkness enveloped everything',
      'it was bright': 'brilliant light flooded the space',
      'the sound': 'the resonant sound',
      'the smell': 'the distinct aroma',
    };

    let enhanced = text;
    for (const [original, replacement] of Object.entries(descriptionBoosts)) {
      const regex = new RegExp(`\\b${original}\\b`, 'gi');
      enhanced = enhanced.replace(regex, replacement);
    }

    return enhanced;
  }

  deepenCharacterization(text) {
    const characterDepthners = {
      'he said': 'he murmured, his voice wavering slightly',
      'she thought': 'she pondered deeply, her mind racing',
      'they looked': 'they exchanged a meaningful glance',
      'I felt': 'I sensed, with an inexplicable certainty,',
    };

    let deepened = text;
    for (const [original, replacement] of Object.entries(characterDepthners)) {
      const regex = new RegExp(`\\b${original}\\b`, 'gi');
      deepened = deepened.replace(regex, replacement);
    }

    return deepened;
  }

  getQualityScore(text) {
    let score = 50;

    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const avgSentenceLength = text.length / Math.max(sentences.length, 1);

    if (avgSentenceLength > 40 && avgSentenceLength < 80) score += 10;
    if (text.match(/[!?]{2,}/).length === 0) score += 5;
    if (text.match(/\b(the|a|an)\b/gi).length > 10) score += 5;

    const uniqueWords = new Set(text.toLowerCase().split(/\W+/)).size;
    if (uniqueWords > text.split(/\W+/).length * 0.6) score += 10;

    return Math.min(score, 100);
  }

  supportedLevels() {
    return Object.keys(this.refinementLevels);
  }
}

export default new NarrativeRefinement();
