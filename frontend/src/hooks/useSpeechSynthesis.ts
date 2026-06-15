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

const getLanguageLabel = (lang: string): string => {
  try {
    const display = new Intl.DisplayNames([window.navigator.language || "en"], {
      type: "language",
    });
    return display.of(lang) || lang;
  } catch {
    return lang;
  }
};

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

  const matchIndex = ranges.findIndex(
    (range) => charIndex >= range.start && charIndex <= range.end,
  );

  if (matchIndex >= 0) {
    return matchIndex;
  }

  const fallbackIndex = ranges.findIndex((range) => charIndex < range.start);
  return fallbackIndex >= 0 ? Math.max(0, fallbackIndex - 1) : ranges.length - 1;
};

const mapVoiceOption = (voice: SpeechSynthesisVoice): SpeechVoiceOption => ({
  id: getVoiceId(voice),
  name: voice.name,
  lang: voice.lang,
  label: `${voice.name} (${voice.lang})`,
  localService: voice.localService,
  isDefault: voice.default,
});

const getPreferredLanguage = (): string => {
  return typeof window !== "undefined" ? window.navigator.language || "en-US" : "en-US";
};

const findVoiceByGender = (
  voices: SpeechSynthesisVoice[],
  gender: "female" | "male"
): SpeechSynthesisVoice | undefined => {
  const genderMatchers: Record<"female" | "male", RegExp> = {
    female: /(female|zira|samantha|victoria|siri female|google uk english female|google us english female)/i,
    male: /(male|david|guy|alex|siri male|google uk english male|google us english male)/i,
  };

  const matchedVoice = voices.find((voice) => genderMatchers[gender].test(voice.name));
  if (matchedVoice) {
    return matchedVoice;
  }

  return voices.find((voice) => {
    const normalized = voice.name.toLowerCase();
    if (gender === "female") {
      return /female/i.test(normalized) && !/male/i.test(normalized);
    }
    return /male/i.test(normalized) && !/female/i.test(normalized);
  });
};

