class NarrativeRefinement {
  constructor() {
    this.levels = {
      basic: { grammar: true, pacing: false, description: false },
      standard: { grammar: true, pacing: true, description: true },
      premium: { grammar: true, pacing: true, description: true, characterization: true },
    };
  }

  refine(text, level = 'standard') {
    if (!this.levels[level]) throw new Error(`Level "${level}" not supported`);
    const config = this.levels[level];
    let result = text;
    if (config.grammar) result = this.improveGrammar(result);
    if (config.pacing) result = this.improvePacing(result);
    if (config.description) result = this.enhanceDescription(result);
    return result;
  }

  improveGrammar(text) {
    return text.replace(/\bi\b/g, 'I').replace(/\s{2,}/g, ' ');
  }

  improvePacing(text) {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    return sentences.map(s => s.length > 100 ? s.substring(0, 100) + '.' : s).join('. ');
  }

  enhanceDescription(text) {
    const enhancements = { 'he walked': 'he strode', 'it was dark': 'shadows enveloped' };
    let result = text;
    for (const [original, replacement] of Object.entries(enhancements)) {
      result = result.replace(original, replacement);
    }
    return result;
  }

  getSupportedLevels() {
    return Object.keys(this.levels);
  }
}

module.exports = new NarrativeRefinement();
