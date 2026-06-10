import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Auto-save draft data shape stored in localStorage.
 * Includes a timestamp so the UI can show "Draft saved X ago".
 */
export interface IDraftData {
  prompt: string;
  genre: string;
  length: string;
  language: string;
  stories: unknown[];
  savedAt: number; // epoch ms
}

const DRAFT_STORAGE_KEY = "story_spark_draft";
const AUTO_SAVE_DELAY_MS = 1000; // debounce interval

export type AutoSaveStatus = "idle" | "saving" | "saved" | "restored";

export interface UseAutoSaveDraftOptions {
  prompt: string;
  genre: string;
  length: string;
  language: string;
  stories: unknown[];
}

/**
 * Hook to auto-save prompt drafts to localStorage with:
 * - Debounced persistence (1 s)
 * - Visual save-status tracking (idle → saving → saved)
 * - Draft restoration on mount
 * - Explicit clear method (call after successful generation/publish)
 * - beforeunload protection when unsaved changes exist
 */
export const useAutoSaveDraft = (options: UseAutoSaveDraftOptions) => {
  const { prompt, genre, length, language, stories } = options;

  const [saveStatus, setSaveStatus] = useState<AutoSaveStatus>("idle");
  const [restoredDraft, setRestoredDraft] = useState<IDraftData | null>(null);
  const [showRestoredBanner, setShowRestoredBanner] = useState(false);
  const hasUnsavedChanges = useRef(false);
  const isFirstRender = useRef(true);

  // ── Restore draft on mount ──────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed: IDraftData = JSON.parse(raw);
        // Only show the banner if there's a meaningful prompt saved
        if (parsed.prompt && parsed.prompt.trim().length > 0) {
          setRestoredDraft(parsed);
          setShowRestoredBanner(true);
          setSaveStatus("restored");
        }
      }
    } catch {
      // Corrupted data — silently ignore
    }
  }, []);

  // ── Auto-dismiss the "Draft restored" banner after 5 s ─────────────
  useEffect(() => {
    if (!showRestoredBanner) return;
    const timer = setTimeout(() => {
      setShowRestoredBanner(false);
      setSaveStatus("idle");
    }, 5000);
    return () => clearTimeout(timer);
  }, [showRestoredBanner]);

  // ── Debounced auto-save ─────────────────────────────────────────────
  useEffect(() => {
    // Skip the very first render to avoid immediately overwriting
    // the draft we just restored with the same values.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    hasUnsavedChanges.current = true;
    setSaveStatus("saving");

    const timer = setTimeout(() => {
      const draftData: IDraftData = {
        prompt,
        genre,
        length,
        language,
        stories,
        savedAt: Date.now(),
      };
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
        setSaveStatus("saved");
        hasUnsavedChanges.current = false;
      } catch {
        // localStorage full or unavailable — fail silently
        setSaveStatus("idle");
      }

      // Reset back to idle after 2 s so the indicator fades
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, AUTO_SAVE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [prompt, genre, length, language, stories]);

  // ── beforeunload guard ──────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges.current && prompt.trim().length > 0) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [prompt]);

  // ── Clear draft (call on successful generation / publish) ──────────
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    hasUnsavedChanges.current = false;
    setSaveStatus("idle");
    setRestoredDraft(null);
    setShowRestoredBanner(false);
  }, []);

  // ── Dismiss restored banner manually ───────────────────────────────
  const dismissRestoredBanner = useCallback(() => {
    setShowRestoredBanner(false);
    setSaveStatus("idle");
  }, []);

  return {
    saveStatus,
    restoredDraft,
    showRestoredBanner,
    clearDraft,
    dismissRestoredBanner,
  };
};
