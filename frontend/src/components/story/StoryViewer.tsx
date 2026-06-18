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
      className="flex-1 overflow-y-auto px-8 py-10 bg-zinc-950"
    >
      <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-md rounded-lg p-4 mb-8">
        <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="flex justify-between items-center mt-2">
  <span className="text-sm text-zinc-400">
    Reading Progress
  </span>

  <span className="text-sm font-medium text-indigo-400">
    {progress}%
  </span>
</div>
      </div>
      <div className="max-w-4xl mx-auto">
      {chapters.map((chapter) => (
        <div key={chapter.id} className="mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6">
            {chapter.title}
          </h1>

          <p className="text-lg text-zinc-300 whitespace-pre-line leading-9">
            {chapter.content}
          </p>
          <hr className="border-zinc-800 mt-10" />
        </div>
      ))}
      </div>
    </div>
  );
};

export default StoryViewer;