import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getSessionBookmarks,
  addSessionBookmark,
  removeSessionBookmark,
  isSessionBookmarked,
} from "../session-bookmarks";

const SESSION_KEY = "story_spark_session_bookmarks";

const mockStory = {
  uuid: "story-123",
  title: "Test Story",
  author: "Test Author",
  content: "Test content",
};

const createMockEventMap = () => {
  const listeners: Record<string, EventListenerOrEventListenerObject[]> = {};
  return {
    listeners,
    addEventListener: vi.fn((event: string, listener: EventListenerOrEventListenerObject) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(listener);
    }),
    dispatchEvent: vi.fn((event: Event) => {
      const eventListeners = listeners[event.type] || [];
      eventListeners.forEach((listener) => {
        if (typeof listener === "function") {
          listener(event);
        } else {
          listener.handleEvent(event);
        }
      });
      return true;
    }),
  };
};

describe("session-bookmarks utility", () => {
  let storage: Record<string, string>;
  let window: Window & typeof globalThis;

  beforeEach(() => {
    storage = {};
    window = createMockEventMap() as unknown as Window & typeof globalThis;
    vi.stubGlobal("window", window);
    vi.stubGlobal("sessionStorage", {
      getItem: vi.fn((key: string) => storage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete storage[key];
      }),
    });
  });

  afterEach(() => {
    storage = {};
    vi.restoreAllMocks();
  });

  describe("getSessionBookmarks", () => {
    it("returns an empty array when sessionStorage is empty", () => {
      const result = getSessionBookmarks();
      expect(result).toEqual([]);
    });

    it("returns parsed bookmarks when sessionStorage has data", () => {
      storage[SESSION_KEY] = JSON.stringify([mockStory]);
      const result = getSessionBookmarks();
      expect(result).toEqual([mockStory]);
    });

    it("returns an empty array when parse error occurs", () => {
      storage[SESSION_KEY] = "not valid json {{{";
      const result = getSessionBookmarks();
      expect(result).toEqual([]);
    });
  });

  describe("addSessionBookmark", () => {
    it("adds a new bookmark when it does not exist", () => {
      addSessionBookmark(mockStory as any);
      const stored = JSON.parse(storage[SESSION_KEY]);
      expect(stored).toContainEqual(mockStory);
      expect(window.dispatchEvent).toHaveBeenCalled();
    });

    it("does not add duplicate bookmark", () => {
      storage[SESSION_KEY] = JSON.stringify([mockStory]);
      const dispatchSpy = vi.spyOn(window, "dispatchEvent");
      addSessionBookmark(mockStory as any);
      const stored = JSON.parse(storage[SESSION_KEY]);
      expect(stored.length).toBe(1);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe("removeSessionBookmark", () => {
    it("removes an existing bookmark by uuid", () => {
      storage[SESSION_KEY] = JSON.stringify([mockStory, { ...mockStory, uuid: "story-456" }]);
      removeSessionBookmark("story-123");
      const stored = JSON.parse(storage[SESSION_KEY]);
      expect(stored.map((s: any) => s.uuid)).not.toContain("story-123");
    });

    it("handles removing a non-existent uuid gracefully", () => {
      storage[SESSION_KEY] = JSON.stringify([mockStory]);
      expect(() => removeSessionBookmark("non-existent")).not.toThrow();
      const stored = JSON.parse(storage[SESSION_KEY]);
      expect(stored.length).toBe(1);
    });
  });

  describe("isSessionBookmarked", () => {
    it("returns true for an existing bookmark uuid", () => {
      storage[SESSION_KEY] = JSON.stringify([mockStory]);
      expect(isSessionBookmarked("story-123")).toBe(true);
    });

    it("returns false for a non-existent uuid", () => {
      storage[SESSION_KEY] = JSON.stringify([mockStory]);
      expect(isSessionBookmarked("non-existent")).toBe(false);
    });

    it("returns false when storage is empty", () => {
      expect(isSessionBookmarked("story-123")).toBe(false);
    });
  });
});
