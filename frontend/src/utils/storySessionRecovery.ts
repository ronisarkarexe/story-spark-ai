export interface StoryRecoveryData {
  content: string;
  savedAt: string;
}

const STORAGE_KEY = "story-session-recovery";

const hasLocalStorage = (): boolean =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export function saveDraft(content: string): StoryRecoveryData | null {
  const draft: StoryRecoveryData = {
    content,
    savedAt: new Date().toISOString(),
  };

  if (!hasLocalStorage()) return draft;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(draft)
  );

  return draft;
}

export function getRecoveredDraft(): StoryRecoveryData | null {
  if (!hasLocalStorage()) return null;

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return null;

  try {
    return JSON.parse(data) as StoryRecoveryData;
  } catch {
    return null;
  }
}

export function discardRecoveredDraft() {
  if (!hasLocalStorage()) return;
  localStorage.removeItem(STORAGE_KEY);
}

export function formatSavedTime(savedAt: string) {
  return new Date(savedAt).toLocaleString();
}