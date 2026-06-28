import { getSessionBookmarks, addSessionBookmark, removeSessionBookmark, isSessionBookmarked } from "../session-bookmarks";
import type { IStories } from "../../components/stories/stories.view.component";

const SESSION_KEY = "story_spark_session_bookmarks";

const mockStory: IStories = {
  uuid: "test-uuid-1",
  title: "Test Story",
  content: "Test content",
  tag: "Adventure",
  imageURL: "https://example.com/image.jpg",
};

const mockStory2: IStories = {
  uuid: "test-uuid-2",
  title: "Test Story 2",
  content: "Test content 2",
  tag: "Sci-Fi",
  imageURL: "https://example.com/image2.jpg",
};

describe("session-bookmarks", () => {
  const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(global, "sessionStorage", {
      value: sessionStorageMock,
      writable: true,
    });
    Object.defineProperty(global, "window", {
      value: {
        dispatchEvent: vi.fn(),
      },
      writable: true,
    });
  });

  describe("getSessionBookmarks", () => {
    it("returns empty array when no data in sessionStorage", () => {
      sessionStorageMock.getItem.mockReturnValue(null);

      const result = getSessionBookmarks();

      expect(result).toEqual([]);
      expect(sessionStorageMock.getItem).toHaveBeenCalledWith(SESSION_KEY);
    });

    it("parses stored JSON correctly", () => {
      const storedData = JSON.stringify([mockStory, mockStory2]);
      sessionStorageMock.getItem.mockReturnValue(storedData);

      const result = getSessionBookmarks();

      expect(result).toEqual([mockStory, mockStory2]);
      expect(sessionStorageMock.getItem).toHaveBeenCalledWith(SESSION_KEY);
    });

    it("handles JSON parse errors gracefully and returns empty array", () => {
      sessionStorageMock.getItem.mockReturnValue("invalid-json{");

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const result = getSessionBookmarks();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith("Failed to read session bookmarks", expect.any(Error));
      consoleSpy.mockRestore();
    });

    it("returns empty array when sessionStorage returns empty string", () => {
      sessionStorageMock.getItem.mockReturnValue("");

      const result = getSessionBookmarks();

      expect(result).toEqual([]);
    });
  });

  describe("addSessionBookmark", () => {
    it("adds new bookmark to empty sessionStorage", () => {
      sessionStorageMock.getItem.mockReturnValue(null);
      sessionStorageMock.setItem.mockImplementation(() => {});

      addSessionBookmark(mockStory);

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(SESSION_KEY, JSON.stringify([mockStory]));
      expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(Event));
    });

    it("adds new bookmark to existing bookmarks", () => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify([mockStory2]));
      sessionStorageMock.setItem.mockImplementation(() => {});

      addSessionBookmark(mockStory);

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(SESSION_KEY, JSON.stringify([mockStory2, mockStory]));
      expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(Event));
    });

    it("prevents duplicates when same uuid already exists", () => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify([mockStory]));
      sessionStorageMock.setItem.mockImplementation(() => {});

      addSessionBookmark(mockStory);

      expect(sessionStorageMock.setItem).not.toHaveBeenCalled();
      expect(window.dispatchEvent).not.toHaveBeenCalled();
    });

    it("handles errors gracefully", () => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify([mockStory]));
      sessionStorageMock.setItem.mockImplementation(() => {
        throw new Error("Storage error");
      });

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      addSessionBookmark(mockStory2);

      expect(consoleSpy).toHaveBeenCalledWith("Failed to add session bookmark", expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe("removeSessionBookmark", () => {
    it("removes bookmark by uuid", () => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify([mockStory, mockStory2]));
      sessionStorageMock.setItem.mockImplementation(() => {});

      removeSessionBookmark("test-uuid-1");

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(SESSION_KEY, JSON.stringify([mockStory2]));
      expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(Event));
    });

    it("handles non-existent uuid gracefully (no error, dispatches event)", () => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify([mockStory]));
      sessionStorageMock.setItem.mockImplementation(() => {});

      removeSessionBookmark("non-existent-uuid");

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(SESSION_KEY, JSON.stringify([mockStory]));
      expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(Event));
    });

    it("removes the only bookmark leaving empty array", () => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify([mockStory]));
      sessionStorageMock.setItem.mockImplementation(() => {});

      removeSessionBookmark("test-uuid-1");

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(SESSION_KEY, JSON.stringify([]));
      expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(Event));
    });

    it("handles errors gracefully", () => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify([mockStory]));
      sessionStorageMock.setItem.mockImplementation(() => {
        throw new Error("Storage error");
      });

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      removeSessionBookmark("test-uuid-1");

      expect(consoleSpy).toHaveBeenCalledWith("Failed to remove session bookmark", expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe("isSessionBookmarked", () => {
    it("returns true for bookmarked uuid", () => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify([mockStory, mockStory2]));

      const result = isSessionBookmarked("test-uuid-1");

      expect(result).toBe(true);
    });

    it("returns false for non-bookmarked uuid", () => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify([mockStory]));

      const result = isSessionBookmarked("non-existent-uuid");

      expect(result).toBe(false);
    });

    it("returns false when no bookmarks stored", () => {
      sessionStorageMock.getItem.mockReturnValue(null);

      const result = isSessionBookmarked("test-uuid-1");

      expect(result).toBe(false);
    });

    it("returns false when sessionStorage returns empty array", () => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify([]));

      const result = isSessionBookmarked("test-uuid-1");

      expect(result).toBe(false);
    });
  });
});