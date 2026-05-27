import { useState, useRef, useEffect, useCallback } from "react";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

export default function usePlayback(initialSpeed = 1) {
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);

  const isPausedRef = useRef(false);
  const speedRef = useRef(initialSpeed);

  // Pause resolution for async/await (Sorting algorithms)
  const pausePromiseRef = useRef(null);
  const pauseResolveRef = useRef(null);

  const togglePlayPause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      isPausedRef.current = next;

      // If UNPAUSING, resolve the paused promise instantly so the sorting loop resumes
      if (!next && pauseResolveRef.current) {
        pauseResolveRef.current();
        pausePromiseRef.current = null;
        pauseResolveRef.current = null;
      }
      return next;
    });
  }, []);

  // Async function for sorting algorithms to await between steps
  const checkPause = async () => {
    if (isPausedRef.current) {
      if (!pausePromiseRef.current) {
        pausePromiseRef.current = new Promise((resolve) => {
          pauseResolveRef.current = resolve;
        });
      }
      await pausePromiseRef.current;
    }
  };

  const increaseSpeed = useCallback(() => {
    setSpeed((s) => Math.min(s + 0.5, 5));
  }, []);

  const decreaseSpeed = useCallback(() => {
    setSpeed((s) => Math.max(s - 0.5, 0.5));
  }, []);

  // Ensure speed ref is always synced for setTimeout delays
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  return {
    isPaused,
    setIsPaused,
    isPausedRef,
    speed,
    speedRef,
    setSpeed,
    togglePlayPause,
    increaseSpeed,
    decreaseSpeed,
    checkPause,
  };
}
