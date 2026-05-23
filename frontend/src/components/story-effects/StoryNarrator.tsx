import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { extractDialogues, MoodProfile } from "./StoryMoodDetector";

interface StoryNarratorProps {
  title: string;
  content: string;
  mood: MoodProfile;
  autoPlay?: boolean;
}

const StoryNarrator = ({
  title,
  content,
  mood,
  autoPlay = false,
}: StoryNarratorProps) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const currentTextRef = useRef("");

  const dialogueSegments = useMemo(() => extractDialogues(content), [content]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const buildVoiceSequence = useCallback(() => {
    return content
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .map((segment, index) => ({
        id: `${index}-${segment.slice(0, 10)}`,
        text: segment.trim(),
        isDialogue: dialogueSegments.some((item) => segment.includes(item.text)),
      }));
  }, [content, dialogueSegments]);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !content.trim()) {
      return;
    }

    window.speechSynthesis.cancel();
    const voiceSequence = buildVoiceSequence();
    const baseVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("en"));
    const alternateVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
    currentTextRef.current = content;

    voiceSequence.forEach((part, index) => {
      const utterance = new SpeechSynthesisUtterance(part.text);
      utterance.pitch =
        mood.narrationTone === "playful" ? 1.25
        : mood.narrationTone === "dramatic" ? 0.85
        : mood.narrationTone === "mystical" ? 1.12
        : 1;
      utterance.rate =
        mood.narrationTone === "precise" ? 1.02
        : mood.narrationTone === "bold" ? 0.96
        : 0.92;
      utterance.volume = isMuted ? 0 : volume;
      utterance.voice =
        part.isDialogue && alternateVoices.length > 1
          ? alternateVoices[index % alternateVoices.length]
          : baseVoice ?? alternateVoices[0] ?? null;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      utterance.onend = () => {
        if (index === voiceSequence.length - 1) {
          setIsSpeaking(false);
          setIsPaused(false);
        }
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [buildVoiceSequence, content, isMuted, mood.narrationTone, volume, voices]);

  useEffect(() => {
    if (autoPlay && content.trim()) {
      const timer = window.setTimeout(() => {
        speak();
      }, 500);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [autoPlay, content, speak, title]);

  useEffect(() => {
    if (isSpeaking && currentTextRef.current === content) {
      window.speechSynthesis.cancel();
      speak();
    }
  }, [content, isMuted, isSpeaking, speak, volume]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200 backdrop-blur-md">
      <button
        type="button"
        onClick={speak}
        className="rounded-full border border-white/15 px-3 py-1.5 transition hover:bg-white/10"
      >
        {isSpeaking ? "Restart Narration" : "Play Narration"}
      </button>
      <button
        type="button"
        onClick={() => {
          if (!("speechSynthesis" in window)) {
            return;
          }

          if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
          } else {
            window.speechSynthesis.pause();
            setIsPaused(true);
          }
        }}
        className="rounded-full border border-white/15 px-3 py-1.5 transition hover:bg-white/10"
      >
        {isPaused ? "Resume" : "Pause"}
      </button>
      <button
        type="button"
        onClick={() => {
          if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
          }
          setIsSpeaking(false);
          setIsPaused(false);
        }}
        className="rounded-full border border-white/15 px-3 py-1.5 transition hover:bg-white/10"
      >
        Stop
      </button>
      <button
        type="button"
        onClick={() => setIsMuted((prev) => !prev)}
        className="rounded-full border border-white/15 px-3 py-1.5 transition hover:bg-white/10"
      >
        {isMuted ? "Voice On" : "Voice Off"}
      </button>
      <label className="flex items-center gap-2 text-xs text-slate-300">
        Voice
        <input
          aria-label="Narration volume"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          className="accent-white"
        />
      </label>
      <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-300">
        {mood.narrationTone} tone
      </span>
    </div>
  );
};

export default StoryNarrator;
