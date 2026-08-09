class StyleTransferEngine {
  constructor() {
    this.styles = {
      formal: { vocabulary: { said: 'articulated', happy: 'delighted' }, pace: 'slow' },
      casual: { vocabulary: { said: 'said', hello: 'hey' }, pace: 'normal' },
      poetic: { vocabulary: { said: 'whispered', dark: 'shadowed' }, pace: 'varied' },
      technical: { vocabulary: { thing: 'element', process: 'algorithm' }, pace: 'precise' },
      humorous: { vocabulary: { sad: 'tragically bummed', said: 'quipped' }, pace: 'snappy' },
    };
  }

  applyStyle(text, styleName) {
    if (!this.styles[styleName]) throw new Error(`Style "${styleName}" not found`);
    const style = this.styles[styleName];
    return this.adjustVocabulary(text, style.vocabulary);
  }

  adjustVocabulary(text, vocabulary) {
    let result = text;
    for (const [original, replacement] of Object.entries(vocabulary)) {
      const regex = new RegExp(`\\b${original}\\b`, 'gi');
      result = result.replace(regex, replacement);
    }
    return result;
  }

  getSupportedStyles() {
    return Object.keys(this.styles);
  }
}

module.exports = new StyleTransferEngine();
