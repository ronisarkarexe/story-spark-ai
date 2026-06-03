import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type WordRange = {
  start: number;
  end: number;
};

export interface SpeechVoiceOption {
  id: string;
  label: string;
  lang: string;
  name?: string;
  localService?: boolean;
  isDefault?: boolean;
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
  languageOptions: LanguageOption[];
  selectedLanguage: string;
  setSelectedLanguage: (nextLanguage: string) => void;
  selectedVoiceId: string;
  setSelectedVoiceId: (nextVoiceId: string) => void;
  progress: SpeechProgress;
  isSupported: boolean;
  isReady: boolean;
  error: string | null;
  currentWordIndex: number;
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

const mapVoiceOption = (voice: SpeechSynthesisVoice): SpeechVoiceOption => ({
  id: getVoiceId(voice),
  label: voice.name,
  lang: voice.lang,
  name: voice.name,
  localService: voice.localService,
  isDefault: voice.default,
});

const toVoiceOptions = (browserVoices: SpeechSynthesisVoice[]): SpeechVoiceOption[] =>
  browserVoices.map(mapVoiceOption);

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

const findVoiceByGender = (
  browserVoices: SpeechSynthesisVoice[],
  gender?: "female" | "male",
): SpeechSynthesisVoice | undefined => {
  const filtered = filterVoicesByGender(browserVoices, gender);
  return filtered.find((voice) => voice.default) || filtered[0];
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
  const [selectedVoiceId, setSelectedVoiceIdState] = useState("");
  const [selectedLanguage, setSelectedLanguageState] = useState("en-US");

  const voices = useMemo(
    () => toVoiceOptions(filterVoicesByGender(browserVoices, voiceGender)),
    [browserVoices, voiceGender],
  );

  const selectedVoice = useMemo(
    () => voices.find((v) => v.id === selectedVoiceId),
    [voices, selectedVoiceId],
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
      const genderFiltered = filterVoicesByGender(browserVoices, voiceGender);
      return genderFiltered.find((voice) => getVoiceId(voice) === voiceId);
    },
    [browserVoices, voiceGender],
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
    volumeState,
    selectedVoice,
    selectedLanguage,
    selectedVoiceId,
    text,
    totalWords,
    voiceGender,
    wordRanges,
    resolveBrowserVoice,
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
    
    const browserVoice = resolveBrowserVoice(selectedVoiceId);

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
  }, [text, totalWords, selectedVoice, selectedLanguage, selectedVoiceId, resolveBrowserVoice]);

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

      const rawVoices = speechSynthesis.getVoices();
      setBrowserVoices(rawVoices);
      setIsReady(rawVoices.length > 0);

      if (rawVoices.length > 0) {
        setSelectedLanguageState((currentLanguage) => {
          const nextLanguage = currentLanguage || getPreferredLanguage();
          const mappedVoices = rawVoices.map(mapVoiceOption);
          const matchedVoice = findVoiceForLanguage(mappedVoices, nextLanguage) || mappedVoices.find((voice) => voice.isDefault) || mappedVoices[0];
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
      setSelectedVoiceIdState(voices[0].id);
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
      setSelectedLanguageState(languageOptions[0].lang);
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
