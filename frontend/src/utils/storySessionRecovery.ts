export interface StoryRecoveryData {
  content: string;
  savedAt: string;
}

const STORAGE_KEY = "story-session-recovery";

export function saveDraft(content: string) {
  const draft: StoryRecoveryData = {
    content,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(draft)
  );

  return draft;
}

export function getRecoveredDraft(): StoryRecoveryData | null {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return null;

  return JSON.parse(data);
}

export function discardRecoveredDraft() {
  localStorage.removeItem(STORAGE_KEY);
}

export function formatSavedTime(savedAt: string) {
  return new Date(savedAt).toLocaleString();
}