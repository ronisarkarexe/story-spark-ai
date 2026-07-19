
import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  getSessionBookmarks,
  addSessionBookmark,
  removeSessionBookmark,
  isSessionBookmarked,
} from "../session-bookmarks";


const SESSION_KEY = "story_spark_session_bookmarks";

const SESSION_STORE: Record<string, string> = {};
const mockGetItem = vi.fn((key: string) => SESSION_STORE[key] ?? null);
const mockSetItem = vi.fn((key: string, value: string) => {
  SESSION_STORE[key] = value;
});
const mockDispatchEvent = vi.fn();

const mockSessionStorage = {
  getItem: mockGetItem,
  setItem: mockSetItem,
  removeItem: vi.fn((key: string) => {
    delete SESSION_STORE[key];
  }),
  clear: vi.fn(() => {
    Object.keys(SESSION_STORE).forEach((k) => delete SESSION_STORE[k]);
  }),
  get length() {
    return Object.keys(SESSION_STORE).length;
  },
  key: vi.fn((i: number) => Object.keys(SESSION_STORE)[i] ?? null),
};

beforeEach(() => {
  vi.clearAllMocks();
  Object.keys(SESSION_STORE).forEach((k) => delete SESSION_STORE[k]);

  Object.defineProperty(globalThis, "sessionStorage", {
    value: mockSessionStorage,
    writable: true,
  });

  Object.defineProperty(globalThis, "window", {
    value: {
      dispatchEvent: mockDispatchEvent,
    },
    writable: true,
  });
});

interface Story {
  uuid: string;
  title: string;
  content: string;
  prompt: string;
  author: string;
}

const makeStory = (uuid: string, title = "Test Story"): Story => ({
  uuid,
  title,
  content: "content",
  prompt: "prompt",
  author: "author",
});

describe("getSessionBookmarks", () => {
  it("returns an empty array when sessionStorage is empty", () => {
    const result = getSessionBookmarks();
    expect(result).toEqual([]);
    expect(mockGetItem).toHaveBeenCalledWith(SESSION_KEY);
  });

  it("parses and returns bookmarks from sessionStorage", () => {
    const stories = [makeStory("abc-123", "Story A"), makeStory("def-456", "Story B")];
    SESSION_STORE[SESSION_KEY] = JSON.stringify(stories);

    const result = getSessionBookmarks();
    expect(result).toHaveLength(2);
    expect(result[0].uuid).toBe("abc-123");
    expect(result[1].uuid).toBe("def-456");
  });

  it("returns an empty array when sessionStorage contains invalid JSON", () => {
    SESSION_STORE[SESSION_KEY] = "not valid json";

    const result = getSessionBookmarks();
    expect(result).toEqual([]);
    expect(mockGetItem).toHaveBeenCalledWith(SESSION_KEY);
  });
});

describe("addSessionBookmark", () => {
  it("adds a story to sessionStorage", () => {
    const story = makeStory("uuid-1");
    addSessionBookmark(story);

    expect(mockSetItem).toHaveBeenCalledWith(SESSION_KEY, expect.any(String));
    const saved = JSON.parse(SESSION_STORE[SESSION_KEY]);
    expect(saved).toHaveLength(1);
    expect(saved[0].uuid).toBe("uuid-1");
  });

  it("dispatches session_bookmarks_changed event after adding", () => {
    addSessionBookmark(makeStory("uuid-2"));
    expect(mockDispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "session_bookmarks_changed" })
    );
  });

  it("does not add duplicate bookmark for same uuid", () => {
    const story = makeStory("dup-uuid");
    addSessionBookmark(story);
    addSessionBookmark(story);

    const saved = JSON.parse(SESSION_STORE[SESSION_KEY]);
    expect(saved).toHaveLength(1);
    expect(mockSetItem).toHaveBeenCalledTimes(1);
  });

  it("adds two different stories without deduplication", () => {
    addSessionBookmark(makeStory("uuid-a"));
    addSessionBookmark(makeStory("uuid-b"));

    const saved = JSON.parse(SESSION_STORE[SESSION_KEY]);
    expect(saved).toHaveLength(2);
  });
});

