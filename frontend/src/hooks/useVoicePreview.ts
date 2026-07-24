import { useCallback, useRef, useState } from "react";
import { SpeechVoiceOption } from "./useSpeechSynthesis";

const PREVIEW_TEXT = "This is a voice preview. Click to listen.";

export interface UseVoicePreviewResult {
  /** ID of voice currently being previewed, or null if none */
  previewingVoiceId: string | null;
  /** True if audio is currently playing for preview */
  isPreviewPlaying: boolean;
  /** Play preview audio for the specified voice */
  playPreview: (voice: SpeechVoiceOption) => void;
  /** Stop any active preview */
  stopPreview: () => void;
}

/**
 * Hook to handle voice preview playback using Web Speech API.
 * Allows users to hear a sample of each voice before selecting it.
 */
export const useVoicePreview = (): UseVoicePreviewResult => {
  const previewUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef(false);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  const stopPreview = useCallback(() => {
    if (isPlayingRef.current && previewUtteranceRef.current) {
      window.speechSynthesis.cancel();
      previewUtteranceRef.current = null;
    }
    isPlayingRef.current = false;
    setIsPreviewPlaying(false);
    setPreviewingVoiceId(null);
  }, []);

  const playPreview = useCallback(
    (voice: SpeechVoiceOption) => {
      stopPreview();

      const utterance = new SpeechSynthesisUtterance(PREVIEW_TEXT);
      utterance.lang = voice.lang;
      utterance.rate = 1;

      // Find the actual browser voice object and apply it
      const browserVoice = window.speechSynthesis
        .getVoices()
        .find((v) => v.voiceURI === voice.id || `${v.name}-${v.lang}` === voice.id);

      if (browserVoice) {
        utterance.voice = browserVoice;
      }

      utterance.onstart = () => {
        isPlayingRef.current = true;
        setPreviewingVoiceId(voice.id);
        setIsPreviewPlaying(true);
      };

      utterance.onend = () => {
        previewUtteranceRef.current = null;
        isPlayingRef.current = false;
        setIsPreviewPlaying(false);
        setPreviewingVoiceId(null);
      };

      utterance.onerror = () => {
        previewUtteranceRef.current = null;
        isPlayingRef.current = false;
        setIsPreviewPlaying(false);
        setPreviewingVoiceId(null);
      };

      previewUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [stopPreview],
  );

  return {
    previewingVoiceId,
    isPreviewPlaying,
    playPreview,
    stopPreview,
  };
};

export default useVoicePreview;
