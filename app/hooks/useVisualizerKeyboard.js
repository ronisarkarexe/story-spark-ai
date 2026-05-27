"use client";
import { useEffect } from "react";

/**
 * useVisualizerKeyboard
 *
 * Attaches keyboard shortcuts for the AlgoBuddy visualizer.
 * Guards against firing when the user is typing in an input/textarea/select.
 * Cleans up the listener automatically on unmount.
 *
 * Shortcut map (matches the controls in BubbleSortVisualizer and siblings):
 *   Space   → Play / Pause  (calls onStart or onReset depending on state)
 *   R / r   → Reset All
 *   +  / =  → Speed up   (increase speed by 0.5, max 5)
 *   -       → Slow down  (decrease speed by 0.5, min 0.5)
 *
 * @param {object}   opts
 * @param {Function} opts.onStart        — the "Start Sort / Play" handler
 * @param {Function} opts.onReset        — the "Reset All" handler
 * @param {Function} opts.onSpeedChange  — called with the next speed value (number)
 * @param {number}   opts.speed          — current speed value (0.5 – 5, step 0.5)
 * @param {boolean}  opts.sorting        — true while animation is running
 * @param {boolean}  opts.sorted         — true when sort is complete
 * @param {boolean}  [opts.enabled=true] — set false to disable (e.g. modal open)
 */
export default function useVisualizerKeyboard({
  onStart,
  onReset,
  onSpeedChange,
  onTogglePlayPause,
  speed,
  sorting,
  sorted,
  enabled = true,
}) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e) {
      // Never fire while the user is typing in a form field
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      switch (e.key) {
        case " ":
          e.preventDefault(); // prevent page scroll
          if (onTogglePlayPause && sorting) {
            onTogglePlayPause();
          } else if (sorting) {
            onReset?.();
          } else if (!sorted) {
            // Space while idle → Start
            onStart?.();
          }
          break;

        case "r":
        case "R":
          onReset?.();
          break;

        case "+":
        case "=":
          onSpeedChange?.(Math.min(parseFloat((speed + 0.5).toFixed(1)), 5));
          break;

        case "-":
          onSpeedChange?.(Math.max(parseFloat((speed - 0.5).toFixed(1)), 0.5));
          break;

        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onStart, onReset, onSpeedChange, onTogglePlayPause, speed, sorting, sorted]);
}