describe("removeSessionBookmark", () => {
  it("removes the story with the given uuid from sessionStorage", () => {
    SESSION_STORE[SESSION_KEY] = JSON.stringify([
      makeStory("remove-me"),
      makeStory("keep-me"),
    ]);

    removeSessionBookmark("remove-me");

    const saved = JSON.parse(SESSION_STORE[SESSION_KEY]);
    expect(saved).toHaveLength(1);
    expect(saved[0].uuid).toBe("keep-me");
  });

  it("dispatches session_bookmarks_changed event after removing", () => {
    SESSION_STORE[SESSION_KEY] = JSON.stringify([makeStory("to-remove")]);
    mockDispatchEvent.mockClear();

    removeSessionBookmark("to-remove");
    expect(mockDispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "session_bookmarks_changed" })
    );
  });

  it("handles removal of non-existent uuid without error", () => {
    expect(() => removeSessionBookmark("non-existent")).not.toThrow();
  });
});

describe("isSessionBookmarked", () => {
  it("returns true when the uuid exists in bookmarks", () => {
    SESSION_STORE[SESSION_KEY] = JSON.stringify([makeStory("exists-uuid")]);

    const result = isSessionBookmarked("exists-uuid");
    expect(result).toBe(true);
  });

  it("returns false when the uuid does not exist in bookmarks", () => {
    SESSION_STORE[SESSION_KEY] = JSON.stringify([makeStory("other-uuid")]);

    const result = isSessionBookmarked("missing-uuid");
    expect(result).toBe(false);
  });

  it("returns false when sessionStorage is empty", () => {
    const result = isSessionBookmarked("any-uuid");
    expect(result).toBe(false);
=======
describe("session-bookmarks utility", () => {
  const SESSION_KEY = "story_spark_session_bookmarks";

  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe("getSessionBookmarks", () => {
    it("should return empty array if no bookmarks in sessionStorage", () => {
      expect(getSessionBookmarks()).toEqual([]);
    });

    it("should parse and return stored bookmarks", () => {
      const mockBookmarks = [{ uuid: "123", title: "Test Story" }];
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(mockBookmarks));

      expect(getSessionBookmarks()).toEqual(mockBookmarks);
    });

    it("should handle JSON parse errors gracefully and return empty array", () => {
      sessionStorage.setItem(SESSION_KEY, "invalid-json{");
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(getSessionBookmarks()).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("addSessionBookmark", () => {
    it("should add a new bookmark and dispatch change event", () => {
      const dispatchSpy = vi.spyOn(window, "dispatchEvent");
      const story = { uuid: "123", title: "New Story" } as any;

      addSessionBookmark(story);

      expect(getSessionBookmarks()).toEqual([story]);
      expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
      expect(dispatchSpy.mock.calls[0][0].type).toBe("session_bookmarks_changed");
    });

    it("should not add a duplicate bookmark based on uuid", () => {
      const dispatchSpy = vi.spyOn(window, "dispatchEvent");
      const story1 = { uuid: "123", title: "Story 1" } as any;
      const story2 = { uuid: "123", title: "Story 1 Duplicate" } as any;

      addSessionBookmark(story1);
      dispatchSpy.mockClear();

      // Attempt to add duplicate
      addSessionBookmark(story2);

      expect(getSessionBookmarks()).toEqual([story1]);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe("removeSessionBookmark", () => {
    it("should remove bookmark by uuid and dispatch change event", () => {
      const dispatchSpy = vi.spyOn(window, "dispatchEvent");
      const story1 = { uuid: "123", title: "Story 1" } as any;
      const story2 = { uuid: "456", title: "Story 2" } as any;

      sessionStorage.setItem(SESSION_KEY, JSON.stringify([story1, story2]));

      removeSessionBookmark("123");

      expect(getSessionBookmarks()).toEqual([story2]);
      expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
      expect(dispatchSpy.mock.calls[0][0].type).toBe("session_bookmarks_changed");
    });
  });

  describe("isSessionBookmarked", () => {
    it("should return true if bookmark exists", () => {
      const story = { uuid: "123", title: "Bookmarked Story" } as any;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify([story]));

      expect(isSessionBookmarked("123")).toBe(true);
      expect(isSessionBookmarked("456")).toBe(false);
    });

    it("should return false if bookmark does not exist", () => {
      expect(isSessionBookmarked("123")).toBe(false);
    });

  });
});
