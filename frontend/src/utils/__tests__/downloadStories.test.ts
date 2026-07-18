
import { downloadTXT } from "../downloadStories";

describe("downloadStories utility", () => {
  let originalCreateObjectURL: any;
  let originalRevokeObjectURL: any;
  let createdUrl: string | null = null;
  let revokedUrl: string | null = null;
  let mockAnchor: any;

  beforeEach(() => {
    // Save original URL methods
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;

    // Mock URL methods
    createdUrl = null;
    revokedUrl = null;
    URL.createObjectURL = vi.fn().mockImplementation((blob: Blob) => {
      createdUrl = "blob:mock-url";
      return createdUrl;
    });
    URL.revokeObjectURL = vi.fn().mockImplementation((url: string) => {
      revokedUrl = url;
    });

    // Mock anchor element
    mockAnchor = {

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { downloadTXT } from "../downloadStories";

describe("downloadStories utility", () => {
  let mockCreateObjectURL: any;
  let mockRevokeObjectURL: any;
  let mockAnchorElement: any;

  beforeEach(() => {
    mockCreateObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    mockRevokeObjectURL = vi.fn();
    
    vi.stubGlobal("URL", {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    });

    mockAnchorElement = {

      href: "",
      download: "",
      click: vi.fn(),
    };

    vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      if (tagName === "a") {


        return mockAnchorElement as any;

      }
      return document.createElement(tagName);
    });
  });

  afterEach(() => {

    // Restore mocks
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    vi.restoreAllMocks();
  });

  it("should generate correct file content format and trigger download", () => {
    const story = {
      title: "Space Adventure",
      prompt: "Write about stars",
      content: "Once upon a time in space...",

    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("should create a text blob and trigger a click on a temporary anchor element", () => {
    const story = {
      title: "My Story",
      prompt: "Once upon a time",
      content: "Deep in the forest...",

    };

    downloadTXT(story);


    // Verify createElement was called with 'a'
    expect(document.createElement).toHaveBeenCalledWith("a");

    // Verify blob URL creation
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(mockAnchor.href).toBe("blob:mock-url");

    // Verify download filename sanitization (spaces replaced with underscore)
    expect(mockAnchor.download).toBe("Space_Adventure.txt");

    // Verify click and revoke
    expect(mockAnchor.click).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("should sanitize invalid characters in filenames with underscores", () => {
    const story = {
      title: "Strange/File:Name*With?Chars<Input>|Text",
      prompt: "Write about punctuation",
      content: "Content with strange title.",

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(mockAnchorElement.href).toBe("blob:mock-url");
    expect(mockAnchorElement.download).toBe("My_Story.txt");
    expect(mockAnchorElement.click).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("should sanitize the filename by replacing special characters and whitespace with underscores", () => {
    const story = {
      title: "Story/Title: *With? <Special> | Chars",
      prompt: "Once upon a time",
      content: "Deep in the forest...",

    };

    downloadTXT(story);


    expect(mockAnchorElement.download).toBe("Story_Title_With_Special_Chars.txt");

  });
});
