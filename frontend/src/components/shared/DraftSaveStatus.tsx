import React, { useEffect, useReducer } from "react";
import { SaveStatus } from "../../hooks/useAutoSave";

interface Props {
  status: SaveStatus;
  lastSaved: Date | null;
  isOnline?: boolean;
  pendingCount?: number;
}

function formatRelative(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  const mins = Math.floor(diff / 60);
  return `${mins}m ago`;
}

export const DraftSaveStatus: React.FC<Props> = ({ status, lastSaved, isOnline = true, pendingCount = 0 }) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    if (!lastSaved) return;
    const t = setInterval(forceUpdate, 30000);
    return () => clearInterval(t);
  }, [lastSaved]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground select-none">
        {status === "saving" && (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span>Saving...</span>
          </>
        )}
        {status === "saved" && lastSaved && (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span>Draft saved {formatRelative(lastSaved)}</span>
          </>
        )}
        {status === "error" && (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span>Save failed</span>
          </>
        )}
      </div>
      {!isOnline && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-xs font-medium animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <span>Offline — {pendingCount} pending save{pendingCount !== 1 ? "s" : ""}</span>
        </div>
      )}
    </div>
  );
};
