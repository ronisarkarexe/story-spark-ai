import { useState, useRef, useEffect, useCallback, useMemo } from "react";

export interface SpeechVoiceOption {
  id: string;
  label: string;
  lang: string;
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

export interface WordRange {
  start: number;
  end: number;
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
const DEFAULT_RATE = 1;
const DEFAULT_PITCH = 1;
const DEFAULT_VOLUME = 1;

const clampRate = (nextRate: number): number => {
  if (Number.isNaN(nextRate)) {
    return DEFAULT_RATE;
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

const filterVoicesByGender = (
  browserVoices: SpeechSynthesisVoice[],
  gender?: "female" | "male",
): SpeechSynthesisVoice[] => {
  if (!gender) {
    return browserVoices;
  }

  const femalePattern =
    /female|woman|samantha|zira|victoria|karen|moira|tessa|fiona|veena|lekha|susan|linda|heather|serena|aria/i;
  const malePattern =
    /male|man|daniel|david|alex|fred|tom|rishi|mark|james|george|richard|guy|ryan|brian/i;

  const pattern = gender === "female" ? femalePattern : malePattern;
  const filtered = browserVoices.filter((voice) => pattern.test(voice.name));

  if (filtered.length < 3) {
    return browserVoices;
  }
  return filtered;
};

const toVoiceOptions = (
  browserVoices: SpeechSynthesisVoice[],
): SpeechVoiceOption[] =>
  browserVoices.map((voice) => ({
    id: getVoiceId(voice),
    label: voice.name,
    lang: voice.lang,
  }));

const getLanguageLabel = (lang: string): string => {
  try {
    const display = new Intl.DisplayNames([window.navigator.language || "en"], {
      type: "language",
    });
    return display.of(lang.split("-")[0]) ?? lang;
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
  return fallbackIndex >= 0
    ? Math.max(0, fallbackIndex - 1)
    : ranges.length - 1;
};

export const useSpeechSynthesis = (
  text: string = "",
  voiceGender?: "female" | "male",
): UseSpeechSynthesisResult => {
  const [isSupported, setIsSupported] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef(text);
  const wordRangesRef = useRef<WordRange[]>(buildWordRanges(text));
  const browserVoicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const [rateState, setRateState] = useState(DEFAULT_RATE);
  const [pitchState, setPitchState] = useState(DEFAULT_PITCH);
  const [volumeState, setVolumeState] = useState(DEFAULT_VOLUME);

  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>(
    [],
  );
  const [selectedVoiceId, setSelectedVoiceId] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");

  useEffect(() => {
    textRef.current = text;
    wordRangesRef.current = buildWordRanges(text);
  }, [text]);

  const resolveBrowserVoice = useCallback(
    (voiceId: string): SpeechSynthesisVoice | undefined => {
      const genderFiltered = filterVoicesByGender(
        browserVoicesRef.current,
        voiceGender,
      );

      return genderFiltered.find((voice) => getVoiceId(voice) === voiceId);
    },
    [voiceGender],
  );

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentWordIndex(0);
  }, []);

  // Initialize speech synthesis support + voice loading.
  useEffect(() => {
    if (!hasSpeechSupport()) {
      setIsSupported(false);
      setIsReady(false);
      setError("Text-to-speech is not supported in this browser.");
      return;
    }

    const speechSynthesis = window.speechSynthesis;
    synthRef.current = speechSynthesis;
    setIsSupported(true);

    const syncVoices = () => {
      const loadedVoices = speechSynthesis.getVoices();
      browserVoicesRef.current = loadedVoices;
      setBrowserVoices(loadedVoices);
      setIsReady(loadedVoices.length > 0);
    };

    syncVoices();
    speechSynthesis.onvoiceschanged = syncVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Stop any speech on unmount.
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Stop speaking whenever the source text changes.
  useEffect(() => {
    if (isSpeaking || isPaused) {
      stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const filteredVoices = useMemo(
    () => filterVoicesByGender(browserVoices, voiceGender),
    [browserVoices, voiceGender],
  );

  const voices = useMemo(
    () => toVoiceOptions(filteredVoices),
    [filteredVoices],
  );

  const languageOptions = useMemo<LanguageOption[]>(() => {
    const counts = new Map<string, number>();
    filteredVoices.forEach((voice) => {
      counts.set(voice.lang, (counts.get(voice.lang) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([lang, voiceCount]) => ({
        lang,
        label: getLanguageLabel(lang),
        voiceCount,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredVoices]);

  // Keep selectedVoiceId valid as the voice list changes.
  useEffect(() => {
    if (voices.length === 0) {
      return;
    }

    const voiceStillExists = voices.some(
      (voice) => voice.id === selectedVoiceId,
    );
    if (!voiceStillExists) {
      setSelectedVoiceId(voices[0].id);
    }
  }, [selectedVoiceId, voices]);

  // Keep selectedLanguage valid as the language list changes.
  useEffect(() => {
    if (languageOptions.length === 0) {
      return;
    }

    const languageStillExists = languageOptions.some(
      (option) => option.lang === selectedLanguage,
    );
    if (!languageStillExists) {
      setSelectedLanguage(languageOptions[0].lang);
    }
  }, [languageOptions, selectedLanguage]);

  const speakText = useCallback(
    (nextText?: string) => {
      const textToSpeak = (nextText ?? textRef.current).trim();

      if (!synthRef.current || !isSupported) {
        setError("Text-to-speech is not supported in this browser.");
        return;
      }

      if (!textToSpeak) {
        setError("No text to speak.");
        return;
      }

      // If speaking a different string than the hook's `text` prop,
      // recompute word ranges for accurate boundary tracking.
      if (nextText !== undefined && nextText !== textRef.current) {
        wordRangesRef.current = buildWordRanges(nextText);
      }

      stop();
      setError(null);

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance;
      utterance.rate = rateState;
      utterance.pitch = pitchState;
      utterance.volume = volumeState;
      utterance.lang = selectedLanguage;

      const browserVoice = resolveBrowserVoice(selectedVoiceId);
      if (browserVoice) {
        utterance.voice = browserVoice;
        utterance.lang = browserVoice.lang;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onresume = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onboundary = (event) => {
        if (event.name !== "word") {
          return;
        }

        const nextWordIndex = getWordIndexAtCharIndex(
          event.charIndex,
          wordRangesRef.current,
        );

        setCurrentWordIndex(nextWordIndex);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentWordIndex(
          wordRangesRef.current.length > 0
            ? wordRangesRef.current.length - 1
            : 0,
        );
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setError("Unable to play narration. Please try again.");
      };

      synthRef.current.cancel();
      synthRef.current.speak(utterance);
      setCurrentWordIndex(0);
    },

    [
      isSupported,
      rateState,
      pitchState,
      volumeState,
      resolveBrowserVoice,
      selectedVoiceId,
      selectedLanguage,
      stop,
    ],

    [isSupported, rateState, pitchState, volumeState, selectedVoiceId, selectedLanguage, stop, resolveBrowserVoice],

  );

  const pause = useCallback(() => {
    if (synthRef.current && isSpeaking && !isPaused) {
      synthRef.current.pause();
    }
  }, [isPaused, isSpeaking]);

  const resume = useCallback(() => {
    if (synthRef.current && isPaused) {
      synthRef.current.resume();
    }
  }, [isPaused]);

  const setRate = useCallback((nextRate: number) => {
    setRateState(clampRate(nextRate));
  }, []);

  const setPlaybackRate = useCallback((nextRate: number) => {
    setRateState(clampRate(nextRate));
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

  const setSelectedVoice = useCallback(
    (index: number) => {
      const voice = voices[index];
      if (voice) {
        setSelectedVoiceId(voice.id);
      }
    },
    [voices],
  );

  const progress = useMemo<SpeechProgress>(() => {
    const totalWords = wordRangesRef.current.length;

    if (totalWords === 0) {
      return {
        currentWordIndex: 0,
        totalWords: 0,
        percentage: 0,
      };
    }

    const boundedCurrentWordIndex = Math.min(
      Math.max(currentWordIndex, 0),
      totalWords - 1,
    );

    return {
      currentWordIndex: boundedCurrentWordIndex,
      totalWords,
      percentage: Math.min(1, (boundedCurrentWordIndex + 1) / totalWords),
    };
  }, [currentWordIndex]);

  const selectedVoiceIndex = useMemo(
    () => voices.findIndex((v) => v.id === selectedVoiceId),
    [voices, selectedVoiceId],
  );

  return {
    isPlaying: isSpeaking && !isPaused,
    isPaused,
    isSpeaking,
    play: speakText,
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
    availableVoices: browserVoices,
    selectedVoiceIndex,
    setSelectedVoice,
    playbackRate: rateState,
    setPlaybackRate,
    voices,
    selectedVoiceId,
    setSelectedVoiceId,
    selectedLanguage,
    setSelectedLanguage,
    languageOptions,
  };
};

export default useSpeechSynthesis;
