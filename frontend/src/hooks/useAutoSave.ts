import { useEffect, useRef, useCallback, useState } from "react";

const DRAFT_KEY_PREFIX = "story_draft_";
const AUTOSAVE_INTERVAL_MS = 30000;
const DEBOUNCE_MS = 1500;

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

export function useAutoSave(draftId: string, title: string, content: string) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [pendingCount, setPendingCount] = useState<number>(offlineQueue.length);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const save = useCallback(async () => {
    try {
      setSaveStatus("saving");
      const draft: DraftData = { title, content, savedAt: new Date().toISOString() };
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
        body: JSON.stringify({ content }),
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

  const saveRef = useRef(save);
  saveRef.current = save;

  useEffect(() => {
    intervalTimer.current = setInterval(() => saveRef.current(), AUTOSAVE_INTERVAL_MS);
    return () => { if (intervalTimer.current) clearInterval(intervalTimer.current); };
  }, []);

  return { saveStatus, lastSaved, isOnline, pendingCount, save };
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