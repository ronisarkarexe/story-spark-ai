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
  if (Number.isNaN(nextRate)) return 1;
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
  if (!gender) return browserVoices;

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
  if (!inputText.trim()) return [];

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

const getWordIndexAtCharIndex = (charIndex: number, ranges: WordRange[]): number => {
  if (ranges.length === 0) return 0;

  const matchIndex = ranges.findIndex(
    (range) => charIndex >= range.start && charIndex <= range.end,
  );

  if (matchIndex >= 0) return matchIndex;

  const fallbackIndex = ranges.findIndex((range) => charIndex < range.start);
  return fallbackIndex >= 0 ? Math.max(0, fallbackIndex - 1) : ranges.length - 1;
};

const safeCancel = (synth: SpeechSynthesis | null) => {
  try {
    synth?.cancel();
  } catch {
    // ignore
  }
};

export const useSpeechSynthesis = (
  text: string,
  voiceGender?: "female" | "male",
): UseSpeechSynthesisResult => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const textRef = useRef(text);

  const [isSupported, setIsSupported] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [rate, setRateState] = useState(1);
  const [pitch, setPitchState] = useState(1);
  const [volume, setVolumeState] = useState(1);

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);

  const [selectedVoiceId, setSelectedVoiceIdState] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");

  const browserVoicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const wordRangesRef = useRef<WordRange[]>(buildWordRanges(text));

  const voices = useMemo(
    () => toVoiceOptions(filterVoicesByGender(browserVoicesRef.current, voiceGender)),
    [voiceGender, availableVoices],
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

  const resolveBrowserVoice = useCallback(
    (voiceId: string): SpeechSynthesisVoice | undefined => {
      const genderFiltered = filterVoicesByGender(browserVoicesRef.current, voiceGender);
      return genderFiltered.find((voice) => getVoiceId(voice) === voiceId);
    },
    [voiceGender],
  );

  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const resetNarrationState = useCallback(() => {
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentWordIndex(0);
  }, []);

  const stop = useCallback(() => {
    safeCancel(synthRef.current);
    utteranceRef.current = null;
    resetNarrationState();
  }, [resetNarrationState]);

  const applyUtteranceSettings = useCallback(
    (utterance: SpeechSynthesisUtterance) => {
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      utterance.lang = selectedLanguage;

      const browserVoice = selectedVoiceId ? resolveBrowserVoice(selectedVoiceId) : undefined;
      if (browserVoice) {
        utterance.voice = browserVoice;
        utterance.lang = browserVoice.lang;
      }
    },
    [pitch, rate, resolveBrowserVoice, selectedLanguage, selectedVoiceId, volume],
  );

  const setRate = useCallback((nextRate: number) => {
    const clamped = clampRate(nextRate);
    setRateState(clamped);

    if (utteranceRef.current) {
      utteranceRef.current.rate = clamped;
    }
  }, []);

  const setPlaybackRate = useCallback((nextRate: number) => {
    const clamped = clampRate(nextRate);
    setRateState(clamped);

    if (utteranceRef.current) {
      utteranceRef.current.rate = clamped;
    }
  }, []);

  const setPitch = useCallback((nextPitch: number) => {
    const safe = Number.isFinite(nextPitch) ? nextPitch : 1;
    setPitchState(safe);

    if (utteranceRef.current) {
      utteranceRef.current.pitch = safe;
    }
  }, []);

  const setVolume = useCallback((nextVolume: number) => {
    const safe = Number.isFinite(nextVolume) ? nextVolume : 1;
    setVolumeState(safe);

    if (utteranceRef.current) {
      utteranceRef.current.volume = safe;
    }
  }, []);

  const setSelectedVoice = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, index);
      const voiceOption = voices[clampedIndex];
      if (!voiceOption) return;
      setSelectedVoiceIndex(clampedIndex);
      setSelectedVoiceIdState(voiceOption.id);
      setSelectedLanguage(voiceOption.lang);
    },
    [voices],
  );

  const setSelectedVoiceId = useCallback(
    (id: string) => {
      const idx = voices.findIndex((v) => v.id === id);
      if (idx >= 0) setSelectedVoiceIndex(idx);
      setSelectedVoiceIdState(id);

      const voiceOption = voices.find((v) => v.id === id);
      if (voiceOption) setSelectedLanguage(voiceOption.lang);
    },
    [voices],
  );

  const setSelectedLanguageFn = useCallback((lang: string) => {
    setSelectedLanguage(lang);
  }, []);

  const play = useCallback(
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

      setError(null);

      stop(); // cancel any previous speech

      wordRangesRef.current = buildWordRanges(textToSpeak);

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance;

      applyUtteranceSettings(utterance);

      // State tracking
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setCurrentWordIndex(0);
      };

      utterance.onresume = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onboundary = (event) => {
        // word boundary support is inconsistent across browsers.
        if (event.name !== "word") return;

        const charIndex = (event as SpeechSynthesisEvent).charIndex;
        const nextIndex = getWordIndexAtCharIndex(charIndex, wordRangesRef.current);
        setCurrentWordIndex(nextIndex);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);

        const total = wordRangesRef.current.length;
        setCurrentWordIndex(total > 0 ? total - 1 : 0);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setError("Unable to play narration. Please try again.");
      };

      synthRef.current.speak(utterance);
    },
    [applyUtteranceSettings, isSupported, stop],
  );

  const pause = useCallback(() => {
    if (!synthRef.current || !isSpeaking || isPaused) return;
    synthRef.current.pause();
  }, [isPaused, isSpeaking]);

  const resume = useCallback(() => {
    if (!synthRef.current || !isPaused) return;
    synthRef.current.resume();
  }, [isPaused]);

  // Init support + voices
  useEffect(() => {
    const supported = hasSpeechSupport();
    setIsSupported(supported);
    setIsReady(false);
    setError(null);

    if (!supported) return;

    const speechSynthesis = window.speechSynthesis;
    synthRef.current = speechSynthesis;

    const syncVoices = () => {
      const v = speechSynthesis.getVoices();
      browserVoicesRef.current = v;
      setAvailableVoices(v);
      setIsReady(v.length > 0);

      const genderFiltered = filterVoicesByGender(v, voiceGender);
      if (genderFiltered.length > 0) {
        const first = genderFiltered[0];
        setSelectedVoiceIdState(getVoiceId(first));
        setSelectedVoiceIndex(0);
        setSelectedLanguage(first.lang);
      }
    };

    syncVoices();
    speechSynthesis.onvoiceschanged = syncVoices;

    return () => {
      try {
        speechSynthesis.onvoiceschanged = null;
      } catch {
        // ignore
      }
    };
  }, [voiceGender]);

  // Keep refs in sync
  useEffect(() => {
    textRef.current = text;
    wordRangesRef.current = buildWordRanges(text);
  }, [text]);

  // If voices change and selected voice disappears, reset
  useEffect(() => {
    if (voices.length === 0) return;
    const exists = voices.some((v) => v.id === selectedVoiceId);
    if (!exists) {
      setSelectedVoiceIdState(voices[0].id);
      setSelectedVoiceIndex(0);
      setSelectedLanguage(voices[0].lang);
    }
  }, [selectedVoiceId, setSelectedLanguageFn, voices]);

  // If selectedLanguage becomes invalid, reset to first
  useEffect(() => {
    if (languageOptions.length === 0) return;
    const exists = languageOptions.some((o) => o.lang === selectedLanguage);
    if (!exists) {
      setSelectedLanguage(languageOptions[0].lang);
    }
  }, [languageOptions, selectedLanguage]);

  // Update current utterance params while playing (best-effort)
  useEffect(() => {
    if (!utteranceRef.current) return;
    utteranceRef.current.rate = rate;
  }, [rate]);

  useEffect(() => {
    if (!utteranceRef.current) return;
    utteranceRef.current.pitch = pitch;
  }, [pitch]);

  useEffect(() => {
    if (!utteranceRef.current) return;
    utteranceRef.current.volume = volume;
  }, [volume]);

  // Cleanup
  useEffect(() => {
    return () => stop();
  }, [stop]);

  const progress = useMemo<SpeechProgress>(() => {
    const totalWords = wordRangesRef.current.length;
    if (totalWords === 0) {
      return { currentWordIndex: 0, totalWords: 0, percentage: 0 };
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

  // Keep legacy API fields expected by interface
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
    isLoading: isSupported && !isReady,
    availableVoices,
    selectedVoiceIndex,
    setSelectedVoice,
    playbackRate: rate,
    setPlaybackRate,
    voices,
    selectedVoiceId,
    setSelectedVoiceId,
    selectedLanguage,
    setSelectedLanguage: setSelectedLanguageFn,
    languageOptions,
  };
};

export default useSpeechSynthesis;

