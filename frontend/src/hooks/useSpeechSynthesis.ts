import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  if (Number.isNaN(nextRate)) return 1;
  return Math.min(SPEED_MAX, Math.max(SPEED_MIN, nextRate));
};

const hasSpeechSupport = (): boolean =>
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  "SpeechSynthesisUtterance" in window;

const getVoiceId = (voice: SpeechSynthesisVoice): string =>
  voice.voiceURI || `${voice.name}-${voice.lang}`;

const buildWordRanges = (inputText: string): Array<{ start: number; end: number }> => {
  const ranges: Array<{ start: number; end: number }> = [];
  for (const match of inputText.matchAll(/\S+/g)) {
    const start = match.index ?? 0;
    ranges.push({ start, end: start + match[0].length });
  }
  return ranges;
};

const getWordIndexAtCharIndex = (
  charIndex: number,
  ranges: Array<{ start: number; end: number }>,
): number => {
  if (!ranges.length) return 0;
  const exactIndex = ranges.findIndex((range) => charIndex >= range.start && charIndex <= range.end);
  if (exactIndex >= 0) return exactIndex;
  const fallbackIndex = ranges.findIndex((range) => charIndex < range.start);
  return fallbackIndex >= 0 ? Math.max(0, fallbackIndex - 1) : ranges.length - 1;
};

const filterVoicesByGender = (
  browserVoices: SpeechSynthesisVoice[],
  gender?: "female" | "male",
): SpeechSynthesisVoice[] => {
  if (!gender) return browserVoices;

  const femalePattern =
    /female|woman|samantha|zira|victoria|karen|moira|tessa|fiona|veena|lekha|susan|linda|heather|serena|aria/i;
  const malePattern =
    /male|man|daniel|david|alex|fred|tom|rishi|mark|james|george|richard|guy|ryan|brian/i;

  const pattern = gender === "female" ? femalePattern : malePattern;
  const filtered = browserVoices.filter((voice) => pattern.test(voice.name));
  return filtered.length >= 3 ? filtered : browserVoices;
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

export const useSpeechSynthesis = (
  text: string = "",
  voiceGender?: "female" | "male",
): UseSpeechSynthesisResult => {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentTextRef = useRef(text);
  const currentRangesRef = useRef<Array<{ start: number; end: number }>>([]);

  const [isSupported, setIsSupported] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [selectedVoiceId, setSelectedVoiceId] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    currentTextRef.current = text;
    currentRangesRef.current = buildWordRanges(text);
    setCurrentWordIndex(0);
  }, [text]);

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
      const loadedVoices = filterVoicesByGender(speechSynthesis.getVoices(), voiceGender);
      setAvailableVoices(loadedVoices);
      setIsReady(loadedVoices.length > 0);

      if (loadedVoices.length > 0 && !selectedVoiceId) {
        const firstVoice = loadedVoices[0];
        setSelectedVoiceId(getVoiceId(firstVoice));
        setSelectedVoiceIndex(0);
        setSelectedLanguage(firstVoice.lang);
      }
    };

    syncVoices();
    speechSynthesis.onvoiceschanged = syncVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoiceId, voiceGender]);

  const voices = useMemo(() => toVoiceOptions(availableVoices), [availableVoices]);

  const languageOptions = useMemo(() => {
    const map = new Map<string, number>();
    for (const voice of availableVoices) {
      map.set(voice.lang, (map.get(voice.lang) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([lang, count]) => ({
      lang,
      label: getLanguageLabel(lang),
      voiceCount: count,
    }));
  }, [availableVoices]);

  const stop = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setIsLoading(false);
    setCurrentWordIndex(0);
  }, []);

  const pause = useCallback(() => {
    synthRef.current?.pause();
    setIsPaused(true);
    setIsSpeaking(true);
  }, []);

  const resume = useCallback(() => {
    synthRef.current?.resume();
    setIsPaused(false);
    setIsSpeaking(true);
  }, []);

  const play = useCallback(
    (nextText?: string) => {
      const textToSpeak = (nextText ?? currentTextRef.current).trim();
      if (!synthRef.current || !isSupported) {
        setError("Text-to-speech is not supported in this browser.");
        return;
      }

      if (!textToSpeak) {
        setError("No text to speak.");
        return;
      }

      stop();
      setError(null);
      setIsLoading(true);

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const selectedVoice = availableVoices[selectedVoiceIndex] ?? availableVoices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        setSelectedVoiceId(getVoiceId(selectedVoice));
        setSelectedLanguage(selectedVoice.lang);
      }

      utterance.rate = clampRate(rate);
      utterance.pitch = pitch;
      utterance.volume = volume;

      utterance.onstart = () => {
        setIsLoading(false);
        setIsSpeaking(true);
        setIsPaused(false);
        setCurrentWordIndex(0);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setIsLoading(false);
        setCurrentWordIndex(currentRangesRef.current.length);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setIsLoading(false);
        setError("Unable to play narration.");
      };

      utterance.onboundary = (event) => {
        if (typeof event.charIndex === "number") {
          setCurrentWordIndex(
            getWordIndexAtCharIndex(event.charIndex, currentRangesRef.current),
          );
        }
      };

      synthRef.current.cancel();
      synthRef.current.speak(utterance);
    },
    [availableVoices, isSupported, pitch, rate, selectedVoiceIndex, stop, volume],
  );

  const setPlaybackRate = useCallback((nextRate: number) => {
    setRate(clampRate(nextRate));
  }, []);

  const setSelectedVoice = useCallback(
    (index: number) => {
      const voice = availableVoices[index];
      if (!voice) return;
      setSelectedVoiceIndex(index);
      setSelectedVoiceId(getVoiceId(voice));
      setSelectedLanguage(voice.lang);
    },
    [availableVoices],
  );

  const setSelectedVoiceIdAndSync = useCallback(
    (id: string) => {
      const index = availableVoices.findIndex((voice) => getVoiceId(voice) === id);
      if (index >= 0) setSelectedVoice(index);
    },
    [availableVoices, setSelectedVoice],
  );

  const setSelectedLanguageAndSync = useCallback(
    (lang: string) => {
      setSelectedLanguage(lang);
      const index = availableVoices.findIndex((voice) => voice.lang === lang);
      if (index >= 0) setSelectedVoice(index);
    },
    [availableVoices, setSelectedVoice],
  );

  const progress = useMemo<SpeechProgress>(() => {
    const totalWords = currentRangesRef.current.length;
    const safeCurrent = Math.min(currentWordIndex, Math.max(0, totalWords - 1));
    return {
      currentWordIndex: safeCurrent,
      totalWords,
      percentage: totalWords > 0 ? Math.min(100, Math.round((safeCurrent / totalWords) * 100)) : 0,
    };
  }, [currentWordIndex]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

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
    pitch,
    setPitch,
    volume,
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
    playbackRate: rate,
    setPlaybackRate,
    voices,
    selectedVoiceId,
    setSelectedVoiceId: setSelectedVoiceIdAndSync,
    selectedLanguage,
    setSelectedLanguage: setSelectedLanguageAndSync,
    languageOptions,
  };
};

export default useSpeechSynthesis;
