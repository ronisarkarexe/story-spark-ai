class ToneAdaptationEngine {
  constructor() {
    this.tones = {
      optimistic: { markers: ['bright', 'hope', 'victory'], weight: 1.5 },
      pessimistic: { markers: ['dark', 'despair', 'defeat'], weight: -1.5 },
      neutral: { markers: ['fact', 'report', 'observe'], weight: 0 },
      sentimental: { markers: ['love', 'nostalgic', 'tender'], weight: 1.2 },
      cynical: { markers: ['irony', 'mockery', 'sarcasm'], weight: -0.8 },
      epic: { markers: ['legendary', 'grand', 'heroic'], weight: 2 },
    };
  }

  adaptTone(text, toneName, intensity = 1.0) {
    if (!this.tones[toneName]) throw new Error(`Tone "${toneName}" not found`);
    const tone = this.tones[toneName];
    return this.injectToneMarkers(text, tone.markers, intensity);
  }

  injectToneMarkers(text, markers, intensity) {
    if (intensity < 0.5) return text;
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    return sentences.map((s, i) => {
      if (i === 0 || Math.random() > intensity) return s;
      const marker = markers[Math.floor(Math.random() * markers.length)];
      return `${s} (${marker})`;
    }).join('. ');
  }

  blendTones(text, primary, secondary, primaryWeight = 0.7) {
    const p = this.adaptTone(text, primary, primaryWeight);
    const s = this.adaptTone(text, secondary, 1 - primaryWeight);
    return p;
  }

  getSupportedTones() {
    return Object.keys(this.tones);
  }
}

module.exports = new ToneAdaptationEngine();
