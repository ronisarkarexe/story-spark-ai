import { IStories } from "../components/stories/stories.view.component";

import logger from "./logger.util";
const SESSION_KEY = "story_spark_session_bookmarks";

export const getSessionBookmarks = (): IStories[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      logger.warn("Session bookmarks data is corrupted (not an array). Resetting.");
      sessionStorage.removeItem(SESSION_KEY);
      return [];
    }
    return parsed as IStories[];
  } catch (error) {
    logger.error("Failed to read session bookmarks", error);
    sessionStorage.removeItem(SESSION_KEY); // clear corrupted data
    return [];
  }
};

export const addSessionBookmark = (story: IStories): void => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const bookmarks = getSessionBookmarks();
    if (!bookmarks.some((b) => b.uuid === story.uuid)) {
      bookmarks.push(story);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(bookmarks));
      window.dispatchEvent(new Event("session_bookmarks_changed"));
    }
  } catch (error) {
    logger.error("Failed to add session bookmark", error);
  }
};

export const removeSessionBookmark = (uuid: string): void => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const bookmarks = getSessionBookmarks();
    const existed = bookmarks.some((b) => b.uuid === uuid);
    if (!existed) return; // nothing to remove — skip write and event
    const updated = bookmarks.filter((b) => b.uuid !== uuid);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("session_bookmarks_changed"));
  } catch (error) {
    logger.error("Failed to remove session bookmark", error);
  }
};

export const isSessionBookmarked = (uuid: string): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  const bookmarks = getSessionBookmarks();
  return bookmarks.some((b) => b.uuid === uuid);
};
