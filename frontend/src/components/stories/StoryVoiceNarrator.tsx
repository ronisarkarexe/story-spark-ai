import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

interface StoryVoiceNarratorProps {
  text: string;
  title: string;
}

const StoryVoiceNarrator: React.FC<StoryVoiceNarratorProps> = ({
  text,
  title,
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePlay = () => {
    if (!text) {
      toast.error("No story available for narration");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      `${title}. ${text}`
    );

    const voice = voices.find(
      (v) => v.name === selectedVoice
    );

    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = rate;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      toast.success("Narration started");
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      toast.success("Narration completed");
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      toast.error("Narration failed");
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
    toast("Narration paused");
  };

  const handleResume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
    setIsPlaying(true);
    toast.success("Narration resumed");
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    toast.error("Narration stopped");
  };

  return (
    <div className="mt-6 bg-slate-800/70 border border-slate-700 rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-4">
        🎧 AI Story Narrator
      </h2>

      {/* Voice Selection */}
      <div className="mb-4">
        <label className="text-slate-300 text-sm">
          Select Voice
        </label>

        <select
          className="w-full mt-2 bg-slate-700 text-white rounded-lg p-2"
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      {/* Speed Control */}
      <div className="mb-5">
        <label className="text-slate-300 text-sm">
          Narration Speed: {rate.toFixed(1)}x
        </label>

        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Audio Controls */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handlePlay}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold"
        >
          ▶ Play
        </button>

        <button
          onClick={handlePause}
          disabled={!isPlaying}
          className="bg-yellow-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold"
        >
          ⏸ Pause
        </button>

        <button
          onClick={handleResume}
          disabled={!isPaused}
          className="bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold"
        >
          ⏯ Resume
        </button>

        <button
          onClick={handleStop}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold"
        >
          ⏹ Stop
        </button>
      </div>

      <p className="text-slate-400 text-sm mt-4">
        Listen to your generated story with customizable voices and playback controls.
      </p>
    </div>
  );
};

export default StoryVoiceNarrator;