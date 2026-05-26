import React from "react";
import { Play, Pause } from "lucide-react";
import KeyboardShortcutsLegend from "@/app/components/ui/KeyboardShortcutsLegend";

export default function PlaybackControls({
  isPaused,
  onTogglePlayPause,
  speed,
  onIncreaseSpeed,
  onDecreaseSpeed,
  onSpeedChange,
  disabled = false,
  showShortcuts = true,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={onTogglePlayPause}
        disabled={disabled}
        className="flex items-center gap-2 bg-[#a435f0] text-white px-6 py-2 rounded-lg hover:bg-[#8f2cd6] transition-colors font-medium shadow-sm w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPaused ? <Play size={20} /> : <Pause size={20} />}
        {isPaused ? "Play" : "Pause"}
      </button>

      {/* Speed Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecreaseSpeed}
          className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled || speed <= 0.5}
        >
          -
        </button>

        {onSpeedChange ? (
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-24 sm:w-32"
            disabled={disabled}
          />
        ) : null}

        <span className="text-gray-700 dark:text-gray-300 font-medium min-w-[80px] text-center">
          Speed: {speed}x
        </span>

        <button
          type="button"
          onClick={onIncreaseSpeed}
          className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled || speed >= 5}
        >
          +
        </button>
      </div>

      {showShortcuts && (
        <div className="hidden md:block ml-auto">
          <KeyboardShortcutsLegend />
        </div>
      )}
    </div>
  );
}
