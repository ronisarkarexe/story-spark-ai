import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getSessionBookmarks,
  addSessionBookmark,
  removeSessionBookmark,
  isSessionBookmarked,
} from "../session-bookmarks";

const SESSION_KEY = "story_spark_session_bookmarks";

const mockStory = {
  uuid: "story-1",
  title: "Test Story",
  content: "This is test content.",
  tag: "fiction",
  imageURL: "https://example.com/image.jpg",
};

const mockEventListener = vi.fn();
global.window.dispatchEvent = mockEventListener;

describe("session-bookmarks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe("getSessionBookmarks", () => {
    it("should return empty array when sessionStorage is empty", () => {
      expect(getSessionBookmarks()).toEqual([]);
    });

    it("should return parsed array when sessionStorage has data", () => {
      const bookmarks = [mockStory];
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(bookmarks));
      expect(getSessionBookmarks()).toEqual(bookmarks);
    });

    it("should return empty array when sessionStorage contains invalid JSON", () => {
      sessionStorage.setItem(SESSION_KEY, "not-valid-json");
      expect(getSessionBookmarks()).toEqual([]);
    });

    it("should return null parsed value when sessionStorage item is string null", () => {
      sessionStorage.setItem(SESSION_KEY, "null");
      // JSON.parse('null') returns null, which is a truthy string value,
      // so the ternary returns null (not []).
      expect(getSessionBookmarks()).toBe(null);
    });
  });

  describe("addSessionBookmark", () => {
    it("should add a new bookmark when not already bookmarked", () => {
      addSessionBookmark(mockStory);
      const bookmarks = getSessionBookmarks();
      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].uuid).toBe(mockStory.uuid);
      expect(mockEventListener).toHaveBeenCalledWith(
        expect.objectContaining({ type: "session_bookmarks_changed" })
      );
    });

    it("should not add duplicate bookmark if uuid already exists", () => {
      addSessionBookmark(mockStory);
      addSessionBookmark(mockStory);
      const bookmarks = getSessionBookmarks();
      expect(bookmarks).toHaveLength(1);
    });

    it("should add a second bookmark with different uuid", () => {
      const story2 = { ...mockStory, uuid: "story-2" };
      addSessionBookmark(mockStory);
      addSessionBookmark(story2);
      const bookmarks = getSessionBookmarks();
      expect(bookmarks).toHaveLength(2);
    });

    it("should handle errors gracefully when sessionStorage fails", () => {
      const originalSetItem = sessionStorage.setItem;
      sessionStorage.setItem = vi.fn().mockImplementationOnce(() => {
        throw new Error("Storage error");
      });
      // Should not throw
      expect(() => addSessionBookmark(mockStory)).not.toThrow();
      sessionStorage.setItem = originalSetItem;
    });
  });

  describe("removeSessionBookmark", () => {
    it("should remove a bookmark by uuid", () => {
      addSessionBookmark(mockStory);
      removeSessionBookmark(mockStory.uuid);
      expect(getSessionBookmarks()).toEqual([]);
      expect(mockEventListener).toHaveBeenCalledWith(
        expect.objectContaining({ type: "session_bookmarks_changed" })
      );
    });

    it("should do nothing when uuid is not found", () => {
      addSessionBookmark(mockStory);
      removeSessionBookmark("non-existent-uuid");
      expect(getSessionBookmarks()).toHaveLength(1);
    });

    it("should handle errors gracefully when sessionStorage fails on read", () => {
      const originalGetItem = sessionStorage.getItem;
      sessionStorage.getItem = vi.fn().mockImplementationOnce(() => {
        throw new Error("Storage error");
      });
      expect(() => removeSessionBookmark(mockStory.uuid)).not.toThrow();
      sessionStorage.getItem = originalGetItem;
    });
  });

  describe("isSessionBookmarked", () => {
    it("should return true when story is bookmarked", () => {
      addSessionBookmark(mockStory);
      expect(isSessionBookmarked(mockStory.uuid)).toBe(true);
    });

    it("should return false when story is not bookmarked", () => {
      expect(isSessionBookmarked("non-existent-uuid")).toBe(false);
    });

    it("should return false when sessionStorage is empty", () => {
      expect(isSessionBookmarked(mockStory.uuid)).toBe(false);
    });
  });
});
