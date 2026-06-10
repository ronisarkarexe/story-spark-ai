import React, { useEffect, useRef, useState } from "react";
import { Chapter } from "../../types/story.types";

interface Props {
  chapters: Chapter[];
  storyId: string;
}

const StoryViewer: React.FC<Props> = ({
  chapters,
  storyId,
}) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const storageKey = `story-progress-${storyId}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const savedProgress = localStorage.getItem(storageKey);

    if (savedProgress) {
      const progressValue = Number(savedProgress);

      setProgress(progressValue);

      setTimeout(() => {
        const maxScroll =
          container.scrollHeight - container.clientHeight;

        container.scrollTop =
          (progressValue / 100) * maxScroll;
      }, 100);
    }
  }, [storageKey]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const maxScroll =
        container.scrollHeight - container.clientHeight;

      if (maxScroll <= 0) return;

      const currentProgress =
        (container.scrollTop / maxScroll) * 100;

      const rounded = Math.min(
        100,
        Math.max(0, Math.round(currentProgress))
      );

      setProgress(rounded);

      localStorage.setItem(
        storageKey,
        rounded.toString()
      );
    };

    container.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      container.removeEventListener(
        "scroll",
        handleScroll
      );
  }, [storageKey]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-8"
    >
      <div className="sticky top-0 z-10 bg-black pb-4">
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <p className="text-xs text-zinc-400 mt-2">
          Reading Progress: {progress}%
        </p>
      </div>

      {chapters.map((chapter) => (
        <div key={chapter.id} className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">
            {chapter.title}
          </h1>

          <p className="text-zinc-300 whitespace-pre-line leading-8">
            {chapter.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StoryViewer;