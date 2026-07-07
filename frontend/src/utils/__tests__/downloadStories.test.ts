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
      href: "",
      download: "",
      click: vi.fn(),
    };

    vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      if (tagName === "a") {
        return mockAnchor as any;
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
    };

    downloadTXT(story);

    expect(mockAnchor.download).toBe("Strange_File_Name_With_Chars_Input_Text.txt");
  });
});
