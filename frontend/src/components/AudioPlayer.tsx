import React, {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  LoaderCircle,
  Pause,
  Play,
  RotateCcw,
  Square,
  Star,
  Volume2,
  Volume,
} from "lucide-react";

import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import { useVoicePreview } from "../hooks/useVoicePreview";
import { useVoiceFavorites } from "../hooks/useVoiceFavorites";

export type NarrationPlaybackState = "idle" | "playing" | "paused";

export interface AudioPlayerHandle {
  stop: () => void;
  currentWordIndex: number;
}

interface AudioPlayerProps {
  text: string;
  title?: string;
  onWordIndexChange?: (currentWordIndex: number) => void;
  onPlaybackStateChange?: (state: NarrationPlaybackState) => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

const controlButtonBaseClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-950";

const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(
  ({ text, title = "Story narration", onWordIndexChange, onPlaybackStateChange }, ref) => {
    const [voiceGender, setVoiceGender] = useState<"female" | "male">("female");
    const speech = useSpeechSynthesis(text, voiceGender);
    const preview = useVoicePreview();
    const favorites = useVoiceFavorites();
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const speedSelectId = useId();
    const voiceGenderSelectId = useId();
    const languageSelectId = useId();
    const voiceSelectId = useId();

    const filteredVoices = speech.voices.filter((voice) => voice.lang === speech.selectedLanguage);
    const voiceOptions = filteredVoices.length > 0 ? filteredVoices : speech.voices;

    const displayedVoices = useMemo(() => {
      if (!showFavoritesOnly) {
        return voiceOptions;
      }
      return voiceOptions.filter((voice) => favorites.isFavorite(voice.id));
    }, [voiceOptions, showFavoritesOnly, favorites]);

    useImperativeHandle(
      ref,
      () => ({
        stop: speech.stop,
        currentWordIndex: speech.currentWordIndex,
      }),
      [speech.currentWordIndex, speech.stop],
    );

    useEffect(() => {
      onWordIndexChange?.(speech.currentWordIndex);
    }, [onWordIndexChange, speech.currentWordIndex]);

    useEffect(() => {
      const nextState: NarrationPlaybackState = speech.isPaused
        ? "paused"
        : speech.isPlaying
          ? "playing"
          : "idle";

      onPlaybackStateChange?.(nextState);
    }, [onPlaybackStateChange, speech.isPaused, speech.isPlaying]);

    // Auto-select first voice when currently selected is filtered out
    useEffect(() => {
      if (showFavoritesOnly && displayedVoices.length > 0) {
        const isCurrentVoiceStillAvailable = displayedVoices.some(
          (v) => v.id === speech.selectedVoiceId
        );
        if (!isCurrentVoiceStillAvailable) {
          speech.setSelectedVoiceId(displayedVoices[0].id);
        }
      }
    }, [showFavoritesOnly, displayedVoices, speech]);

    const isLoading = speech.isSupported && !speech.isReady;
    const canNarrate = speech.isSupported && speech.isReady && text.trim().length > 0;
    const spokenWordCount =
      speech.progress.totalWords === 0
        ? 0
        : speech.isPlaying || speech.isPaused || speech.currentWordIndex > 0
          ? Math.min(speech.currentWordIndex + 1, speech.progress.totalWords)
          : 0;

    if (!speech.isSupported) {
      return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
            <div>
              <p className="font-semibold">Audio narration is unavailable</p>
              <p className="mt-1 text-amber-800 dark:text-amber-100/80">
                Your browser does not support the Web Speech API, so this story can’t be narrated here.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Volume2 className="h-5 w-5 text-indigo-500" aria-hidden="true" />
              <h3 className="text-base font-semibold">Listen to this story</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            {isLoading ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                Loading voices
              </span>
            ) : (
              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                Ready to narrate
              </span>
            )}
          </div>
        </div>

        {speech.error ? (
          <div
            role="alert"
            aria-live="polite"
            className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100"
          >
            {speech.error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/30 dark:text-slate-400">
            Initialising browser speech voices. Controls will appear once the engine is ready.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
              <button
                type="button"
                role="button"
                aria-label="Play narration from the beginning"
                title="Play from the beginning"
                onClick={speech.play}
                disabled={!canNarrate}
                className={`${controlButtonBaseClass} border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-200 dark:hover:bg-indigo-500/20`}
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Play
              </button>

              <button
                type="button"
                role="button"
                aria-label="Pause narration"
                title="Pause"
                onClick={speech.pause}
                disabled={!speech.isPlaying}
                className={`${controlButtonBaseClass} border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700`}
              >
                <Pause className="h-4 w-4" aria-hidden="true" />
                Pause
              </button>

              <button
                type="button"
                role="button"
                aria-label="Resume narration"
                title="Resume"
                onClick={speech.resume}
                disabled={!speech.isPaused}
                className={`${controlButtonBaseClass} border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20`}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Resume
              </button>

              <button
                type="button"
                role="button"
                aria-label="Stop narration and reset to the beginning"
                title="Stop"
                onClick={speech.stop}
                disabled={!speech.isPlaying && !speech.isPaused}
                className={`${controlButtonBaseClass} border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20`}
              >
                <Square className="h-4 w-4" aria-hidden="true" />
                Stop
              </button>
            </div>

<<<<<<< HEAD
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(140px,180px)_minmax(180px,1fr)_minmax(180px,1fr)] lg:items-end">
=======
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(140px,160px)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(200px,1fr)] lg:items-end">
>>>>>>> upstream/main
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Progress</span>
                  <span aria-live="polite">
                    {speech.isPlaying || speech.isPaused ? spokenWordCount : 0} / {speech.progress.totalWords} words
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label="Narration progress"
                  aria-valuemin={0}
                  aria-valuemax={speech.progress.totalWords}
                  aria-valuenow={spokenWordCount}
                  className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-300"
                    style={{ width: `${Math.round(speech.progress.percentage * 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor={speedSelectId}
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Playback speed
                  </label>
                  <div className="relative">
                    <select
                      id={speedSelectId}
                      aria-label="Playback speed"
                      role="combobox"
                      value={speech.rate}
                      onChange={(event) => speech.setRate(Number(event.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                    >
                      {SPEED_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option.toFixed(2).replace(/\.00$/, "")}&times;
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={voiceGenderSelectId}
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Voice
                  </label>
                  <div className="relative">
                    <select
                      id={voiceGenderSelectId}
                      aria-label="Voice gender"
                      role="combobox"
                      value={voiceGender}
                      onChange={(event) => setVoiceGender(event.target.value as "female" | "male")}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                    >
                      <option value="female">Female voice</option>
                      <option value="male">Male voice</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Pitch
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={0.5}
                        max={2}
                        step={0.1}
                        value={speech.pitch}
                        onChange={(event) => speech.setPitch(Number(event.target.value))}
                        className="w-full accent-indigo-500"
                      />
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {speech.pitch.toFixed(1)}x
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Volume
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={speech.volume}
                        onChange={(event) => speech.setVolume(Number(event.target.value))}
                        className="w-full accent-indigo-500"
                      />
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {Math.round(speech.volume * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor={languageSelectId}
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Narration language
                </label>
                <div className="relative">
                  <select
                    id={languageSelectId}
                    aria-label="Narration language"
                    role="combobox"
                    value={speech.selectedLanguage}
                    onChange={(event) => speech.setSelectedLanguage(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                  >
                    {speech.languageOptions.map((option) => (
                      <option key={option.lang} value={option.lang}>
                        {option.label} ({option.voiceCount})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor={voiceSelectId}
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Voice
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    title={showFavoritesOnly ? "Show all voices" : "Show favorites only"}
                    className={`rounded-xl border px-2.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      showFavoritesOnly
                        ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                    }`}
                    aria-label={showFavoritesOnly ? "Show all voices" : "Show favorites only"}
                  >
                    <Star className="h-4 w-4" fill={showFavoritesOnly ? "currentColor" : "none"} />
                  </button>
                  <div className="relative flex-1">
                    <select
                      id={voiceSelectId}
                      aria-label="Narration voice"
                      role="combobox"
                      value={speech.selectedVoiceId}
                      onChange={(event) => speech.setSelectedVoiceId(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                    >
                      {displayedVoices.length === 0 ? (
                        <option disabled>No favorites available</option>
                      ) : (
                        displayedVoices.map((voice) => (
                          <option key={voice.id} value={voice.id}>
                            {voice.label}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Voice controls
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const currentVoice = speech.voices.find(
                        (v) => v.id === speech.selectedVoiceId,
                      );
                      if (currentVoice) {
                        preview.playPreview(currentVoice);
                      }
                    }}
                    disabled={
                      !speech.isReady || speech.voices.length === 0 || preview.isPreviewPlaying
                    }
                    title="Listen to current voice preview"
                    aria-label="Play voice preview"
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-950 ${
                      preview.isPreviewPlaying
                        ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Volume className="h-4 w-4" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => favorites.toggleFavorite(speech.selectedVoiceId)}
                    disabled={!speech.isReady || speech.voices.length === 0}
                    title={
                      favorites.isFavorite(speech.selectedVoiceId)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                    aria-label={
                      favorites.isFavorite(speech.selectedVoiceId)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-950 ${
                      favorites.isFavorite(speech.selectedVoiceId)
                        ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Star
                      className="h-4 w-4"
                      fill={favorites.isFavorite(speech.selectedVoiceId) ? "currentColor" : "none"}
                    />
                    Favorite
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>
                {speech.isPlaying
                  ? "Narration in progress"
                  : speech.isPaused
                    ? "Narration paused"
                    : speech.currentWordIndex > 0
                      ? "Narration completed"
                      : "Ready to start"}
              </span>
              <span>{Math.round(speech.progress.percentage * 100)}%</span>
            </div>
          </div>
        )}
      </section>
    );
  },
);

AudioPlayer.displayName = "AudioPlayer";

export default AudioPlayer;
