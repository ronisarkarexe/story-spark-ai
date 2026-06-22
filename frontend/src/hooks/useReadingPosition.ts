import { RefObject, useEffect } from "react";

const STORAGE_PREFIX = "story_spark_reading_position_";

export const useReadingPosition = (
  storyId: string,
  containerRef: RefObject<HTMLElement | null>,
  isReadingMode: boolean
) => {
  useEffect(() => {
    if (!isReadingMode) return;

    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const savedPosition = localStorage.getItem(`${STORAGE_PREFIX}${storyId}`);
      if (savedPosition) {
        const parsedPosition = parseFloat(savedPosition);
        if (!isNaN(parsedPosition)) {
          container.scrollTop = parsedPosition;
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [storyId, containerRef, isReadingMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isReadingMode) return;

    let timeoutId: number;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        if (container) {
          localStorage.setItem(`${STORAGE_PREFIX}${storyId}`, container.scrollTop.toString());
        }
      }, 200);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [storyId, containerRef, isReadingMode]);
};
