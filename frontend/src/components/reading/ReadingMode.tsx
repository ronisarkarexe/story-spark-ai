import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReadingPreferences } from "../../context/ReadingPreferencesContext";
import { useReadingProgress } from "../../hooks/useReadingProgress";
import { useReadingPosition } from "../../hooks/useReadingPosition";
import { useReadingTime } from "../../hooks/useReadingTime";
import ReadingToolbar from "./ReadingToolbar";
import ReadingProgressBar from "./ReadingProgressBar";

interface ReadingModeProps {
  storyId: string;
  title: string;
  content: string;
  imageURL?: string;
}

export const ReadingMode: React.FC<ReadingModeProps> = ({
  storyId,
  title,
  content,
  imageURL,
}) => {
  const { isReadingMode, setIsReadingMode, readingModeClassName } = useReadingPreferences();
  const containerRef = useRef<HTMLDivElement>(null);

  const progress = useReadingProgress(containerRef);
  useReadingPosition(storyId, containerRef, isReadingMode);
  const { minutes } = useReadingTime(content);

  useEffect(() => {
    if (!isReadingMode) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsReadingMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isReadingMode, setIsReadingMode]);

  return (
    <AnimatePresence>
      {isReadingMode && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`fixed inset-0 z-[9999] overflow-y-auto outline-none transition-colors duration-300 ${readingModeClassName}`}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={`Reading story: ${title}`}
        >
          <ReadingProgressBar progress={progress} />
          
          <ReadingToolbar
            storyTitle={title}
            readingTimeText={`${minutes} min read`}
            onExit={() => setIsReadingMode(false)}
          />

          <main className="max-w-4xl mx-auto px-6 pt-28 pb-20 flex flex-col items-center">
            {imageURL && (
              <div className="w-full mb-8 max-w-2xl overflow-hidden rounded-2xl shadow-lg border border-black/5 dark:border-white/5">
                <img
                  src={imageURL}
                  alt=""
                  className="w-full h-auto max-h-[400px] object-cover scale-100 hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            )}

            <article className="w-full max-w-2xl select-text">
              <header className="mb-8 text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
                  {title}
                </h1>
                <p className="text-sm opacity-60">
                  ⌛ {minutes} min read
                </p>
              </header>

              <div className="whitespace-pre-wrap break-words font-light">
                {content}
              </div>
            </article>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReadingMode;
