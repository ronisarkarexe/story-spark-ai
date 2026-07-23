import { IStories } from "../components/stories/stories.view.component";

const SESSION_KEY = "story_spark_session_bookmarks";

export const getSessionBookmarks = (): IStories[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to read session bookmarks", error);
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
    console.error("Failed to add session bookmark", error);
  }
};

export const removeSessionBookmark = (uuid: string): void => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const bookmarks = getSessionBookmarks();
    const updated = bookmarks.filter((b) => b.uuid !== uuid);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("session_bookmarks_changed"));
  } catch (error) {
    console.error("Failed to remove session bookmark", error);
  }
};

export const isSessionBookmarked = (uuid: string): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  const bookmarks = getSessionBookmarks();
  return bookmarks.some((b) => b.uuid === uuid);
};
