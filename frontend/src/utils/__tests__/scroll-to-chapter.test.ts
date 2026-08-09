import { describe, it, expect, beforeEach, vi } from "vitest";
import { scrollToChapter } from "../scroll-to-chapter";

const mockScrollIntoView = vi.fn();
const mockGetElementById = vi.fn();

vi.stubGlobal("document", {
  getElementById: mockGetElementById,
});

beforeEach(() => {
  vi.clearAllMocks();
  mockGetElementById.mockReturnValue({
    scrollIntoView: mockScrollIntoView,
  });
});

describe("scrollToChapter", () => {
  it("calls scrollIntoView on the chapter element with correct id", () => {
    scrollToChapter(42);
    expect(mockGetElementById).toHaveBeenCalledWith("chapter-42");
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("does nothing when the chapter element is not found", () => {
    mockGetElementById.mockReturnValue(null);
    scrollToChapter(99);
    expect(mockGetElementById).toHaveBeenCalledWith("chapter-99");
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it("constructs correct element id for different chapter numbers", () => {
    scrollToChapter(1);
    expect(mockGetElementById).toHaveBeenCalledWith("chapter-1");

    mockGetElementById.mockClear();
    scrollToChapter(100);
    expect(mockGetElementById).toHaveBeenCalledWith("chapter-100");
  });
});
