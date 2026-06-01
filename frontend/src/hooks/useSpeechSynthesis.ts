import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type WordRange = {
  start: number;
  end: number;
};

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

export interface UseSpeechSynthesisResult {
  isPlaying: boolean;
  isPaused: boolean;
  isSpeaking: boolean;
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  rate: number;
  setRate: (nextRate: number) => void;
  pitch: number;
  setPitch: (nextPitch: number) => void;
  volume: number;
  setVolume: (nextVolume: number) => void;
  voices: SpeechVoiceOption[];
  languageOptions: SpeechLanguageOption[];
  selectedLanguage: string;
  setSelectedLanguage: (nextLanguage: string) => void;
  selectedVoiceId: string;
  setSelectedVoiceId: (nextVoiceId: string) => void;
  progress: SpeechProgress;
  isSupported: boolean;
  isReady: boolean;
  error: string | null;
  currentWordIndex: number;
  voices: SpeechVoiceOption[];
  selectedVoiceId: string;
  setSelectedVoiceId: (id: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  languageOptions: LanguageOption[];
}

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

  return filtered.length > 0 ? filtered : browserVoices;
};

const toVoiceOptions = (browserVoices: SpeechSynthesisVoice[]): SpeechVoiceOption[] =>
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

const getVoiceId = (voice: SpeechSynthesisVoice): string => {
  return voice.voiceURI || `${voice.name}-${voice.lang}`;
};

const getLanguageLabel = (languageCode: string): string => {
  try {
    const [language] = languageCode.split("-");
    const displayNames = new Intl.DisplayNames([window.navigator.language || "en"], {
      type: "language",
    });
    const languageName = displayNames.of(languageCode) || displayNames.of(language) || languageCode;
    return languageName;
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

const getPreferredLanguage = (): string => {
  return window.navigator.language || "en-US";
};

const findVoiceForLanguage = (
  voices: SpeechVoiceOption[],
  language: string,
): SpeechVoiceOption | undefined => {
  const normalizedLanguage = language.toLowerCase();
  const languagePrefix = normalizedLanguage.split("-")[0];

  return (
    voices.find((voice) => voice.lang.toLowerCase() === normalizedLanguage) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith(`${languagePrefix}-`)) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith(languagePrefix))
  );
};

