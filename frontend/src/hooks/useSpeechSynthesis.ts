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

  const matchIndex = ranges.findIndex(
    (range) => charIndex >= range.start && charIndex <= range.end,
  );

  if (matchIndex >= 0) {
    return matchIndex;
  }

  const fallbackIndex = ranges.findIndex((range) => charIndex < range.start);
  return fallbackIndex >= 0 ? Math.max(0, fallbackIndex - 1) : ranges.length - 1;
};

const findVoiceForLanguage = (
  availableVoices: SpeechVoiceOption[],
  lang: string,
): SpeechVoiceOption | undefined => {
  return (
    availableVoices.find((v) => v.lang === lang) ||
    availableVoices.find((v) => v.lang.startsWith(lang.split("-")[0]))
  );
};

export const useSpeechSynthesis = (
  text: string,
  voiceGender?: "female" | "male",
): UseSpeechSynthesisResult => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sessionRef = useRef(0);
  const previousTextRef = useRef(text);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const wordRangesRef = useRef<WordRange[]>(buildWordRanges(text));
  const currentWordIndexRef = useRef(0);

  const [isSupported, setIsSupported] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [rate, setRateState] = useState(1);
  const [pitchState, setPitchState] = useState(1);
  const [volumeState, setVolumeState] = useState(1);

  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceId, setSelectedVoiceIdState] = useState("");
  const [selectedLanguage, setSelectedLanguageState] = useState("en-US");

  useEffect(() => {
    wordRangesRef.current = buildWordRanges(text);
  }, [text]);

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

  const selectedVoiceIndex = useMemo(() => {
    return browserVoices.findIndex((v) => getVoiceId(v) === selectedVoiceId);
  }, [browserVoices, selectedVoiceId]);

  const setSelectedVoice = useCallback((index: number) => {
    const voice = browserVoices[index];
    if (voice) {
      setSelectedVoiceIdState(getVoiceId(voice));
    }
  }, [browserVoices]);

  const resetNarrationState = useCallback(() => {
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentWordIndex(0);
    currentWordIndexRef.current = 0;
  }, []);

  const clearUtterance = useCallback(() => {
    utteranceRef.current = null;
    if (synthRef.current) {
      synthRef.current.cancel();
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
      setError("No text to speak.");
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
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rate;
    utterance.pitch = pitchState;
    utterance.volume = volumeState;
    utterance.lang = selectedLanguage;

    const browserVoice = browserVoices.find((v) => getVoiceId(v) === selectedVoiceId);
    if (browserVoice) {
      utterance.voice = browserVoice;
      utterance.lang = browserVoice.lang;
    }

    utterance.onstart = () => {
      if (sessionRef.current !== sessionId) return;
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onboundary = (event) => {
      if (sessionRef.current !== sessionId) return;
      if (event.name === "word" && typeof event.charIndex === "number") {
        const idx = getWordIndexAtCharIndex(event.charIndex, wordRangesRef.current);
        setCurrentWordIndex(idx);
        currentWordIndexRef.current = idx;
      }
    };

    utterance.onend = () => {
      if (sessionRef.current !== sessionId) return;
      utteranceRef.current = null;
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWordIndex(wordRangesRef.current.length);
      currentWordIndexRef.current = wordRangesRef.current.length;
    };

    utterance.onerror = (event) => {
      if (sessionRef.current !== sessionId) return;
      utteranceRef.current = null;
      setIsSpeaking(false);
      setIsPaused(false);
      if (event.error !== "interrupted") {
        setError("Narration failed to play.");
      }
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [isSupported, isReady, text, rate, pitchState, volumeState, selectedLanguage, selectedVoiceId, browserVoices, clearUtterance]);

  const pause = useCallback(() => {
    if (synthRef.current && isSpeaking && !isPaused) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  }, [isPaused, isSpeaking]);

  const resume = useCallback(() => {
    if (synthRef.current && isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  const setRate = useCallback((nextRate: number) => {
    const clamped = clampRate(nextRate);
    setRateState(clamped);

    if (synthRef.current && synthRef.current.speaking && utteranceRef.current) {
      const wasPaused = synthRef.current.paused;
      const resumeFromWord = currentWordIndexRef.current;

      synthRef.current.cancel();
      utteranceRef.current = null;

      if (wasPaused) {
        setIsSpeaking(false);
        setIsPaused(false);
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
      utterance.rate = clamped;
      utterance.pitch = pitchState;
      utterance.volume = volumeState;
      utterance.lang = selectedLanguage;

      const browserVoice = browserVoices.find((v) => getVoiceId(v) === selectedVoiceId);
      if (browserVoice) {
        utterance.voice = browserVoice;
      }

      utterance.onboundary = (event) => {
        if (sessionRef.current !== sessionId) return;
        if (event.name === "word" && typeof event.charIndex === "number") {
          const localIndex = getWordIndexAtCharIndex(event.charIndex, buildWordRanges(remainingText));
          setCurrentWordIndex(resumeFromWord + localIndex);
          currentWordIndexRef.current = resumeFromWord + localIndex;
        }
      };

      utterance.onend = () => {
        if (sessionRef.current !== sessionId) return;
        utteranceRef.current = null;
        setIsSpeaking(false);
        setIsPaused(false);
        const total = wordRangesRef.current.length;
        setCurrentWordIndex(total);
        currentWordIndexRef.current = total;
      };

      utterance.onerror = (event) => {
        if (sessionRef.current !== sessionId) return;
        utteranceRef.current = null;
        setIsSpeaking(false);
        setIsPaused(false);
        if (event.error !== "interrupted") setError("Narration failed to play.");
      };

      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    }
  }, [text, pitchState, volumeState, selectedLanguage, selectedVoiceId, browserVoices]);

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
    setSelectedLanguageState(nextLanguage);
    const matchedVoice = findVoiceForLanguage(voices, nextLanguage);
    if (matchedVoice) {
      setSelectedVoiceIdState(matchedVoice.id);
    }
  }, [stop, voices]);

  const setSelectedVoiceId = useCallback((nextVoiceId: string) => {
    stop();
    setSelectedVoiceIdState(nextVoiceId);
    const matchedVoice = voices.find((v) => v.id === nextVoiceId);
    if (matchedVoice) {
      setSelectedLanguageState(matchedVoice.lang);
    }
  }, [stop, voices]);

  useEffect(() => {
    if (!hasSpeechSupport()) {
      setIsSupported(false);
      setIsReady(false);
      setError("Speech synthesis is not supported in this browser.");
      return;
    }

    const speechSynthesis = window.speechSynthesis;
    synthRef.current = speechSynthesis;
    setIsSupported(true);

    const syncVoices = () => {
      const loaded = speechSynthesis.getVoices();
      setBrowserVoices(loaded);
      setIsReady(loaded.length > 0);
    };

    syncVoices();
    speechSynthesis.onvoiceschanged = syncVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
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

  const progress = useMemo<SpeechProgress>(() => {
    const totalWords = wordRangesRef.current.length;
    if (totalWords === 0) {
      return { currentWordIndex: 0, totalWords: 0, percentage: 0 };
    }
    const boundedIdx = Math.min(Math.max(currentWordIndex, 0), totalWords - 1);
    return {
      currentWordIndex: boundedIdx,
      totalWords,
      percentage: totalWords > 0 ? (boundedIdx + 1) / totalWords : 0,
    };
  }, [currentWordIndex]);

  return {
    isPlaying: isSpeaking && !isPaused,
    isPaused,
    isSpeaking,
    play,
    pause,
    resume,
    stop,
    rate,
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
    playbackRate: rate,
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
