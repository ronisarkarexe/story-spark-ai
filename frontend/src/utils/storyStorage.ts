
import { Story } from "../types/story.types";

const STORAGE_KEY = "storyspark_story_v2";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const SCHEMA_VERSION = 2;

interface StoredSession {
  version: number;
  userId: string;
  savedAt: number;
  story: Story;
}

export const saveStorySession = (story: Story, userId: string): void => {
  const payload: StoredSession = {
    version: SCHEMA_VERSION,
    userId,
    savedAt: Date.now(),
    story,
  };
  try {
    // Remove old key if exists
    localStorage.removeItem("story");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("localStorage quota exceeded, story not saved");
  }
};

export const loadStorySession = (userId: string): Story | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: StoredSession = JSON.parse(raw);

    // Reject mismatched schema version
    if (parsed.version !== SCHEMA_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    // Reject cross-user data
    if (parsed.userId !== userId) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    // Reject expired data
    if (Date.now() - parsed.savedAt > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    // Validate required shape
    if (!parsed.story?.id || !Array.isArray(parsed.story?.chapters)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed.story;
  } catch {
    return null;
  }
};

export const clearStorySession = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("story"); // clean up old key too
};
