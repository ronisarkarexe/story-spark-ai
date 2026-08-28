// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getSessionBookmarks,
  addSessionBookmark,
  removeSessionBookmark,
  isSessionBookmarked,
} from "../session-bookmarks";
import { IStories } from "../../components/stories/stories.view.component";

const mockStory = (uuid: string): IStories => ({
  uuid,
  title: `Story ${uuid}`,
  description: "Test Description",
  content: "Test content",
  genre: "Fantasy",
  createdAt: new Date().toISOString(),
});

describe("session-bookmarks utility", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe("getSessionBookmarks", () => {
    it("returns empty array when no bookmarks stored", () => {
      const result = getSessionBookmarks();
      expect(result).toEqual([]);
    });

    it("returns parsed bookmarks when data exists", () => {
      const stories = [mockStory("uuid-1"), mockStory("uuid-2")];
      sessionStorage.setItem("story_spark_session_bookmarks", JSON.stringify(stories));

      const result = getSessionBookmarks();
      expect(result).toEqual(stories);
    });

    it("returns empty array on JSON parse error", () => {
      sessionStorage.setItem("story_spark_session_bookmarks", "not valid json");
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = getSessionBookmarks();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe("addSessionBookmark", () => {
    it("adds a new bookmark and dispatches event", () => {
      const story = mockStory("uuid-1");
      const handler = vi.fn();
      window.addEventListener("session_bookmarks_changed", handler);

      addSessionBookmark(story);

      const result = getSessionBookmarks();
      expect(result).toHaveLength(1);
      expect(result[0].uuid).toBe("uuid-1");
      expect(handler).toHaveBeenCalledTimes(1);
      window.removeEventListener("session_bookmarks_changed", handler);
    });

    it("does not add duplicate uuid", () => {
      const story = mockStory("uuid-dupe");
      addSessionBookmark(story);
      addSessionBookmark(story);

      const result = getSessionBookmarks();
      expect(result.filter((s) => s.uuid === "uuid-dupe")).toHaveLength(1);
    });
  });

  describe("removeSessionBookmark", () => {
    it("removes bookmark by uuid", () => {
      const stories = [mockStory("uuid-r1"), mockStory("uuid-r2")];
      sessionStorage.setItem("story_spark_session_bookmarks", JSON.stringify(stories));

      removeSessionBookmark("uuid-r1");

      const result = getSessionBookmarks();
      expect(result.map((s) => s.uuid)).not.toContain("uuid-r1");
      expect(result.map((s) => s.uuid)).toContain("uuid-r2");
    });

    it("handles non-existent uuid gracefully", () => {
      const stories = [mockStory("uuid-only")];
      sessionStorage.setItem("story_spark_session_bookmarks", JSON.stringify(stories));

      expect(() => removeSessionBookmark("uuid-nonexistent")).not.toThrow();

      const result = getSessionBookmarks();
      expect(result).toHaveLength(1);
    });
  });

  describe("isSessionBookmarked", () => {
    it("returns true for bookmarked uuid", () => {
      const stories = [mockStory("uuid-yes")];
      sessionStorage.setItem("story_spark_session_bookmarks", JSON.stringify(stories));

      expect(isSessionBookmarked("uuid-yes")).toBe(true);
    });

    it("returns false for non-bookmarked uuid", () => {
      expect(isSessionBookmarked("uuid-no")).toBe(false);
    });
  });
});
