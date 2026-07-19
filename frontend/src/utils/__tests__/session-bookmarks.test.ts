// @vitest-environment jsdom
import {
  getSessionBookmarks,
  addSessionBookmark,
  removeSessionBookmark,
  isSessionBookmarked,
} from "./session-bookmarks";

import { describe, it, expect, beforeEach, vi } from "vitest";

describe("session-bookmarks", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  const story = {
    uuid: "story-1",
    title: "Test Story",
  } as any;

  it("returns empty array when storage is empty", () => {
    expect(getSessionBookmarks()).toEqual([]);
  });

  it("returns stored bookmarks", () => {
    sessionStorage.setItem(
      "story_spark_session_bookmarks",
      JSON.stringify([story])
    );

    expect(getSessionBookmarks()).toEqual([story]);
  });

  it("adds a bookmark", () => {
    addSessionBookmark(story);

    expect(getSessionBookmarks()).toEqual([story]);
  });

  it("does not add duplicate bookmarks", () => {
    addSessionBookmark(story);
    addSessionBookmark(story);

    expect(getSessionBookmarks()).toHaveLength(1);
  });

  it("removes a bookmark", () => {
    addSessionBookmark(story);

    removeSessionBookmark(story.uuid);

    expect(getSessionBookmarks()).toEqual([]);
  });

  it("does nothing for non-existing uuid", () => {
    removeSessionBookmark("abc");

    expect(getSessionBookmarks()).toEqual([]);
  });

  it("returns true if story is bookmarked", () => {
    addSessionBookmark(story);

    expect(isSessionBookmarked(story.uuid)).toBe(true);
  });

  it("returns false if story is not bookmarked", () => {
    expect(isSessionBookmarked(story.uuid)).toBe(false);
  });

  it("dispatches event when adding bookmark", () => {
    const spy = vi.spyOn(window, "dispatchEvent");

    addSessionBookmark(story);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "session_bookmarks_changed",
      })
    );
  });

  it("dispatches event when removing bookmark", () => {
    addSessionBookmark(story);

    const spy = vi.spyOn(window, "dispatchEvent");

    removeSessionBookmark(story.uuid);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "session_bookmarks_changed",
      })
    );
  });
});