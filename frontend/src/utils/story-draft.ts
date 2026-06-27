import { getFromLocalStorage, removeFromLocalStorage, setToLocalStorage } from "./local-storage";

const STORY_DRAFT_KEY = "storyspark_story_draft_v1";

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

  setToLocalStorage(STORY_DRAFT_KEY, JSON.stringify(draft));
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
