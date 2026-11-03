import { useRef, useCallback } from "react";

export interface WritingMetrics {
  prompt_length: number;
  time_to_submit: number;
  regeneration_count: number;
  session_duration: number;
  backspace_ratio: number;
  pause_duration: number;
  confidence_score: number;
  blocked_word_count: number;
}

const BLOCKED_WORDS = [
  "ugh", "stuck", "help", "idk", "nothing", "blank",
  "no idea", "can't", "cannot", "hmm", "dunno", "whatever",
];

const WINDOW_SECONDS = 30;
const SEQ_LEN = 10;

interface UseWritingMetricsOptions {
  onSessionReady: (session: WritingMetrics[]) => void;
}

export function useWritingMetrics({ onSessionReady }: UseWritingMetricsOptions) {
  const totalKeys      = useRef(0);
  const backspaceKeys  = useRef(0);
  const regenCount     = useRef(0);
  const sessionStart   = useRef<number | null>(null);
  const firstKeyTime   = useRef<number | null>(null);
  const lastKeyTime    = useRef<number | null>(null);
  const longestPause   = useRef(0);
  const windowBuffer   = useRef<WritingMetrics[]>([]);
  const windowTimer    = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentPrompt  = useRef("");

  function countWords(text: string) {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  function countBlockedWords(text: string) {
    const lower = text.toLowerCase();
    return BLOCKED_WORDS.filter((w) => lower.includes(w)).length;
  }

  function deriveConfidence(regen: number): number {
    return Math.max(1, Math.min(10, 10 - Math.floor(regen / 2)));
  }

  function snapshotWindow() {
    const now = Date.now();
    const sessionDuration = sessionStart.current
      ? Math.round((now - sessionStart.current) / 1000)
      : 0;
    const timeToSubmit = firstKeyTime.current
      ? Math.round((now - firstKeyTime.current) / 1000)
      : 0;
    const ratio = totalKeys.current > 0
      ? Math.round((backspaceKeys.current / totalKeys.current) * 100)
      : 0;

    const snapshot: WritingMetrics = {
      prompt_length:      countWords(currentPrompt.current),
      time_to_submit:     timeToSubmit,
      regeneration_count: regenCount.current,
      session_duration:   Math.min(sessionDuration, 120),
      backspace_ratio:    ratio,
      pause_duration:     longestPause.current,
      confidence_score:   deriveConfidence(regenCount.current),
      blocked_word_count: countBlockedWords(currentPrompt.current),
    };

    windowBuffer.current.push(snapshot);
    totalKeys.current     = 0;
    backspaceKeys.current = 0;
    longestPause.current  = 0;
    lastKeyTime.current   = null;

    if (windowBuffer.current.length >= SEQ_LEN) {
      onSessionReady([...windowBuffer.current]);
      windowBuffer.current = [];
    }
  }

  const onPromptChange = useCallback((text: string) => {
    currentPrompt.current = text;
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  const now = Date.now();

  if (!firstKeyTime.current) {
    firstKeyTime.current = now;
    sessionStart.current = now;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- snapshotWindow uses refs only, stable at runtime
    windowTimer.current = setInterval(snapshotWindow, WINDOW_SECONDS * 1000);
  }
    if (lastKeyTime.current) {
      const pauseSec = (now - lastKeyTime.current) / 1000;
      if (pauseSec > longestPause.current) {
        longestPause.current = Math.round(pauseSec);
      }
    }
    lastKeyTime.current = now;
    totalKeys.current++;

    if (e.key === "Backspace" || e.key === "Delete") {
      backspaceKeys.current++;
    }
  }, []);

  const onRegenerate = useCallback(() => {
    regenCount.current++;
  }, []);

  const reset = useCallback(() => {
    if (windowTimer.current) clearInterval(windowTimer.current);
    windowTimer.current   = null;
    totalKeys.current     = 0;
    backspaceKeys.current = 0;
    regenCount.current    = 0;
    longestPause.current  = 0;
    firstKeyTime.current  = null;
    lastKeyTime.current   = null;
    sessionStart.current  = null;
    windowBuffer.current  = [];
    currentPrompt.current = "";
  }, []);

  return { onPromptChange, onKeyDown, onRegenerate, reset };
}