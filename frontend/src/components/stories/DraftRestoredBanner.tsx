import React from "react";

interface DraftRestoredBannerProps {
  /** Epoch ms when the draft was last saved */
  savedAt: number;
  onDismiss: () => void;
  onDiscard: () => void;
}

/**
 * A gentle banner that slides in at the top of the prompt area
 * when a previously-saved draft is detected on mount.
 */
const DraftRestoredBanner: React.FC<DraftRestoredBannerProps> = ({
  savedAt,
  onDismiss,
  onDiscard,
}) => {
  const timeAgo = getTimeAgo(savedAt);

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 mb-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2 min-w-0">
        <svg
          className="w-4 h-4 shrink-0 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span className="truncate">
          Draft restored from <strong>{timeAgo}</strong>
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onDiscard}
          className="px-2.5 py-1 text-xs font-medium text-red-300 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors duration-200"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="text-blue-400 hover:text-blue-200 transition-colors duration-200"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

/** Produces a human-readable relative time string */
function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default DraftRestoredBanner;
