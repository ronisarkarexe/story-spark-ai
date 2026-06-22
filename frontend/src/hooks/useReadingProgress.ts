import { RefObject, useEffect, useState } from "react";

export const useReadingProgress = (containerRef: RefObject<HTMLElement | null>) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const totalScroll = scrollHeight - clientHeight;
      if (totalScroll <= 0) {
        setProgress(0);
        return;
      }
      const currentProgress = (scrollTop / totalScroll) * 100;
      setProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [containerRef]);

  return progress;
};
