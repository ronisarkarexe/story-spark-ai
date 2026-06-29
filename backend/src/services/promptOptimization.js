class PromptOptimizer {
  constructor() {
    this.commonPhrases = {
      // Map long phrases to shorter equivalents
      'write a story about': 'story:',
      'tell me a tale': 'tale:',
      'create a narrative': 'narrative:',
      'generate creative content': 'create:',
      'what is': '?',
      'can you': '?',
    };
  }

  optimizePrompt(prompt) {
    let optimized = prompt.trim().toLowerCase();

    // Remove redundant words
    optimized = this.removeRedundantWords(optimized);

    // Apply common phrase replacements
    optimized = this.applyCommonPhrases(optimized);

    // Remove excessive punctuation
    optimized = this.normalizeWhitespace(optimized);

    return optimized;
  }

  removeRedundantWords(prompt) {
    const redundantWords = [
      'please',
      'thank you',
      'kindly',
      'would you',
      'could you',
      'basically',
      'literally',
      'honestly',
    ];

    let result = prompt;
    redundantWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      result = result.replace(regex, '').trim();
    });

    return result;
  }

  applyCommonPhrases(prompt) {
    let result = prompt;

    for (const [original, replacement] of Object.entries(this.commonPhrases)) {
      const regex = new RegExp(original, 'gi');
      result = result.replace(regex, replacement);
    }

    return result;
  }

  normalizeWhitespace(prompt) {
    return prompt
      .replace(/\s+/g, ' ')
      .replace(/[.!?]{2,}/g, '.')
      .trim();
  }

  detectLanguage(prompt) {
    const languages = {
      en: /(story|tale|narrative|character|plot)/i,
      es: /(historia|cuento|personaje|trama)/i,
      fr: /(histoire|conte|personnage|intrigue)/i,
      de: /(geschichte|erz[a-z]+hlung|charakter|handlung)/i,
    };

    for (const [lang, regex] of Object.entries(languages)) {
      if (regex.test(prompt)) {
        return lang;
      }
    }

    return 'en';
  }

  estimateComplexity(prompt) {
    let complexity = 1;

    if (prompt.length > 200) complexity += 1;
    if ((prompt.match(/and/gi) || []).length > 3) complexity += 1;
    if ((prompt.match(/,/gi) || []).length > 2) complexity += 1;
    if (prompt.includes('multi') || prompt.includes('series')) complexity += 2;

    return Math.min(complexity, 5);
  }

  getTokenEstimate(prompt) {
    return Math.ceil(prompt.split(/\s+/).length * 1.3);
  }

  generateVariations(prompt, count = 3) {
    const variations = [prompt];

    if (count >= 2) {
      variations.push(this.addContext(prompt));
    }
    if (count >= 3) {
      variations.push(this.expandPrompt(prompt));
    }
    if (count >= 4) {
      variations.push(this.simplifyPrompt(prompt));
    }

    return variations.slice(0, count);
  }

  addContext(prompt) {
    const contexts = [
      'In a fantasy world,',
      'In modern times,',
      'Once upon a time,',
      'In a distant galaxy,',
      'In an alternate universe,',
    ];

    const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
    return `${randomContext} ${prompt}`;
  }

  expandPrompt(prompt) {
    const expansions = [
      `Create a detailed ${prompt}`,
      `Write an elaborate ${prompt}`,
      `Develop a complex ${prompt}`,
    ];

    const randomExpansion = expansions[Math.floor(Math.random() * expansions.length)];
    return randomExpansion;
  }

  simplifyPrompt(prompt) {
    return prompt.replace(/\s+/g, ' ').slice(0, 100);
  }
}

export default new PromptOptimizer();
