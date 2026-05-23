import { useCallback, useEffect, useRef, useState } from "react";
import { MoodProfile } from "./StoryMoodDetector";

interface StorySoundManagerProps {
  mood: MoodProfile;
  autoStart?: boolean;
  cinematicMode?: boolean;
}

const frequencyByTheme: Record<string, number> = {
  "soft-rain": 220,
  "whisper-wind": 128,
  enchanted: 294,
  "futuristic-hum": 196,
  "cinematic-wind": 174,
  "tense-echoes": 164,
  "playful-bounce": 262,
  "soft-strings": 246,
};

const StorySoundManager = ({
  mood,
  autoStart = false,
  cinematicMode = false,
}: StorySoundManagerProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const modulatorRef = useRef<OscillatorNode | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(22);

  const stopAudio = useCallback(() => {
    oscillatorRef.current?.stop();
    modulatorRef.current?.stop();
    oscillatorRef.current?.disconnect();
    modulatorRef.current?.disconnect();
    gainRef.current?.disconnect();
    audioContextRef.current?.close().catch(() => undefined);
    oscillatorRef.current = null;
    modulatorRef.current = null;
    gainRef.current = null;
    audioContextRef.current = null;
    setIsEnabled(false);
  }, []);

  const startAudio = useCallback(() => {
    if (typeof window === "undefined" || audioContextRef.current) {
      return;
    }

    const AudioCtor = window.AudioContext || (window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;

    if (!AudioCtor) {
      return;
    }

    const context = new AudioCtor();
    const gainNode = context.createGain();
    const oscillator = context.createOscillator();
    const modulator = context.createOscillator();
    const modulationGain = context.createGain();

    oscillator.type =
      mood.mood === "horror" ? "triangle"
      : mood.mood === "sci-fi" ? "sawtooth"
      : "sine";
    oscillator.frequency.value = frequencyByTheme[mood.soundTheme] ?? 220;

    modulator.type = "sine";
    modulator.frequency.value = mood.mood === "horror" ? 0.18 : 0.32;
    modulationGain.gain.value = mood.mood === "sci-fi" ? 18 : 8;
    gainNode.gain.value = isMuted ? 0 : volume / 1000;

    modulator.connect(modulationGain);
    modulationGain.connect(oscillator.frequency);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    modulator.start();

    audioContextRef.current = context;
    gainRef.current = gainNode;
    oscillatorRef.current = oscillator;
    modulatorRef.current = modulator;
    setIsEnabled(true);
  }, [isMuted, mood.mood, mood.soundTheme, volume]);

  useEffect(() => {
    if (!autoStart) {
      return;
    }

    const activate = () => {
      startAudio();
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
    };

    window.addEventListener("pointerdown", activate, { once: true });
    window.addEventListener("keydown", activate, { once: true });

    return () => {
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
    };
  }, [autoStart, mood.soundTheme, startAudio]);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = isMuted ? 0 : volume / 1000;
    }
  }, [isMuted, volume]);

  useEffect(() => stopAudio, [stopAudio]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200 backdrop-blur-md">
      <button
        type="button"
        onClick={() => {
          if (isEnabled) {
            stopAudio();
          } else {
            startAudio();
          }
        }}
        className="rounded-full border border-white/15 px-3 py-1.5 transition hover:bg-white/10"
      >
        {isEnabled ? "Stop Ambience" : "Start Ambience"}
      </button>
      <button
        type="button"
        onClick={() => setIsMuted((prev) => !prev)}
        className="rounded-full border border-white/15 px-3 py-1.5 transition hover:bg-white/10"
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>
      <label className="flex items-center gap-2 text-xs text-slate-300">
        Volume
        <input
          aria-label="Ambient volume"
          type="range"
          min={0}
          max={40}
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          className="accent-white"
        />
      </label>
      <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-300">
        {cinematicMode ? "Cinematic ambience" : mood.soundTheme}
      </span>
    </div>
  );
};

export default StorySoundManager;
