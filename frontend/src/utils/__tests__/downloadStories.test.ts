import { describe, it, expect, vi, beforeEach } from "vitest";
import { downloadTXT } from "../downloadStories";

describe("downloadStories", () => {
  let clickMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    clickMock = vi.fn();
    vi.stubGlobal("document", {
      createElement: vi.fn().mockReturnValue({
        click: clickMock,
        download: "",
        href: "",
      }),
    });
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn().mockReturnValue("blob:http://localhost/mock-url"),
      revokeObjectURL: vi.fn(),
    });
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
    expect(clickMock).toHaveBeenCalled();
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