export const useSpeechSynthesis = (
  text: string,
  voiceGender?: "female" | "male",
): UseSpeechSynthesisResult => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sessionRef = useRef(0);
  const previousTextRef = useRef(text);
  const currentWordIndexRef = useRef(0);

  const [isSupported, setIsSupported] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rateState, setRateState] = useState(1);
  const [pitchState, setPitchState] = useState(1);
  const [volumeState, setVolumeState] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");

  const voices = useMemo(
    () => toVoiceOptions(filterVoicesByGender(browserVoices, voiceGender)),
    [browserVoices, voiceGender],
  );

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

  const resolveBrowserVoice = useCallback(
    (voiceId: string): SpeechSynthesisVoice | undefined => {
      const genderFiltered = filterVoicesByGender(browserVoicesRef.current, voiceGender);
      return genderFiltered.find((voice) => getVoiceId(voice) === voiceId);
    },
    [voiceGender],
  );

  const resetNarrationState = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setIsSpeaking(false);
    setCurrentWordIndex(0);
    currentWordIndexRef.current = 0;
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

  const play = useCallback(() => {
    if (!isSupported) {
      setError("Speech synthesis is not supported in this browser.");
      return;
    }

    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("No story text is available for narration.");
      return;
    }

    if (!isReady) {
      setError("Speech voices are still loading. Please try again in a moment.");
      return;
    }

    const speechSynthesis = window.speechSynthesis;
    sessionRef.current += 1;
    const sessionId = sessionRef.current;

    clearUtterance();
    setError(null);
    setCurrentWordIndex(0);
    currentWordIndexRef.current = 0;
    setIsPaused(false);
    setIsPlaying(true);
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rateState;
    utterance.pitch = pitchState;
    utterance.volume = volumeState;
    utterance.lang = selectedVoice?.lang || selectedLanguage || getPreferredLanguage();

    const browserVoice = speechSynthesis
      .getVoices()
      .find((voice) => getVoiceId(voice) === selectedVoiceId);

    const browserVoice = resolveBrowserVoice(selectedVoiceId);
    if (browserVoice) {
      utterance.voice = browserVoice;
      utterance.lang = browserVoice.lang;
    } else {
      const matchedVoice = findVoiceByGender(speechSynthesis.getVoices(), voiceGender);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      }
    }

    utterance.onstart = () => {
      if (sessionRef.current !== sessionId) {
        return;
      }
      setIsPlaying(true);
      setIsPaused(false);
      setIsSpeaking(true);
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (sessionRef.current !== sessionId) {
        return;
      }
      if (typeof event.charIndex === "number") {
        setCurrentWordIndex(getWordIndexAtCharIndex(event.charIndex, wordRanges));
      }
    };

    utterance.onend = () => {
      if (sessionRef.current !== sessionId) {
        return;
      }
      utteranceRef.current = null;
      setIsPlaying(false);
      setIsPaused(false);
      setIsSpeaking(false);
      setCurrentWordIndex(totalWords);
      currentWordIndexRef.current = totalWords;
    };

    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      if (sessionRef.current !== sessionId) {
        return;
      }
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
    pitchState,
    rateState,
    pitchState,
    volumeState,
    selectedLanguage,
    selectedVoiceId,
    text,
    totalWords,
    voiceGender,
    wordRanges,
  ]);

  const pause = useCallback(() => {
    if (!isSupported || !utteranceRef.current) {
      return;
    }
    const speechSynthesis = window.speechSynthesis;
    if (!speechSynthesis.speaking || speechSynthesis.paused) {
      return;
    }
    speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
    setIsSpeaking(true);
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported || !utteranceRef.current) {
      return;
    }
    const speechSynthesis = window.speechSynthesis;
    if (!speechSynthesis.paused) {
      return;
    }
    speechSynthesis.resume();
    setIsPlaying(true);
    setIsPaused(false);
    setIsSpeaking(true);
  }, [isSupported]);

  const setRate = useCallback((nextRate: number) => {
    setRateState(nextRate);
    if (!utteranceRef.current || !window.speechSynthesis.speaking) {
      return;
    }
    const speechSynthesis = window.speechSynthesis;
    const wasPaused = speechSynthesis.paused;
    const resumeFromWord = currentWordIndexRef.current;

    speechSynthesis.cancel();
    utteranceRef.current = null;

    if (wasPaused) {
      setIsPlaying(false);
      setIsPaused(false);
      setIsSpeaking(false);
      return;
    }

    const remainingText = text
      .split(/\s+/)
      .slice(resumeFromWord)
      .join(" ");

    if (!remainingText.trim()) return;

    sessionRef.current += 1;
    const sessionId = sessionRef.current;

    const utterance = new SpeechSynthesisUtterance(remainingText);
    utterance.rate = nextRate;
    utterance.lang = selectedVoice?.lang || selectedLanguage || getPreferredLanguage();
    
    const browserVoice = speechSynthesis
      .getVoices()
      .find((voice) => getVoiceId(voice) === selectedVoiceId);

    if (browserVoice) {
      utterance.voice = browserVoice;
    }

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (sessionRef.current !== sessionId) return;
      if (typeof event.charIndex === "number") {
        const localIndex = getWordIndexAtCharIndex(event.charIndex, buildWordRanges(remainingText));
        setCurrentWordIndex(resumeFromWord + localIndex);
        currentWordIndexRef.current = resumeFromWord + localIndex;
      }
    };

    utterance.onend = () => {
      if (sessionRef.current !== sessionId) return;
      utteranceRef.current = null;
      setIsPlaying(false);
      setIsPaused(false);
      setIsSpeaking(false);
      setCurrentWordIndex(totalWords);
      currentWordIndexRef.current = totalWords;
    };

    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      if (sessionRef.current !== sessionId) return;
      utteranceRef.current = null;
      setIsPlaying(false);
      setIsPaused(false);
      setIsSpeaking(false);
      if (event.error !== "interrupted") setError("Narration failed to play.");
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [text, totalWords, selectedVoice, selectedLanguage, selectedVoiceId]);

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

  const setSelectedLanguage = useCallback((nextLanguage: string) => {
    stop();
    setError(null);
    setSelectedLanguageState(nextLanguage);
    const nextVoice = findVoiceForLanguage(voices, nextLanguage);
    setSelectedVoiceIdState(nextVoice?.id || "");
  }, [stop, voices]);

  const setSelectedVoiceId = useCallback((nextVoiceId: string) => {
    stop();
    setError(null);
    setSelectedVoiceIdState(nextVoiceId);
    const nextVoice = voices.find((voice) => voice.id === nextVoiceId);
    if (nextVoice) {
      setSelectedLanguageState(nextVoice.lang);
    }
  }, [stop, voices]);

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
      if (!isMounted) {
        return;
      }

      const availableVoices = speechSynthesis.getVoices().map(mapVoiceOption);
      setVoices(availableVoices);
      setIsReady(availableVoices.length > 0);

      if (availableVoices.length > 0) {
        setSelectedLanguageState((currentLanguage) => {
          const nextLanguage = currentLanguage || getPreferredLanguage();
          const matchedVoice = findVoiceForLanguage(availableVoices, nextLanguage) || availableVoices.find((voice) => voice.isDefault) || availableVoices[0];
          setSelectedVoiceIdState((currentVoiceId) => currentVoiceId || matchedVoice.id);
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
  }, []);

  useEffect(() => {
    if (voices.length === 0) {
      return;
    }

    const voiceStillExists = voices.some((voice) => voice.id === selectedVoiceId);
    if (!voiceStillExists) {
      setSelectedVoiceId(voices[0].id);
    }
  }, [selectedVoiceId, voices]);

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
    voices,
    selectedVoiceId,
    setSelectedVoiceId,
    selectedLanguage,
    setSelectedLanguage,
    languageOptions,
  };
};

export default useSpeechSynthesis;
