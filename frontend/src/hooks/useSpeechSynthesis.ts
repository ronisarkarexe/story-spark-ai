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
  play: (nextText?: unknown) => void;
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

export const useSpeechSynthesis = (
  text = "",
  voiceGender?: "female" | "male",
): UseSpeechSynthesisResult => {
  const [isSupported, setIsSupported] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [rate, setRateState] = useState(1);
  const [pitchState, setPitchState] = useState(1);
  const [volumeState, setVolumeState] = useState(1);

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);

  const [selectedVoiceId, setSelectedVoiceId] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef(text);
  const previousTextRef = useRef(text);
  const wordRangesRef = useRef<WordRange[]>(buildWordRanges(text));
  const sessionRef = useRef(0);
  const currentWordIndexRef = useRef(0);

  useEffect(() => {
    textRef.current = text;
    wordRangesRef.current = buildWordRanges(text);
  }, [text]);

  const voices = useMemo(
    () => toVoiceOptions(filterVoicesByGender(availableVoices, voiceGender)),
    [availableVoices, voiceGender],
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

  const stop = useCallback(() => {
    sessionRef.current += 1;
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    utteranceRef.current = null;
    setIsPlaying(false);
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentWordIndex(0);
    currentWordIndexRef.current = 0;
  }, []);

  const clearUtterance = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    utteranceRef.current = null;
  }, []);

  const resolveBrowserVoice = useCallback(
    (voiceId: string): SpeechSynthesisVoice | undefined => {
      return availableVoices.find((voice) => getVoiceId(voice) === voiceId);
    },
    [availableVoices],
  );

  const play = useCallback(
    (nextText?: unknown) => {
      if (!isSupported || !synthRef.current) {
        setError("Text-to-speech is not supported in this browser.");
        return;
      }

      const textToSpeak = (typeof nextText === "string" ? nextText : textRef.current).trim();
      if (!textToSpeak) {
        setError("No text to speak.");
        return;
      }

      stop();
      setError(null);
      
      sessionRef.current += 1;
      const sessionId = sessionRef.current;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance;
      utterance.rate = rate;
      utterance.pitch = pitchState;
      utterance.volume = volumeState;

      // Select voice
      let voiceToUse: SpeechSynthesisVoice | undefined;
      if (selectedVoiceId) {
        voiceToUse = resolveBrowserVoice(selectedVoiceId);
      } else if (availableVoices.length > 0) {
        voiceToUse = availableVoices[selectedVoiceIndex];
      }

      if (voiceToUse) {
        utterance.voice = voiceToUse;
        utterance.lang = voiceToUse.lang;
      } else {
        utterance.lang = selectedLanguage;
      }

      utterance.onstart = () => {
        if (sessionRef.current !== sessionId) return;
        setIsPlaying(true);
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onresume = () => {
        if (sessionRef.current !== sessionId) return;
        setIsPlaying(true);
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onpause = () => {
        if (sessionRef.current !== sessionId) return;
        setIsPlaying(false);
        setIsPaused(true);
      };

      utterance.onboundary = (event) => {
        if (sessionRef.current !== sessionId) return;
        if (event.name !== "word") return;

        if (typeof event.charIndex === "number") {
          const idx = getWordIndexAtCharIndex(event.charIndex, wordRangesRef.current);
          setCurrentWordIndex(idx);
          currentWordIndexRef.current = idx;
        }
      };

      utterance.onend = () => {
        if (sessionRef.current !== sessionId) return;
        utteranceRef.current = null;
        setIsPlaying(false);
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentWordIndex(wordRangesRef.current.length);
        currentWordIndexRef.current = wordRangesRef.current.length;
      };

      utterance.onerror = (event) => {
        if (sessionRef.current !== sessionId) return;
        utteranceRef.current = null;
        setIsPlaying(false);
        setIsSpeaking(false);
        setIsPaused(false);
        if (event.error !== "interrupted") {
          setError("Narration failed to play.");
        }
      };

      synthRef.current.speak(utterance);
    },
    [
      isSupported,
      rate,
      pitchState,
      volumeState,
      selectedVoiceId,
      availableVoices,
      selectedVoiceIndex,
      selectedLanguage,
      resolveBrowserVoice,
      stop,
    ],
  );

  const pause = useCallback(() => {
    if (synthRef.current && isSpeaking && !isPaused) {
      synthRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  }, [isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (synthRef.current && isPaused) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
    }
  }, [isPaused]);

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

  const setSelectedVoice = useCallback((index: number) => {
    if (index >= 0 && index < availableVoices.length) {
      setSelectedVoiceIndex(index);
      const voice = availableVoices[index];
      setSelectedVoiceId(getVoiceId(voice));
      setSelectedLanguage(voice.lang);
    }
  }, [availableVoices]);

  const setSelectedLanguageState = useCallback((lang: string) => {
    setSelectedLanguage(lang);
    const matchedVoice = availableVoices.find((v) => v.lang === lang);
    if (matchedVoice) {
      setSelectedVoiceId(getVoiceId(matchedVoice));
    }
  }, [availableVoices]);

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
      const voicesList = speechSynthesis.getVoices();
      setAvailableVoices(voicesList);
      setIsReady(voicesList.length > 0);
    };

    syncVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = syncVoices;
    }

    return () => {
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = null;
      }
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
    const boundedIdx = Math.min(Math.max(currentWordIndex, 0), totalWords);
    return {
      currentWordIndex: boundedIdx,
      totalWords,
      percentage: totalWords > 0 ? boundedIdx / totalWords : 0,
    };
  }, [currentWordIndex]);

  return {
    isPlaying,
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
    availableVoices,
    selectedVoiceIndex,
    setSelectedVoice,
    playbackRate: rate,
    setPlaybackRate: setRate,
    voices,
    selectedVoiceId,
    setSelectedVoiceId,
    selectedLanguage,
    setSelectedLanguage: setSelectedLanguageState,
    languageOptions,
  };
};

export default useSpeechSynthesis;
