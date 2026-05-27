import React from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
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
  showPlayPause = true,
  onStepForward,
  onStepBackward,
  onReset,
  progressText,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700 gap-4">
      {/* Play/Pause Button & Frame Stepping */}
      {showPlayPause && (
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          {onReset && (
          <button
            type="button"
            onClick={onReset}
            disabled={disabled}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Reset"
          >
            <RotateCcw size={20} />
          </button>
        )}
        
        {onStepBackward && (
          <button
            type="button"
            onClick={onStepBackward}
            disabled={disabled}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous Step"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <button
          type="button"
          onClick={onTogglePlayPause}
          disabled={disabled}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-sm justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPaused ? <Play size={20} className="fill-current ml-1" /> : <Pause size={20} />}
          {isPaused ? "Play" : "Pause"}
        </button>

        {onStepForward && (
          <button
            type="button"
            onClick={onStepForward}
            disabled={disabled}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next Step"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
      )}

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

      {progressText && (
        <div className="hidden lg:block text-right">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">PROGRESS</div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            {progressText}
          </div>
        </div>
      )}

      {showShortcuts && (
        <div className="hidden md:block ml-auto">
          <KeyboardShortcutsLegend />
        </div>
      )}
    </div>
  );
}
