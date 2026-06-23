/* eslint-disable */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getSessionBookmarks,
  addSessionBookmark,
  removeSessionBookmark,
  isSessionBookmarked,
} from "../session-bookmarks";

const mockStory = (uuid: string) => ({
  uuid,
  title: `Story ${uuid}`,
  author: "Test Author",
  content: "Test content",
  tags: ["test"],
  createdAt: new Date().toISOString(),
});

describe("session-bookmarks", () => {
  beforeEach(() => {
    sessionStorage.clear();
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

      const result = getSessionBookmarks();
      expect(result).toEqual([]);
    });
  });

  describe("addSessionBookmark", () => {
    it("adds a new bookmark", () => {
      const story = mockStory("uuid-1");
      addSessionBookmark(story);

      const stored = sessionStorage.getItem("story_spark_session_bookmarks");
      expect(JSON.parse(stored!)).toContainEqual(expect.objectContaining({ uuid: "uuid-1" }));
    });

    it("does not add duplicate uuid", () => {
      const story = mockStory("uuid-dupe");
      addSessionBookmark(story);
      addSessionBookmark(story);

      const result = getSessionBookmarks();
      expect(result.filter(s => s.uuid === "uuid-dupe")).toHaveLength(1);
    });

    it("dispatches session_bookmarks_changed event", () => {
      const story = mockStory("uuid-event");
      const handler = vi.fn();
      window.addEventListener("session_bookmarks_changed", handler);

      addSessionBookmark(story);

      expect(handler).toHaveBeenCalledTimes(1);
      window.removeEventListener("session_bookmarks_changed", handler);
    });
  });

  describe("removeSessionBookmark", () => {
    it("removes bookmark by uuid", () => {
      const stories = [mockStory("uuid-r1"), mockStory("uuid-r2")];
      sessionStorage.setItem("story_spark_session_bookmarks", JSON.stringify(stories));

      removeSessionBookmark("uuid-r1");

      const result = getSessionBookmarks();
      expect(result.map(s => s.uuid)).not.toContain("uuid-r1");
      expect(result.map(s => s.uuid)).toContain("uuid-r2");
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
