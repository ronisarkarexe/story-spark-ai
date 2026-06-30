/**
 * @jest-environment jsdom
 */
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import {
  getSessionBookmarks,
  addSessionBookmark,
  removeSessionBookmark,
  isSessionBookmarked,
} from "../session-bookmarks";

const SESSION_KEY = "story_spark_session_bookmarks";

const STORY_UUID = "test-uuid-123";
const STORY = {
  uuid: STORY_UUID,
  title: "Test Story",
  author: "Test Author",
};

const SESSION_STORAGE_MOCK = {
  store: {} as Record<string, string>,
  setItem: vi.fn((key: string, value: string) => {
    SESSION_STORAGE_MOCK.store[key] = value;
  }),
  getItem: vi.fn((key: string) => SESSION_STORAGE_MOCK.store[key] ?? null),
  removeItem: vi.fn((key: string) => {
    delete SESSION_STORAGE_MOCK.store[key];
  }),
};

const dispatchEventSpy = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  SESSION_STORAGE_MOCK.store = {};
  Object.defineProperty(globalThis, "sessionStorage", {
    value: SESSION_STORAGE_MOCK,
    writable: true,
  });
  Object.defineProperty(globalThis, "dispatchEvent", {
    value: dispatchEventSpy,
    writable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getSessionBookmarks", () => {
  it("returns empty array when sessionStorage is empty", () => {
    const result = getSessionBookmarks();
    expect(result).toEqual([]);
    expect(SESSION_STORAGE_MOCK.getItem).toHaveBeenCalledWith(SESSION_KEY);
  });

  it("returns parsed array when data exists in sessionStorage", () => {
    SESSION_STORAGE_MOCK.store[SESSION_KEY] = JSON.stringify([STORY]);
    const result = getSessionBookmarks();
    expect(result).toEqual([STORY]);
  });

  it("returns empty array when sessionStorage has invalid JSON", () => {
    SESSION_STORAGE_MOCK.store[SESSION_KEY] = "not valid json";
    const result = getSessionBookmarks();
    expect(result).toEqual([]);
  });
});

describe("addSessionBookmark", () => {
  it("adds a new story bookmark", () => {
    addSessionBookmark(STORY);
    expect(SESSION_STORAGE_MOCK.setItem).toHaveBeenCalledWith(
      SESSION_KEY,
      JSON.stringify([STORY])
    );
  });

  it("does not add duplicate bookmark (same uuid)", () => {
    SESSION_STORAGE_MOCK.store[SESSION_KEY] = JSON.stringify([STORY]);
    SESSION_STORAGE_MOCK.setItem.mockClear();
    addSessionBookmark(STORY);
    expect(SESSION_STORAGE_MOCK.setItem).not.toHaveBeenCalled();
  });

  it("dispatches session_bookmarks_changed event", () => {
    addSessionBookmark(STORY);
    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
    const event = dispatchEventSpy.mock.calls[0][0] as Event;
    expect(event.type).toBe("session_bookmarks_changed");
  });

  it("does not dispatch event for duplicate bookmark", () => {
    SESSION_STORAGE_MOCK.store[SESSION_KEY] = JSON.stringify([STORY]);
    dispatchEventSpy.mockClear();
    addSessionBookmark(STORY);
    expect(dispatchEventSpy).not.toHaveBeenCalled();
  });
});

describe("removeSessionBookmark", () => {
  it("removes a story by uuid", () => {
    SESSION_STORAGE_MOCK.store[SESSION_KEY] = JSON.stringify([STORY]);
    removeSessionBookmark(STORY_UUID);
    expect(SESSION_STORAGE_MOCK.setItem).toHaveBeenCalledWith(
      SESSION_KEY,
      JSON.stringify([])
    );
  });

  it("dispatches session_bookmarks_changed event after removal", () => {
    SESSION_STORAGE_MOCK.store[SESSION_KEY] = JSON.stringify([STORY]);
    dispatchEventSpy.mockClear();
    removeSessionBookmark(STORY_UUID);
    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
  });

  it("removes nothing when uuid does not exist (storage unchanged, event still fires)", () => {
    SESSION_STORAGE_MOCK.store[SESSION_KEY] = JSON.stringify([STORY]);
    const original = SESSION_STORAGE_MOCK.store[SESSION_KEY];
    dispatchEventSpy.mockClear();
    removeSessionBookmark("non-existent-uuid");
    // setItem is called (with unchanged array); storage content is unchanged
    expect(SESSION_STORAGE_MOCK.store[SESSION_KEY]).toBe(original);
    // Note: the implementation fires the event even when nothing is removed
    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
  });
});

describe("isSessionBookmarked", () => {
  it("returns true for bookmarked uuid", () => {
    SESSION_STORAGE_MOCK.store[SESSION_KEY] = JSON.stringify([STORY]);
    const result = isSessionBookmarked(STORY_UUID);
    expect(result).toBe(true);
  });

  it("returns false for non-bookmarked uuid", () => {
    SESSION_STORAGE_MOCK.store[SESSION_KEY] = JSON.stringify([STORY]);
    const result = isSessionBookmarked("other-uuid");
    expect(result).toBe(false);
  });

  it("returns false when sessionStorage is empty", () => {
    const result = isSessionBookmarked(STORY_UUID);
    expect(result).toBe(false);
  });
});
