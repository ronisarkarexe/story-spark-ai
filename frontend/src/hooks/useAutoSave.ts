import { useEffect, useRef, useCallback, useState } from "react";

const DRAFT_KEY_PREFIX = "story_draft_";
const AUTOSAVE_INTERVAL_MS = 30000;
const DEBOUNCE_MS = 1500;
const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 100000;

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface DraftData {
  title: string;
  content: string;
  savedAt: string;
}

export const offlineQueue: Array<{ content: string; timestamp: number }> = [];
let globalIsOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

export async function flushOfflineQueue(queue: Array<{ content: string; timestamp: number }>) {
  for (const item of queue) {
    await fetch("/api/stories/save", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: item.content }),
    });
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("offline", () => {
    globalIsOnline = false;
  });

  window.addEventListener("online", async () => {
    globalIsOnline = true;
    if (offlineQueue.length > 0) {
      try {
        await flushOfflineQueue(offlineQueue);
        offlineQueue.length = 0;
      } catch (error) {
        console.error("Failed to flush offline queue:", error);
      }
    }
  });
}

  /**
   * Validates story data before saving.
   * Returns an error message if validation fails, or null if valid.
   */
export function validateStoryData(title: string, content: string): string | null {
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle && !trimmedContent) {
    return "Title and content are both empty — nothing to save.";
  }
  if (!trimmedTitle) {
    return "Title is required before saving.";
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return `Title exceeds maximum length of ${MAX_TITLE_LENGTH} characters (current: ${title.length}).`;
  }
  if (!trimmedContent) {
    return "Content is required before saving.";
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters (current: ${content.length}).`;
  }
  // Check for potentially dangerous content (basic XSS prevention)
  const scriptPattern = /<script[\s>]/i;
  if (scriptPattern.test(trimmedTitle) || scriptPattern.test(trimmedContent)) {
    return "Content contains disallowed HTML tags.";
  }
  return null;
}

export function useAutoSave(draftId: string, title: string, content: string) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [pendingCount, setPendingCount] = useState<number>(offlineQueue.length);
  const [validationError, setValidationError] = useState<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const save = useCallback(async () => {
    // Validate before saving
    const validationErr = validateStoryData(title, content);
    if (validationErr) {
      setValidationError(validationErr);
      setSaveStatus("error");
      return;
    }
    setValidationError(null);

    try {
      setSaveStatus("saving");
      const draft: DraftData = { title: title.slice(0, MAX_TITLE_LENGTH), content: content.slice(0, MAX_CONTENT_LENGTH), savedAt: new Date().toISOString() };
      localStorage.setItem(DRAFT_KEY_PREFIX + draftId, JSON.stringify(draft));

      const currentOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
      if (!currentOnline) {
        offlineQueue.push({ content, timestamp: Date.now() });
        setPendingCount(offlineQueue.length);
        setLastSaved(new Date());
        setSaveStatus("saved");
        return;
      }

      const response = await fetch("/api/stories/save", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content.slice(0, MAX_CONTENT_LENGTH) }),
      });

      if (!response.ok) {
        throw new Error("Failed to save to server");
      }

      setLastSaved(new Date());
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }, [draftId, title, content]);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      globalIsOnline = true;
      if (offlineQueue.length > 0) {
        try {
          setSaveStatus("saving");
          await flushOfflineQueue(offlineQueue);
          offlineQueue.length = 0;
          setPendingCount(0);
          setLastSaved(new Date());
          setSaveStatus("saved");
        } catch (error) {
          setSaveStatus("error");
          console.error("Failed to flush offline queue:", error);
        }
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      globalIsOnline = false;
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(save, DEBOUNCE_MS);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [title, content, save]);

  useEffect(() => {
    intervalTimer.current = setInterval(save, AUTOSAVE_INTERVAL_MS);
    return () => { if (intervalTimer.current) clearInterval(intervalTimer.current); };
  }, [save]);

  return { saveStatus, lastSaved, isOnline, pendingCount, save, validationError };
}

export function loadDraft(draftId: string) {
  try {
    const raw = localStorage.getItem(DRAFT_KEY_PREFIX + draftId);
    return raw ? (JSON.parse(raw) as DraftData) : null;
  } catch { return null; }
}

export function clearDraft(draftId: string) {
  localStorage.removeItem(DRAFT_KEY_PREFIX + draftId);
}
