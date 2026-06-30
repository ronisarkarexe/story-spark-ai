import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getSessionBookmarks,
  addSessionBookmark,
  removeSessionBookmark,
  isSessionBookmarked,
} from "../session-bookmarks";

const SESSION_KEY = "story_spark_session_bookmarks";

const mockStory = { uuid: "abc-123", title: "Test Story" };

beforeEach(() => {
  sessionStorage.clear();
  vi.restoreAllMocks();
});

describe("getSessionBookmarks", () => {
  it("returns empty array when no bookmarks stored", () => {
    expect(getSessionBookmarks()).toEqual([]);
  });

  it("returns parsed bookmarks from sessionStorage", () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify([mockStory]));
    expect(getSessionBookmarks()).toEqual([mockStory]);
  });

  it("returns empty array on JSON parse error", () => {
    sessionStorage.setItem(SESSION_KEY, "invalid-json");
    expect(getSessionBookmarks()).toEqual([]);
  });
});

describe("addSessionBookmark", () => {
  it("adds a story to sessionStorage", () => {
    addSessionBookmark(mockStory);
    const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY)!);
    expect(stored).toEqual([mockStory]);
  });

  it("does not add duplicate story", () => {
    addSessionBookmark(mockStory);
    addSessionBookmark(mockStory);
    const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY)!);
    expect(stored).toHaveLength(1);
  });

  it("dispatches session_bookmarks_changed event", () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    addSessionBookmark(mockStory);
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "session_bookmarks_changed" })
    );
  });
});

describe("removeSessionBookmark", () => {
  it("removes a story from sessionStorage", () => {
    addSessionBookmark(mockStory);
    removeSessionBookmark(mockStory.uuid);
    expect(getSessionBookmarks()).toEqual([]);
  });

  it("dispatches session_bookmarks_changed event", () => {
    addSessionBookmark(mockStory);
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    removeSessionBookmark(mockStory.uuid);
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "session_bookmarks_changed" })
    );
  });
});

describe("isSessionBookmarked", () => {
  it("returns true for bookmarked story", () => {
    addSessionBookmark(mockStory);
    expect(isSessionBookmarked(mockStory.uuid)).toBe(true);
  });

  it("returns false for non-bookmarked story", () => {
    expect(isSessionBookmarked("nonexistent")).toBe(false);
  });
});
