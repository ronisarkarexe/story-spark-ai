import { useEffect, useRef, useCallback, useState } from "react";
import api from "../services/api";

const DRAFT_KEY_PREFIX = "story_draft_";
const AUTOSAVE_INTERVAL_MS = 30000;
const DEBOUNCE_MS = 1500;

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface DraftData {
  title: string;
  content: string;
  savedAt: string;
}


interface QueuedSave {

  draftId: string;
  title: string;
  content: string;
  timestamp: number;
}


export const offlineQueue: QueuedSave[] = [];
let globalIsOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

// Single-flight guard: ensures only ONE flush of the shared offlineQueue is
// ever in progress at a time, no matter how many useAutoSave instances have
// an "online" listener attached at once. See issue #4870.
let flushInProgress: Promise<void> | null = null;

async function saveDraftToServer(item: Pick<QueuedSave, "draftId" | "title" | "content">) {
  // PATCH /api/v1/story/:draftId/save — see backend/src/routes/story.routes.ts
  await api.patch(`/story/${item.draftId}/save`, {
    title: item.title,
    content: item.content,
  });
}

export async function flushOfflineQueue(queue: QueuedSave[]) {
  for (const item of queue) {
    await saveDraftToServer(item);
  }
}

/**
 * Drains and flushes the shared offlineQueue exactly once, even when called
 * concurrently by multiple "online" listeners. Items are removed from the
 * queue synchronously (via splice) before the network call, so a listener
 * that fires a moment later sees an empty queue and does nothing. If the
 * flush fails, items are put back so the next "online" event retries them.
 */
async function flushOfflineQueueOnce(
  onStart: () => void,
  onSuccess: () => void,
  onError: (error: unknown) => void
): Promise<void> {
  if (flushInProgress) {
    return flushInProgress;
  }
  if (offlineQueue.length === 0) return;

  onStart();
  flushInProgress = (async () => {
    const itemsToFlush = offlineQueue.splice(0, offlineQueue.length);
    try {
      await flushOfflineQueue(itemsToFlush);
      onSuccess();
    } catch (error) {
      // Put the unsent items back so a future "online" event retries them.
      offlineQueue.unshift(...itemsToFlush);
      onError(error);
    }
  })();

  try {
    await flushInProgress;
  } finally {
    flushInProgress = null;

type AutoSaveEvent =
  | { type: "online" }
  | { type: "offline" }
  | { type: "queue-updated"; pendingCount: number }
  | { type: "flush-start" }
  | { type: "flush-complete" }
  | { type: "flush-failed"; error: unknown };

export const offlineQueue: Array<QueueItem> = [];
let globalIsOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
const autoSaveSubscribers = new Set<(event: AutoSaveEvent) => void>();
let autoSaveListenersAttached = false;
let autoSaveOnlineHandler: (() => Promise<void>) | null = null;
let autoSaveOfflineHandler: (() => void) | null = null;
let flushPromise: Promise<void> | null = null;

function notifyAutoSaveSubscribers(event: AutoSaveEvent) {
  autoSaveSubscribers.forEach((subscriber) => subscriber(event));
}

function updateQueueState() {
  notifyAutoSaveSubscribers({ type: "queue-updated", pendingCount: offlineQueue.length });
}

function ensureAutoSaveListeners() {
  if (autoSaveListenersAttached) {
    return;
  }

  autoSaveOnlineHandler = async () => {
    globalIsOnline = true;
    notifyAutoSaveSubscribers({ type: "online" });

    if (offlineQueue.length === 0 || flushPromise) {
      return;
    }

    notifyAutoSaveSubscribers({ type: "flush-start" });

    flushPromise = (async () => {
      const pendingItems = offlineQueue.splice(0, offlineQueue.length);

      try {
        for (const item of pendingItems) {
          const response = await fetch("/api/v1/stories/save", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              draftId: item.draftId,
              title: item.title,
              content: item.content,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to save queued draft");
          }
        }

        updateQueueState();
        notifyAutoSaveSubscribers({ type: "flush-complete" });
      } catch (error) {
        offlineQueue.unshift(...pendingItems);
        updateQueueState();
        notifyAutoSaveSubscribers({ type: "flush-failed", error });
      } finally {
        flushPromise = null;
      }
    })();
  };

  autoSaveOfflineHandler = () => {
    globalIsOnline = false;
    notifyAutoSaveSubscribers({ type: "offline" });
  };

  window.addEventListener("online", autoSaveOnlineHandler);
  window.addEventListener("offline", autoSaveOfflineHandler);
  autoSaveListenersAttached = true;
}

function registerAutoSaveListener(subscriber: (event: AutoSaveEvent) => void) {
  autoSaveSubscribers.add(subscriber);
  ensureAutoSaveListeners();

  return () => {
    autoSaveSubscribers.delete(subscriber);

    if (autoSaveSubscribers.size === 0 && autoSaveOnlineHandler && autoSaveOfflineHandler) {
      window.removeEventListener("online", autoSaveOnlineHandler);
      window.removeEventListener("offline", autoSaveOfflineHandler);
      autoSaveOnlineHandler = null;
      autoSaveOfflineHandler = null;
      autoSaveListenersAttached = false;
      flushPromise = null;
    }
  };
}

export async function flushOfflineQueue(queue: Array<QueueItem>) {
  const pendingItems = queue.splice(0, queue.length);

  for (const item of pendingItems) {
    const response = await fetch("/api/v1/stories/save", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        draftId: item.draftId,
        title: item.title,
        content: item.content,
      }),
    });

    if (!response.ok) {
      queue.unshift(...pendingItems);
      throw new Error("Failed to save queued draft");
    }

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
        offlineQueue.push({ draftId, title, content, timestamp: Date.now() });
        setPendingCount(offlineQueue.length);
        updateQueueState();
        setLastSaved(new Date());
        setSaveStatus("saved");
        return;
      }

      await saveDraftToServer({ draftId, title, content });
      const response = await fetch("/api/v1/stories/save", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ draftId, title, content }),
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
    const handleOnline = () => {
      setIsOnline(true);
      globalIsOnline = true;
      flushOfflineQueueOnce(
        () => setSaveStatus("saving"),
        () => {
          setPendingCount(offlineQueue.length);
          setLastSaved(new Date());
          setSaveStatus("saved");
        },
        (error) => {
          setPendingCount(offlineQueue.length);
          setSaveStatus("error");
          console.error("Failed to flush offline queue:", error);
        }
      );
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

    const unsubscribe = registerAutoSaveListener((event) => {
      switch (event.type) {
        case "online":
          setIsOnline(true);
          setPendingCount(offlineQueue.length);
          break;
        case "offline":
          setIsOnline(false);
          break;
        case "queue-updated":
          setPendingCount(event.pendingCount);
          break;
        case "flush-start":
          setSaveStatus("saving");
          break;
        case "flush-complete":
          setPendingCount(offlineQueue.length);
          setLastSaved(new Date());
          setSaveStatus("saved");
          break;
        case "flush-failed":
          setPendingCount(offlineQueue.length);
          setSaveStatus("error");
          break;
        default:
          break;
      }
    });

    return unsubscribe;

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