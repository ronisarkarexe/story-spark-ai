// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getSessionBookmarks,
  addSessionBookmark,
  removeSessionBookmark,
  isSessionBookmarked,
} from "../session-bookmarks";
import { IStories } from "../../components/stories/stories.view.component";

const sampleStory: IStories = {
  uuid: "test-uuid-1",
  title: "Test Story",
  description: "Test Description",
  content: "Once upon a time...",
  genre: "Fantasy",
  createdAt: "2026-01-01",
};

describe("session-bookmarks utility", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns empty array when no bookmarks exist in sessionStorage", () => {
    const bookmarks = getSessionBookmarks();
    expect(bookmarks).toEqual([]);
  });

  it("adds a story to session bookmarks and dispatches change event", () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    addSessionBookmark(sampleStory);

    const bookmarks = getSessionBookmarks();
    expect(bookmarks).toHaveLength(1);
    expect(bookmarks[0].uuid).toBe("test-uuid-1");
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
  });

  it("does not add duplicate story to session bookmarks", () => {
    addSessionBookmark(sampleStory);
    addSessionBookmark(sampleStory);

    const bookmarks = getSessionBookmarks();
    expect(bookmarks).toHaveLength(1);
  });

  it("checks if a story is bookmarked correctly", () => {
    expect(isSessionBookmarked("test-uuid-1")).toBe(false);
    addSessionBookmark(sampleStory);
    expect(isSessionBookmarked("test-uuid-1")).toBe(true);
  });

  it("removes a bookmarked story by uuid", () => {
    addSessionBookmark(sampleStory);
    expect(isSessionBookmarked("test-uuid-1")).toBe(true);

    removeSessionBookmark("test-uuid-1");
    expect(isSessionBookmarked("test-uuid-1")).toBe(false);
    expect(getSessionBookmarks()).toEqual([]);
  });

  it("handles JSON parse error gracefully", () => {
    sessionStorage.setItem("story_spark_session_bookmarks", "invalid-json");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const bookmarks = getSessionBookmarks();
    expect(bookmarks).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
