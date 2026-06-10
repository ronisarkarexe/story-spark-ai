import React from "react";
import type { AutoSaveStatus } from "../../hooks/useAutoSaveDraft";

interface AutoSaveIndicatorProps {
  status: AutoSaveStatus;
}

/**
 * A subtle inline indicator that shows the current auto-save state:
 * - idle:     hidden
 * - saving:   animated spinner + "Saving…"
 * - saved:    green check + "Draft saved"
 * - restored: blue info + "Draft restored"
 */
const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ status }) => {
  if (status === "idle") return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-300 ${
        status === "saving"
          ? "text-amber-400"
          : status === "saved"
          ? "text-emerald-400"
          : "text-blue-400"
      }`}
      aria-live="polite"
    >
      {status === "saving" && (
        <>
          {/* Animated spinner */}
          <svg
            className="w-3.5 h-3.5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span>Saving…</span>
        </>
      )}

      {status === "saved" && (
        <>
          {/* Checkmark */}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Draft saved</span>
        </>
      )}

      {status === "restored" && (
        <>
          {/* Info icon */}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Draft restored</span>
        </>
      )}
    </span>
  );
};

export default AutoSaveIndicator;
