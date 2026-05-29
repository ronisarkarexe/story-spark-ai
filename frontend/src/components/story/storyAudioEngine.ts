export class StoryAudioEngine {
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  public playBackgroundMusic(genre: string) {
    if (this.isMuted) return;
    console.log(`[AudioEngine] Ambience/Music setup for genre: ${genre}`);
    // In a production application, HTML5 audio clips would be loaded and played here.
  }

  public stopAll() {
    window.speechSynthesis.cancel();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAll();
    }
    return this.isMuted;
  }

  public speakText(text: string, isDialog: boolean) {
    if (this.isMuted || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Pick a variation or the main voice
      const genericVoice = voices.find(v => v.lang.includes('en-')) || voices[0];
      const dialogVoice = voices.length > 1 ? voices[voices.length - 1] : genericVoice;
      
      utterance.voice = isDialog ? dialogVoice : genericVoice;
      utterance.pitch = isDialog ? 1.2 : 1.0;
      utterance.rate = 0.95;
    }
    
    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }
}
