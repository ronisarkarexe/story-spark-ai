import { useEffect, useRef, useState } from "react";

/**
 * Tracks scroll progress (0–100) of a scrollable container element.
 * Mirrors the scroll math used in StoryViewer, exposed as a reusable
 * hook so other components (e.g. a page-level progress bar) can read
 * the same progress value.
 */
export function useReadingProgress(containerRef: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculateProgress = () => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll <= 0) {
        setProgress(0);
        return;
      }
      const current = (container.scrollTop / maxScroll) * 100;
      setProgress(Math.min(100, Math.max(0, current)));
    };

    const handleScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        calculateProgress();
        rafId.current = null;
      });
    };

    calculateProgress();
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [containerRef]);

  return progress;
}