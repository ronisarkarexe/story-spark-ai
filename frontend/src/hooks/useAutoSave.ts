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

export function useAutoSave(draftId: string, title: string, content: string) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const save = useCallback(() => {
    try {
      setSaveStatus("saving");
      const draft: DraftData = { title, content, savedAt: new Date().toISOString() };
      localStorage.setItem(DRAFT_KEY_PREFIX + draftId, JSON.stringify(draft));
      setLastSaved(new Date());
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }, [draftId, title, content]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(save, DEBOUNCE_MS);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [title, content, save]);

  useEffect(() => {
    intervalTimer.current = setInterval(save, AUTOSAVE_INTERVAL_MS);
    return () => { if (intervalTimer.current) clearInterval(intervalTimer.current); };
  }, [save]);

  return { saveStatus, lastSaved };
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