export const useSpeechSynthesis = (
  text = "",
  voiceGender: "female" | "male" = "female",
): UseSpeechSynthesisResult => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sessionRef = useRef(0);
  const previousTextRef = useRef(text);

  const [isSupported, setIsSupported] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [voices, setVoices] = useState<SpeechVoiceOption[]>([]);
  const [selectedLanguage, setSelectedLanguageState] = useState("");
  const [selectedVoiceId, setSelectedVoiceIdState] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [rateState, setRateState] = useState(1);
  const [pitchState, setPitchState] = useState(1);
  const [volumeState, setVolumeState] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const wordRanges = useMemo(() => buildWordRanges(text), [text]);
  const totalWords = wordRanges.length;

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

  const languageOptions = useMemo<LanguageOption[]>(() => {
    const languageCounts = new Map<string, number>();

    voices.forEach((voice) => {
      languageCounts.set(voice.lang, (languageCounts.get(voice.lang) || 0) + 1);
    });

    return Array.from(languageCounts.entries())
      .map(([lang, voiceCount]) => ({
        lang,
        label: getLanguageLabel(lang),
        voiceCount,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [voices]);

  const clearUtterance = useCallback(() => {
    utteranceRef.current = null;
    if (hasSpeechSupport()) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const stop = useCallback(() => {
    sessionRef.current += 1;
    clearUtterance();
    setIsPlaying(false);
    setIsPaused(false);
    setIsSpeaking(false);
    setCurrentWordIndex(0);
  }, [clearUtterance]);

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

    if (!isReady) {
      setError("Speech voices are still loading. Please try again in a moment.");
      return;
    }

    const currentRanges = nextText ? buildWordRanges(nextText) : wordRanges;
    const currentTotalWords = currentRanges.length;

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
    utterance.lang = selectedLanguage || getPreferredLanguage();

    const browserVoice = availableVoices[selectedVoiceIndex];
    if (browserVoice) {
      utterance.voice = browserVoice;
      utterance.lang = browserVoice.lang;
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
        setCurrentWordIndex(getWordIndexAtCharIndex(event.charIndex, currentRanges));
      }
    };

    utterance.onend = () => {
      if (sessionRef.current !== sessionId) return;
      utteranceRef.current = null;
      setIsPlaying(false);
      setIsPaused(false);
      setIsSpeaking(false);
      setCurrentWordIndex(currentTotalWords);
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
    isSupported,
    text,
    isReady,
    wordRanges,
    clearUtterance,
    rateState,
    pitchState,
    volumeState,
    selectedLanguage,
    availableVoices,
    selectedVoiceIndex,
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
    const clamped = clampRate(nextRate);
    setRateState(clamped);
    if (utteranceRef.current) {
      utteranceRef.current.rate = clamped;
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

  const setSelectedVoiceId = useCallback((id: string) => {
    if (availableVoices.length === 0) return;
    const idx = availableVoices.findIndex((v) => getVoiceId(v) === id);
    if (idx !== -1) {
      setSelectedVoiceIndex(idx);
      setSelectedVoiceIdState(id);
      setSelectedLanguageState(availableVoices[idx].lang);
      stop();
    }
  }, [availableVoices, stop]);

  const setSelectedLanguage = useCallback((lang: string) => {
    if (availableVoices.length === 0) return;
    const langIdx = availableVoices.findIndex(
      (v) => v.lang.toLowerCase() === lang.toLowerCase()
    );
    if (langIdx !== -1) {
      setSelectedVoiceIndex(langIdx);
      setSelectedVoiceIdState(getVoiceId(availableVoices[langIdx]));
      setSelectedLanguageState(lang);
      stop();
    }
  }, [availableVoices, stop]);

  const setSelectedVoice = useCallback((idx: number) => {
    if (availableVoices.length === 0 || idx < 0 || idx >= availableVoices.length) return;
    setSelectedVoiceIndex(idx);
    setSelectedVoiceIdState(getVoiceId(availableVoices[idx]));
    setSelectedLanguageState(availableVoices[idx].lang);
    stop();
  }, [availableVoices, stop]);

  // Initial support and voice sync
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
      const browserVoices = speechSynthesis.getVoices();
      setAvailableVoices(browserVoices);
      const options = browserVoices.map(mapVoiceOption);
      setVoices(options);
      setIsReady(browserVoices.length > 0);

      if (browserVoices.length > 0) {
        setSelectedLanguageState((currentLanguage) => {
          const nextLanguage = currentLanguage || getPreferredLanguage();
          const genderVoice = findVoiceByGender(browserVoices, voiceGender);
          const defaultMatchedVoice = browserVoices.find((voice) => voice.default);
          const matchedVoice = genderVoice || defaultMatchedVoice || browserVoices[0];

          setSelectedVoiceIndex(browserVoices.indexOf(matchedVoice));
          setSelectedVoiceIdState(getVoiceId(matchedVoice));
          return matchedVoice.lang || nextLanguage;
        });
      }
    };

    syncVoices();

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener("voiceschanged", syncVoices);
      return () => {
        isMounted = false;
        speechSynthesis.removeEventListener("voiceschanged", syncVoices);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [voiceGender]);

  // Synchronize text changes
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

  // Re-sync if voiceGender changes during runtime
  useEffect(() => {
    if (availableVoices.length === 0) return;
    const genderVoice = findVoiceByGender(availableVoices, voiceGender);
    if (genderVoice) {
      const idx = availableVoices.indexOf(genderVoice);
      if (idx !== -1) {
        setSelectedVoiceIndex(idx);
        setSelectedVoiceIdState(getVoiceId(genderVoice));
        setSelectedLanguageState(genderVoice.lang);
      }
    }
  }, [voiceGender]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

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
    isLoading: isSupported && !isReady,
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
