import React, { useEffect, useMemo } from "react";
import  { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";

interface AudioNarrationProps {
  text: string;
  title?: string;
  enabled?: boolean;
}

const AudioNarration: React.FC<AudioNarrationProps> = ({
  text,
  title = "Story Narration",
  enabled = true,
}) => {
  const {
    isSupported,
    isSpeaking,
    isPaused,
    isLoading,
    error,
    playbackRate,
    availableVoices,
    selectedVoiceIndex,
    play,
    pause,
    resume,
    stop,
    setPlaybackRate,
    setSelectedVoice,
    // detectedLanguage,
  } = useSpeechSynthesis(text);

  // Stop speech when component unmounts or text changes
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Stop speech when text changes
  useEffect(() => {
    stop();
  }, [text, stop]);

  const playbackRateOptions = useMemo(
    () => [
      { value: 0.5, label: "0.5x" },
      { value: 0.75, label: "0.75x" },
      { value: 1, label: "1x (Normal)" },
      { value: 1.25, label: "1.25x" },
      { value: 1.5, label: "1.5x" },
      { value: 2, label: "2x" },
    ],
    [],
  );

  const hasText = text && text.trim().length > 0;
  const canPlay = hasText && !isSpeaking && !isLoading && isSupported && enabled;
  const canPause = isSpeaking && !isPaused;
  const canResume = isSpeaking && isPaused;

  if (!isSupported) {
    return (
      <div className="mt-6 p-4 bg-amber-950/50 border border-amber-700/50 rounded-lg text-amber-200 text-sm">
        <p>Text-to-speech is not supported in this browser.</p>
      </div>
    );
  }

  if (!enabled || !hasText) {
    return null;
  }

  return (
    <div className="mt-6 bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4 shadow-lg">
      {/* Header */}
      <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 3v9.28c-. 2 0 0-1 1.97 2 2 0 0-1-1.97-2V5c0-1.1.9-2 2-2zm0-1C5.93 2 1 5.93 1 12s3.93 10 11 10 11-3.93 11-11S18.07 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
        </svg>
        {title}
      </h3>

      {/* Language Detection Info */}
      {/* {detectedLanguage && (
        <div className="mb-3 p-2 bg-blue-950/30 border border-blue-700/30 rounded text-blue-200 text-xs">
          <span className="font-medium">Detected Language:</span> {detectedLanguage.toUpperCase()}
        </div>
      )} */}

      {/* Error Message */}
      {error && (
        <div
          className="mb-4 p-3 bg-red-950/50 border border-red-700/50 rounded text-red-200 text-sm"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Play/Pause/Resume/Stop Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => play(text)}
            disabled={!canPlay}
            title="Play narration (Alt+P)"
            aria-label="Play story narration"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {isLoading ? "Loading..." : isSpeaking && !isPaused ? "Playing..." : "▶ Play"}
          </button>

          {canPause && (
            <button
              onClick={pause}
              title="Pause narration (Alt+M)"
              aria-label="Pause story narration"
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold text-sm hover:bg-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              ⏸ Pause
            </button>
          )}

          {canResume && (
            <button
              onClick={resume}
              title="Resume narration (Alt+R)"
              aria-label="Resume story narration"
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              ▶ Resume
            </button>
          )}

          {isSpeaking && (
            <button
              onClick={stop}
              title="Stop narration (Alt+S)"
              aria-label="Stop story narration"
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              ⏹ Stop
            </button>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1 min-w-0" />

        {/* Playback Speed & Voice Selectors */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          {/* Playback Speed */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="playback-speed-select"
              className="text-xs font-medium text-slate-400"
            >
              Speed:
            </label>
            <select
              id="playback-speed-select"
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              aria-label="Playback speed"
              className="px-2 py-1 bg-slate-700 text-slate-200 border border-slate-600 rounded text-xs hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
            >
              {playbackRateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Selector */}
          {availableVoices.length > 0 && (
            <div className="flex items-center gap-2">
              <label
                htmlFor="voice-select"
                className="text-xs font-medium text-slate-400"
              >
                Voice:
              </label>
              <select
                id="voice-select"
                value={selectedVoiceIndex}
                onChange={(e) => setSelectedVoice(parseInt(e.target.value, 10))}
                aria-label="Voice selection"
                className="px-2 py-1 bg-slate-700 text-slate-200 border border-slate-600 rounded text-xs hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
              >
                {availableVoices.map((voice, index) => (
                  <option key={index} value={index}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Status Indicator */}
      {(isSpeaking || isLoading) && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          {isLoading && "Loading audio..."}
          {isSpeaking && !isLoading && isPaused && "Paused"}
          {isSpeaking && !isLoading && !isPaused && "Playing narration..."}
        </div>
      )}
    </div>
  );
};

export default AudioNarration;
