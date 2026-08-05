
/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { downloadTXT } from "../downloadStories";

interface MockAnchorElement {
  href: string;
  download: string;
  click: ReturnType<typeof vi.fn>;
  style: { display: string };
  setAttribute: ReturnType<typeof vi.fn>;
  appendChild: ReturnType<typeof vi.fn>;
  removeChild: ReturnType<typeof vi.fn>;
}

interface Story {
  title: string;
  prompt: string;
  content: string;
  generatedAt: Date;
}

const mockCreateObjectURL = vi.fn(() => "blob:mock-url-123");
const mockRevokeObjectURL = vi.fn();
const mockClick = vi.fn();
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

beforeEach(() => {
  vi.clearAllMocks();
  URL.createObjectURL = mockCreateObjectURL;
  URL.revokeObjectURL = mockRevokeObjectURL;

  mockCreateObjectURL.mockReturnValue("blob:mock-url-123");

  vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
    if (tag === "a") {
      return {
        href: "",
        download: "",
        click: mockClick,
        style: { display: "" },
        setAttribute: vi.fn(),
        appendChild: mockAppendChild,
        removeChild: mockRemoveChild,
      } as unknown as MockAnchorElement;
    }
    return originalCreateObjectURL as unknown as Element;
  });

  vi.spyOn(document.body, "appendChild").mockImplementation(mockAppendChild);
  vi.spyOn(document.body, "removeChild").mockImplementation(mockRemoveChild);
});

afterEach(() => {
  URL.createObjectURL = originalCreateObjectURL;
  URL.revokeObjectURL = originalRevokeObjectURL;
});

describe("downloadTXT", () => {
  it("creates a blob with text/plain mime type", () => {
    const story: Story = {
      title: "My Story",
      prompt: "Once upon a time",
      content: "There was a hero.",
      generatedAt: new Date("2024-01-01"),
    };

    let capturedBlob: Blob | null = null;
    mockCreateObjectURL.mockImplementation((blob: Blob) => {
      capturedBlob = blob;
      return "blob:mock-url-123";
    });

    downloadTXT(story);

    expect(capturedBlob).not.toBeNull();
    expect(capturedBlob!.type).toBe("text/plain");
  });

  it("creates object URL from the blob", () => {
    const story: Story = {
      title: "Test Title",
      prompt: "A prompt",
      content: "Story content",
      generatedAt: new Date(),
    };

    downloadTXT(story);

    expect(mockCreateObjectURL).toHaveBeenCalledOnce();
    const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob;
    expect(blobArg).toBeInstanceOf(Blob);
  });

  it("creates and clicks a download link", () => {
    const story: Story = {
      title: "Download Test",
      prompt: "Test prompt",
      content: "Test content",
      generatedAt: new Date(),
    };

    downloadTXT(story);

    expect(mockClick).toHaveBeenCalledOnce();
  });

  it("revokes the object URL after click", () => {
    const story: Story = {
      title: "Cleanup Test",
      prompt: "Prompt",
      content: "Content",
      generatedAt: new Date(),

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

    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url-123");
  });

  it("formats story fields into the blob content", async () => {
    const story: Story = {
      title: "My Title",
      prompt: "A dragon story",
      content: "The dragon flew away.",
      generatedAt: new Date("2024-06-15"),
    };

    let capturedContent = "";
    mockCreateObjectURL.mockImplementation((blob: Blob) => {
      blob.text().then((text) => {
        capturedContent = text;
      });
      return "blob:mock-url-123";
    });

    downloadTXT(story);

    // Give the async blob.text() a moment to resolve
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(capturedContent).toContain("Title: My Title");
    expect(capturedContent).toContain("Prompt: A dragon story");
    expect(capturedContent).toContain("Story: The dragon flew away.");
  });

  it("handles a title with special characters without throwing", () => {
    const story: Story = {
      title: "Test: Story/With*Invalid?Chars",
      prompt: "prompt",
      content: "content",
      generatedAt: new Date(),
    };

    expect(() => downloadTXT(story)).not.toThrow();
  });

  it("uses toLocaleString for the generated date", async () => {
    const story: Story = {
      title: "Date Test",
      prompt: "p",
      content: "c",
      generatedAt: new Date(),
    };

    let capturedContent = "";
    mockCreateObjectURL.mockImplementation((blob: Blob) => {
      blob.text().then((text) => {
        capturedContent = text;
      });
      return "blob:mock-url-123";
    });

    downloadTXT(story);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(capturedContent).toContain("Generated:");
    expect(capturedContent).toMatch(/Generated: .+/);


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
