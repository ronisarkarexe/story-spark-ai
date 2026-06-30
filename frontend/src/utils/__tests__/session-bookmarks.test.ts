/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getSessionBookmarks,
  addSessionBookmark,
  removeSessionBookmark,
  clearSessionBookmarks,
} from "../session-bookmarks";

const STORY_MOCK = {
  uuid: "story-123",
  title: "The Dragon's Quest",
  author: "Jane Writer",
  genre: "Fantasy",
  coverImage: "https://example.com/cover.jpg",
};

const STORY_MOCK_2 = {
  uuid: "story-456",
  title: "Mystery at Midnight",
  author: "John Author",
  genre: "Mystery",
  coverImage: "https://example.com/cover2.jpg",
};

const SESSION_STORE: Record<string, string> = {};
const SESSION_GET = vi.fn((key: string) => SESSION_STORE[key] ?? null);
const SESSION_SET = vi.fn((key: string, value: string) => {
  SESSION_STORE[key] = value;
});
const SESSION_REMOVE = vi.fn((key: string) => {
  delete SESSION_STORE[key];
});

Object.defineProperty(globalThis, "sessionStorage", {
  value: {
    getItem: SESSION_GET,
    setItem: SESSION_SET,
    removeItem: SESSION_REMOVE,
  },
  writable: true,
});

beforeEach(() => {
  vi.clearAllMocks();
  for (const key of Object.keys(SESSION_STORE)) {
    delete SESSION_STORE[key];
  }
});

describe("getSessionBookmarks", () => {
  it("returns empty array when no bookmarks exist", () => {
    expect(getSessionBookmarks()).toEqual([]);
  });

  it("returns parsed bookmarks array when session storage has data", () => {
    SESSION_STORE["story_spark_session_bookmarks"] = JSON.stringify([
      STORY_MOCK,
    ]);
    expect(getSessionBookmarks()).toEqual([STORY_MOCK]);
  });

  it("returns empty array on JSON parse error", () => {
    SESSION_STORE["story_spark_session_bookmarks"] = "not valid json {{{";
    expect(getSessionBookmarks()).toEqual([]);
    expect(SESSION_GET).toHaveBeenCalled();
  });

  it("returns empty array when sessionStorage.getItem returns null", () => {
    SESSION_GET.mockReturnValueOnce(null);
    expect(getSessionBookmarks()).toEqual([]);
  });
});

describe("addSessionBookmark", () => {
  it("adds a new bookmark when none exist", () => {
    addSessionBookmark(STORY_MOCK);
    const stored = JSON.parse(SESSION_STORE["story_spark_session_bookmarks"]);
    expect(stored).toEqual([STORY_MOCK]);
  });

  it("deduplicates bookmarks by uuid", () => {
    SESSION_STORE["story_spark_session_bookmarks"] = JSON.stringify([STORY_MOCK]);
    addSessionBookmark(STORY_MOCK);
    const stored = JSON.parse(SESSION_STORE["story_spark_session_bookmarks"]);
    expect(stored).toHaveLength(1);
    expect(stored[0]).toEqual(STORY_MOCK);
  });

  it("adds new bookmark alongside existing ones", () => {
    SESSION_STORE["story_spark_session_bookmarks"] = JSON.stringify([STORY_MOCK]);
    addSessionBookmark(STORY_MOCK_2);
    const stored = JSON.parse(SESSION_STORE["story_spark_session_bookmarks"]);
    expect(stored).toHaveLength(2);
  });
});

describe("removeSessionBookmark", () => {
  it("removes a bookmark by uuid", () => {
    SESSION_STORE["story_spark_session_bookmarks"] = JSON.stringify([
      STORY_MOCK,
      STORY_MOCK_2,
    ]);
    removeSessionBookmark("story-123");
    const stored = JSON.parse(SESSION_STORE["story_spark_session_bookmarks"]);
    expect(stored).toHaveLength(1);
    expect(stored[0].uuid).toBe("story-456");
  });

  it("handles removal of non-existent uuid gracefully", () => {
    SESSION_STORE["story_spark_session_bookmarks"] = JSON.stringify([STORY_MOCK]);
    removeSessionBookmark("nonexistent-uuid");
    const stored = JSON.parse(SESSION_STORE["story_spark_session_bookmarks"]);
    expect(stored).toHaveLength(1);
  });
});

describe("clearSessionBookmarks", () => {
  it("clears all bookmarks", () => {
    SESSION_STORE["story_spark_session_bookmarks"] = JSON.stringify([
      STORY_MOCK,
      STORY_MOCK_2,
    ]);
    clearSessionBookmarks();
    expect(SESSION_REMOVE).toHaveBeenCalledWith("story_spark_session_bookmarks");
  });
});
