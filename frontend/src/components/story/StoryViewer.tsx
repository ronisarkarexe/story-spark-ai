import React, { useEffect, useRef, useState } from "react";
import { Chapter } from "../../types/story.types";
import ReadingTimeBadge from "../ReadingTimeBadge";
import toast from "react-hot-toast";
import AudioPlayer from "../AudioPlayer"; // Sahi import path
import { saveRecentStory } from "../../utils/recent-stories";

interface Props {
  chapters: Chapter[];
  storyId: string;
  title?: string;
  tag?: string;
  imageURL?: string;
}

const StoryViewer: React.FC<Props> = ({
  chapters,
  storyId,
  title,
  tag,
  imageURL,
}) => {
  const [progress, setProgress] = useState(0);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const storageKey = `story-progress-${storyId}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const savedProgress = localStorage.getItem(storageKey);
    if (savedProgress) {
      const progressValue = Number(savedProgress);
      setProgress(progressValue);
      if (progressValue > 0 && progressValue < 100) {
        setShowResumeBanner(true);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    // Add to recently viewed on initial mount/load
    saveRecentStory({
      id: storyId,
      title: title || "Untitled AI Story",
      imageURL: imageURL || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60",
      tag: tag || "AI Draft",
      progress: progress,
      lastScrollPosition: 0,
      isDraft: true,
    });
  }, [storyId, title, tag, imageURL]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll <= 0) return;
      const currentProgress = (container.scrollTop / maxScroll) * 100;
      const rounded = Math.min(100, Math.max(0, Math.round(currentProgress)));
      setProgress(rounded);
      localStorage.setItem(storageKey, rounded.toString());

      saveRecentStory({
        id: storyId,
        title: title || "Untitled AI Story",
        imageURL: imageURL || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60",
        tag: tag || "AI Draft",
        progress: rounded,
        lastScrollPosition: container.scrollTop,
        isDraft: true,
      });

      if (rounded === 100) {
        localStorage.removeItem(storageKey);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [storageKey, storyId, title, tag, imageURL, progress]);

  const handleResume = () => {
    const container = containerRef.current;
    if (!container) return;
    const savedProgress = localStorage.getItem(storageKey);
    if (savedProgress) {
      const progressValue = Number(savedProgress);
      const maxScroll = container.scrollHeight - container.clientHeight;
      container.scrollTo({
        top: (progressValue / 100) * maxScroll,
        behavior: "smooth",
      });
    }
    setShowResumeBanner(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title || "StorySparkAI Story";

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled share dialog
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-8 py-10 bg-zinc-950"
    >
      {showResumeBanner && (
        <div className="sticky top-0 z-20 bg-indigo-900/90 backdrop-blur-md rounded-lg p-3 mb-4 flex justify-between items-center">
          <span className="text-sm text-indigo-200">
            You left off at {progress}% � continue where you stopped?
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleResume}
              className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-md transition-colors"
            >
              Continue Reading
            </button>
            <button
              onClick={() => setShowResumeBanner(false)}
              className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-md transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-md rounded-lg p-4 mb-8">
        <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
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
            <ReadingTimeBadge text={chapter.content} />
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
