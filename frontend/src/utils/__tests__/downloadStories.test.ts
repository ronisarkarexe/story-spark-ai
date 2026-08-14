import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { downloadTXT } from "../downloadStories";

describe("downloadStories", () => {
  let clickMock: ReturnType<typeof vi.fn>;
  let appendChildMock: ReturnType<typeof vi.fn>;
  let removeChildMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    clickMock = vi.fn();
    appendChildMock = vi.fn();
    removeChildMock = vi.fn();
    vi.stubGlobal("document", {
      createElement: vi.fn().mockReturnValue({
        click: clickMock,
        download: "",
        href: "",
      }),
      body: {
        appendChild: appendChildMock,
        removeChild: removeChildMock,
      },
    });
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn().mockReturnValue("blob:http://localhost/mock-url"),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return early when window is undefined (SSR safety)", () => {
    vi.stubGlobal("window", undefined as any);
    expect(() => downloadTXT({ title: "Test", content: "Story", prompt: "Prompt" })).not.toThrow();
    vi.stubGlobal("window", { document, URL });
  });

  it("should create and trigger a download link", () => {
    const story = { title: "Test Story", content: "Story content", prompt: "A story" };
    expect(() => downloadTXT(story)).not.toThrow();
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(appendChildMock).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(removeChildMock).toHaveBeenCalled();

    // Revocation is deferred so the browser has time to start the download.
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it("should replace invalid filename characters with underscore", () => {
    downloadTXT({ title: "My Story/Version 1", content: "Content", prompt: "Prompt" });
    const mockLink = (document.createElement as ReturnType<typeof vi.fn>).mock.results[0].value;
    expect(mockLink.download).toBe("My_Story_Version_1.txt");
  });

  it("should not trigger any network calls or DOM operations when window is absent", () => {
    vi.stubGlobal("window", undefined as any);
    downloadTXT({ title: "Any Title", content: "Content", prompt: "Prompt" });
    expect(document.createElement).not.toHaveBeenCalled();
  });
});
