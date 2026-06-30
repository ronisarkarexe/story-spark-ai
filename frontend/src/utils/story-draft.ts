import { getFromLocalStorage, removeFromLocalStorage, setToLocalStorage } from "./local-storage";

const STORY_DRAFT_KEY = "storyspark_story_draft_v1";
const MAX_DRAFT_SIZE_BYTES = 1024 * 200;

export interface StoryDraftData {
  prompt: string;
  genre: string;
  length: string;
  tone: string;
  language: string;
  savedAt: string;
}

export const saveStoryDraft = (draft: StoryDraftData): void => {
  if (typeof window === "undefined" || !draft) {
    return;
  }

  const serialized = JSON.stringify(draft);
  if (new Blob([serialized]).size > MAX_DRAFT_SIZE_BYTES) {
    console.warn("Draft too large, clearing previous draft");
    clearStoryDraft();
    return;
  }

  setToLocalStorage(STORY_DRAFT_KEY, serialized);
};

export const loadStoryDraft = (): StoryDraftData | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = getFromLocalStorage(STORY_DRAFT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoryDraftData;
  } catch (error) {
    console.error("Failed to parse saved story draft:", error);
    return null;
  }
};

export const clearStoryDraft = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  removeFromLocalStorage(STORY_DRAFT_KEY);
};
