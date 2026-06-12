import React, { useEffect, useRef, useState } from "react";
import { Story } from "../../types/story.types";
import { synthesizeTTS } from "../../services/narration.service";

interface Props {
  story: Story;
  chapterIndex: number;
  onHighlightSegment: (segmentIndex: number, segments: string[]) => void;
  onClose?: () => void;
}

interface NarrationSegment {
  text: string;
  character: string;
  voiceId: string;
  audioUrl?: string;
}

export const AudioPlayer: React.FC<Props> = ({
  story,
  chapterIndex,
  onHighlightSegment,
  onClose,
}) => {
  const chapter = story.chapters[chapterIndex];
  const [segments, setSegments] = useState<NarrationSegment[]>([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1);
  const [playbackState, setPlaybackState] = useState<"idle" | "loading" | "playing" | "paused">("idle");
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Parse chapter content into multi-voice segments
  useEffect(() => {
    if (!chapter) return;

    const lines = chapter.content
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

    const parsedSegments: NarrationSegment[] = lines.map((line) => {
      // Check for dialogue format: "CharacterName: Dialogue text..."
      const match = /^([A-Z][a-zA-Z]{1,15}):\s*(.*)/.exec(line);
      let character = "Narrator";
      let text = line;

      if (match) {
        character = match[1];
        text = match[2];
      }

      // Map to voice configuration
      const voiceMap = story.characterVoiceMap || {};
      const voiceId = voiceMap[character] || voiceMap["Narrator"] || "pNInz6obpgDQ51uUP53s";

      return {
        text,
        character,
        voiceId,
      };
    });

    setSegments(parsedSegments);
    setCurrentSegmentIndex(-1);
    setPlaybackState("idle");
    setProgress(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [chapter, story.characterVoiceMap]);

  // Notify parent component about currently active segment text to highlight it
  useEffect(() => {
    if (currentSegmentIndex >= 0 && currentSegmentIndex < segments.length) {
      onHighlightSegment(
        currentSegmentIndex,
        segments.map((s) =>
          s.character !== "Narrator" ? `${s.character}: ${s.text}` : s.text
        )
      );
    } else {
      onHighlightSegment(-1, []);
    }
  }, [currentSegmentIndex, segments, onHighlightSegment]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playSegment = async (index: number) => {
    if (index < 0 || index >= segments.length) {
      setPlaybackState("idle");
      setCurrentSegmentIndex(-1);
      setProgress(100);
      return;
    }

    setPlaybackState("loading");
    setCurrentSegmentIndex(index);
    setProgress(Math.round((index / segments.length) * 100));

    try {
      const segment = segments[index];

      // Request synthesis from backend cache/ElevenLabs API
      if (!segment.audioUrl) {
        const result = await synthesizeTTS(
          segment.text,
          segment.voiceId,
          story.id,
          `${chapterIndex}-${index}`
        );
        segment.audioUrl = result.audioUrl;
      }

      // Initialize HTML Audio Object
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(segment.audioUrl);
      audio.playbackRate = playbackSpeed;
      audioRef.current = audio;

      audio.onended = () => {
        // Automatically chain to next segment
        playSegment(index + 1);
      };

      audio.onerror = () => {
        console.error("Audio playback error");
        playSegment(index + 1); // Skip on error
      };

      audio.oncanplay = () => {
        audio.play().then(() => {
          setPlaybackState("playing");
        });
      };
    } catch (error) {
      console.error("Failed to play segment:", error);
      playSegment(index + 1); // Skip on error
    }
  };

  const handlePlayPause = () => {
    if (playbackState === "playing") {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlaybackState("paused");
      }
    } else if (playbackState === "paused") {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setPlaybackState("playing");
        });
      }
    } else {
      // Start from beginning or current segment
      const startIndex = currentSegmentIndex >= 0 ? currentSegmentIndex : 0;
      playSegment(startIndex);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlaybackState("idle");
    setCurrentSegmentIndex(-1);
    setProgress(0);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in duration-300">
      {/* Title & Stats */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            🎙️ Multi-Voice Narration
          </h3>
          <p className="text-xxs text-zinc-400 mt-0.5">
            Narrating: {chapter.title} (ElevenLabs cached cast)
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xs cursor-pointer"
          >
            ✕ Close
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full space-y-1">
        <div className="flex justify-between items-center text-xxs text-zinc-500">
          <span>
            {playbackState === "idle"
              ? "Not started"
              : playbackState === "loading"
              ? "Synthesizing voice..."
              : `Playing section ${currentSegmentIndex + 1} of ${segments.length}`}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Controller Buttons */}
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer ${
              playbackState === "playing"
                ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                : "bg-white hover:bg-zinc-200 text-black font-semibold"
            }`}
          >
            {playbackState === "playing" ? "⏸" : "▶"}
          </button>

          {/* Stop Button */}
          <button
            onClick={handleStop}
            disabled={playbackState === "idle"}
            className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            ■
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1.5 bg-zinc-900/60 p-1 border border-zinc-800/80 rounded-xl">
          {[0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedChange(speed)}
              className={`px-2 py-1 rounded-lg text-xxs font-bold transition cursor-pointer ${
                playbackSpeed === speed
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
