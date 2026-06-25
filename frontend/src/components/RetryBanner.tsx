// frontend/src/components/stories/RetryBanner.tsx
interface RetryBannerProps {
  retryCount: number;
  maxRetries: number;
  isRetrying: boolean;
  countdown: number;        // seconds remaining in backoff
  onRetry: () => void;
}

const RetryBanner = ({
  retryCount,
  maxRetries,
  isRetrying,
  countdown,
  onRetry,
}: RetryBannerProps) => {
  const exhausted = retryCount >= maxRetries;

  return (
    // aria-live so screen readers announce the timeout — issue requirement
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="flex items-start gap-3 mt-3 p-4 rounded-lg border border-red-500/40 bg-red-500/10 animate-fadeIn"
    >
      {/* Warning icon */}
      <svg
        className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </svg>

      {/* Message section */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-red-400">
          AI generation timed out.
        </p>
        <p className="text-xs text-red-400/70 mt-1">
          {exhausted
            ? "All retry attempts exhausted. Please wait a moment and try again manually."
            : countdown > 0
            ? `Retrying in ${countdown}s… (attempt ${retryCount} of ${maxRetries})`
            : retryCount > 0
            ? `Attempt ${retryCount} of ${maxRetries} failed. Try again?`
            : "This can happen due to high server load or network issues."}
        </p>

        {/* Attempt dots indicator */}
        {!exhausted && (
          <div className="flex gap-1.5 mt-2" aria-hidden="true">
            {Array.from({ length: maxRetries }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  i < retryCount
                    ? "bg-red-500"
                    : i === retryCount && isRetrying
                    ? "bg-yellow-400 animate-pulse"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Retry button */}
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying || exhausted || countdown > 0}
        aria-label={
          exhausted
            ? "Maximum retries reached"
            : isRetrying
            ? "Retrying generation..."
            : "Retry story generation"
        }
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
          bg-red-600 hover:bg-red-700 active:scale-95
          text-white flex-shrink-0
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-150 focus:outline-none
          focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          focus:ring-offset-transparent"
      >
        {isRetrying ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Retrying…</span>
          </>
        ) : countdown > 0 ? (
          <span>{countdown}s</span>
        ) : exhausted ? (
          <span>Exhausted</span>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Retry</span>
          </>
        )}
      </button>
    </div>
  );
};

export default RetryBanner;