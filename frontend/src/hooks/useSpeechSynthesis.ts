import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type WordRange = {
  start: number;
  end: number;
};

export interface SpeechVoiceOption {
  id: string;
  name: string;
  lang: string;
  label: string;
  localService: boolean;
  isDefault: boolean;
}

export interface LanguageOption {
  lang: string;
  label: string;
  voiceCount: number;
}

export interface SpeechProgress {
  currentWordIndex: number;
  totalWords: number;
  percentage: number;
}

export interface UseSpeechSynthesisResult {
  isPlaying: boolean;
  isPaused: boolean;
  isSpeaking: boolean;
  play: (nextText?: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  rate: number;
  setRate: (nextRate: number) => void;
  pitch: number;
  setPitch: (nextPitch: number) => void;
  volume: number;
  setVolume: (nextVolume: number) => void;
  progress: SpeechProgress;
  isSupported: boolean;
  isReady: boolean;
  error: string | null;
  currentWordIndex: number;
  isLoading: boolean;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoiceIndex: number;
  setSelectedVoice: (index: number) => void;
  playbackRate: number;
  setPlaybackRate: (nextRate: number) => void;
  voices: SpeechVoiceOption[];
  selectedVoiceId: string;
  setSelectedVoiceId: (id: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  languageOptions: LanguageOption[];
}

const SPEED_MIN = 0.5;
const SPEED_MAX = 2;

const clampRate = (nextRate: number): number => {
  if (Number.isNaN(nextRate)) {
    return 1;
  }
  return Math.min(SPEED_MAX, Math.max(SPEED_MIN, nextRate));
};

const hasSpeechSupport = (): boolean => {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  );
};

const getVoiceId = (voice: SpeechSynthesisVoice): string =>
  voice.voiceURI || `${voice.name}-${voice.lang}`;

const getLanguageLabel = (languageCode: string): string => {
  try {
    const [language, region] = languageCode.split("-");
    const displayNames = new Intl.DisplayNames([window.navigator.language || "en"], {
      type: "language",
    });
    const languageName = displayNames.of(languageCode) || displayNames.of(language) || languageCode;
    return region ? `${languageName} (${region})` : languageName;
  } catch {
    return languageCode;
  }
};

const mapVoiceOption = (voice: SpeechSynthesisVoice): SpeechVoiceOption => ({
  id: getVoiceId(voice),
  name: voice.name,
  lang: voice.lang,
  label: `${voice.name} (${voice.lang})`,
  localService: voice.localService,
  isDefault: voice.default,
});

const buildWordRanges = (inputText: string): WordRange[] => {
  if (!inputText.trim()) {
    return [];
  }
  const ranges: WordRange[] = [];
  const wordPattern = /\S+/g;
  for (const match of inputText.matchAll(wordPattern)) {
    const start = match.index ?? 0;
    ranges.push({
      start,
      end: start + match[0].length,
    });
  }
  return ranges;
};

const getWordIndexAtCharIndex = (
  charIndex: number,
  ranges: WordRange[],
): number => {
  if (ranges.length === 0) {
    return 0;
  }
  const normalizedCharIndex = Math.max(0, charIndex);
  let low = 0;
  let high = ranges.length - 1;
  let bestMatch = 0;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const range = ranges[middle];
    if (range.start <= normalizedCharIndex) {
      bestMatch = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return bestMatch;
};

const getPreferredLanguage = (): string => {
  if (typeof window !== "undefined" && window.navigator) {
    return window.navigator.language || "en-US";
  }
  return "en-US";
};

export const useSpeechSynthesis = (
  text: string = "",
  voiceGender?: "female" | "male"
): UseSpeechSynthesisResult => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sessionRef = useRef(0);
  const previousTextRef = useRef(text);

  const [isSupported, setIsSupported] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rateState, setRateState] = useState(1);
  const [pitchState, setPitchState] = useState(1);
  const [volumeState, setVolumeState] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedVoiceId, setSelectedVoiceIdState] = useState("");
  const [selectedLanguage, setSelectedLanguageState] = useState("");

  const wordRanges = useMemo(() => buildWordRanges(text), [text]);
  const totalWords = wordRanges.length;

  const voices = useMemo<SpeechVoiceOption[]>(() => {
    return availableVoices.map(mapVoiceOption);
  }, [availableVoices]);

  const languageOptions = useMemo<LanguageOption[]>(() => {
    const counts = new Map<string, number>();
    for (const voice of voices) {
      counts.set(voice.lang, (counts.get(voice.lang) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([lang, voiceCount]) => ({
        lang,
        label: getLanguageLabel(lang),
        voiceCount,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [voices]);

  const progress = useMemo<SpeechProgress>(() => {
    const hasNarrationProgress = isPlaying || isPaused || currentWordIndex > 0;
    const spokenWords = hasNarrationProgress
      ? Math.min(currentWordIndex + 1, totalWords)
      : 0;
    return {
      currentWordIndex,
      totalWords,
      percentage: totalWords > 0 ? spokenWords / totalWords : 0,
    };
  }, [currentWordIndex, isPaused, isPlaying, totalWords]);

  const resetNarrationState = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setIsSpeaking(false);
    setCurrentWordIndex(0);
  }, []);

  const clearUtterance = useCallback(() => {
    utteranceRef.current = null;
    if (hasSpeechSupport()) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const stop = useCallback(() => {
    sessionRef.current += 1;
    clearUtterance();
    resetNarrationState();
  }, [clearUtterance, resetNarrationState]);

  const play = useCallback((nextText?: string) => {
    if (!isSupported) {
      setError("Speech synthesis is not supported in this browser.");
      return;
    }
    const textToSpeak = (nextText ?? text).trim();
    if (!textToSpeak) {
      setError("No story text is available for narration.");
      return;
    }
    if (!isReady || availableVoices.length === 0) {
      setError("Speech voices are still loading. Please try again in a moment.");
      return;
    }

    const speechSynthesis = window.speechSynthesis;
    sessionRef.current += 1;
    const sessionId = sessionRef.current;

    clearUtterance();
    setError(null);
    setCurrentWordIndex(0);
    setIsPaused(false);
    setIsPlaying(true);
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rateState;
    utterance.pitch = pitchState;
    utterance.volume = volumeState;

    // Resolve voice: first look at selectedVoiceId, then fallback to selectedVoiceIndex
    let browserVoice = availableVoices.find((v) => getVoiceId(v) === selectedVoiceId);
    if (!browserVoice && selectedVoiceIndex >= 0 && selectedVoiceIndex < availableVoices.length) {
      browserVoice = availableVoices[selectedVoiceIndex];
    }
    if (browserVoice) {
      utterance.voice = browserVoice;
      utterance.lang = browserVoice.lang;
    } else {
      utterance.lang = selectedLanguage || getPreferredLanguage();
    }

    utterance.onstart = () => {
      if (sessionRef.current !== sessionId) return;
      setIsPlaying(true);
      setIsPaused(false);
      setIsSpeaking(true);
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (sessionRef.current !== sessionId) return;
      if (typeof event.charIndex === "number") {
        const ranges = nextText ? buildWordRanges(nextText) : wordRanges;
        setCurrentWordIndex(getWordIndexAtCharIndex(event.charIndex, ranges));
      }
    };

    utterance.onend = () => {
      if (sessionRef.current !== sessionId) return;
      utteranceRef.current = null;
      setIsPlaying(false);
      setIsPaused(false);
      setIsSpeaking(false);
      const ranges = nextText ? buildWordRanges(nextText) : wordRanges;
      setCurrentWordIndex(ranges.length);
    };

    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      if (sessionRef.current !== sessionId) return;
      utteranceRef.current = null;
      setIsPlaying(false);
      setIsPaused(false);
      setIsSpeaking(false);
      if (event.error !== "interrupted") {
        setError("Narration failed to play.");
      }
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [
    clearUtterance,
    isReady,
    isSupported,
    rateState,
    pitchState,
    volumeState,
    text,
    wordRanges,
    availableVoices,
    selectedVoiceId,
    selectedVoiceIndex,
    selectedLanguage,
  ]);

  const pause = useCallback(() => {
    if (!isSupported || !utteranceRef.current) return;
    const speechSynthesis = window.speechSynthesis;
    if (!speechSynthesis.speaking || speechSynthesis.paused) return;
    speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
    setIsSpeaking(true);
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported || !utteranceRef.current) return;
    const speechSynthesis = window.speechSynthesis;
    if (!speechSynthesis.paused) return;
    speechSynthesis.resume();
    setIsPlaying(true);
    setIsPaused(false);
    setIsSpeaking(true);
  }, [isSupported]);

  const setRate = useCallback((nextRate: number) => {
    setRateState(clampRate(nextRate));
    if (utteranceRef.current) {
      utteranceRef.current.rate = clampRate(nextRate);
    }
  }, []);

  const setPitch = useCallback((nextPitch: number) => {
    setPitchState(nextPitch);
    if (utteranceRef.current) {
      utteranceRef.current.pitch = nextPitch;
    }
  }, []);

  const setVolume = useCallback((nextVolume: number) => {
    setVolumeState(nextVolume);
    if (utteranceRef.current) {
      utteranceRef.current.volume = nextVolume;
    }
  }, []);

  const setSelectedVoice = useCallback((index: number) => {
    setSelectedVoiceIndex(index);
    if (availableVoices[index]) {
      const voiceId = getVoiceId(availableVoices[index]);
      setSelectedVoiceIdState(voiceId);
      setSelectedLanguageState(availableVoices[index].lang);
    }
  }, [availableVoices]);

  const setSelectedVoiceId = useCallback((id: string) => {
    setSelectedVoiceIdState(id);
    const index = availableVoices.findIndex((v) => getVoiceId(v) === id);
    if (index >= 0) {
      setSelectedVoiceIndex(index);
      setSelectedLanguageState(availableVoices[index].lang);
    }
  }, [availableVoices]);

  const setSelectedLanguage = useCallback((lang: string) => {
    setSelectedLanguageState(lang);
    const matchedVoice = availableVoices.find((v) => v.lang === lang);
    if (matchedVoice) {
      const voiceId = getVoiceId(matchedVoice);
      setSelectedVoiceIdState(voiceId);
      setSelectedVoiceIndex(availableVoices.indexOf(matchedVoice));
    }
  }, [availableVoices]);

  useEffect(() => {
    const supported = hasSpeechSupport();
    setIsSupported(supported);
    if (!supported) {
      setIsReady(false);
      setError("Speech synthesis is not supported in this browser.");
      return;
    }
    const speechSynthesis = window.speechSynthesis;
    let isMounted = true;
    const syncVoices = () => {
      if (!isMounted) return;
      const loadedVoices = speechSynthesis.getVoices();
      setAvailableVoices(loadedVoices);
      setIsReady(loadedVoices.length > 0);

      if (loadedVoices.length > 0) {
        // Find default/fallback values
        const preferred = getPreferredLanguage();
        const defaultVoice = loadedVoices.find((v) => v.default) || loadedVoices.find((v) => v.lang.startsWith(preferred.split("-")[0])) || loadedVoices[0];
        
        setSelectedVoiceIdState((currentId) => {
          if (currentId) {
            const stillExists = loadedVoices.some((v) => getVoiceId(v) === currentId);
            if (stillExists) return currentId;
          }
          return getVoiceId(defaultVoice);
        });

        setSelectedLanguageState((currentLang) => {
          if (currentLang) {
            const stillExists = loadedVoices.some((v) => v.lang === currentLang);
            if (stillExists) return currentLang;
          }
          return defaultVoice.lang;
        });

        setSelectedVoiceIndex((currentIndex) => {
          if (currentIndex >= 0 && currentIndex < loadedVoices.length) {
            return currentIndex;
          }
          return loadedVoices.indexOf(defaultVoice);
        });
      }
    };

    syncVoices();
    speechSynthesis.addEventListener("voiceschanged", syncVoices);
    return () => {
      isMounted = false;
      speechSynthesis.removeEventListener("voiceschanged", syncVoices);
    };
  }, []);

  useEffect(() => {
    const textChanged = previousTextRef.current !== text;
    previousTextRef.current = text;
    if (textChanged) {
      stop();
      if (isSupported) {
        setError(null);
      }
    }
  }, [isSupported, stop, text]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const isLoading = isSupported && !isReady;

  return {
    isPlaying,
    isPaused,
    isSpeaking,
    play,
    pause,
    resume,
    stop,
    rate: rateState,
    setRate,
    pitch: pitchState,
    setPitch,
    volume: volumeState,
    setVolume,
    progress,
    isSupported,
    isReady,
    error,
    currentWordIndex,
    isLoading,
    availableVoices,
    selectedVoiceIndex,
    setSelectedVoice,
    playbackRate: rateState,
    setPlaybackRate: setRate,
    voices,
    selectedVoiceId,
    setSelectedVoiceId,
    selectedLanguage,
    setSelectedLanguage,
    languageOptions,
  };
};

export default useSpeechSynthesis;
