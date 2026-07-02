import { useReadingProgress } from "../../hooks/useReadingProgress";

interface ReadingProgressBarProps {
  containerRef: React.RefObject<HTMLElement>;
}

/**
 * Thin, fixed-to-viewport progress bar shown at the top of story
 * detail pages. Distinct from StoryViewer's in-content "Reading
 * Progress" panel (which tracks resume position); this bar is the
 * always-visible top-of-page indicator requested in #4144.
 */
const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ containerRef }) => {
  const progress = useReadingProgress(containerRef);

  return (
    <div
      className="fixed top-0 left-0 w-full h-1 z-50 bg-zinc-800"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-indigo-500 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgressBar;