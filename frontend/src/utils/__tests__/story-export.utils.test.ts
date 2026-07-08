/* eslint-disable */
import { describe, it, expect, vi } from "vitest";
import { createDocxBlob, downloadBlob, getSafeFileName, createWorkspaceDocxBlob, exportWorkspacePDF } from "../story-export.utils";
import jsPDF from "jspdf";

vi.mock("jspdf", () => {
  const mockJsPdfInstance = {
    setFont: vi.fn(),
    setFontSize: vi.fn(),
    setTextColor: vi.fn(),
    text: vi.fn(),
    setDrawColor: vi.fn(),
    setLineWidth: vi.fn(),
    line: vi.fn(),
    splitTextToSize: vi.fn().mockImplementation((text: string) => [text]),
    addPage: vi.fn(),
    getNumberOfPages: vi.fn().mockReturnValue(2),
    setPage: vi.fn(),
    save: vi.fn(),
  };
  return {
    default: vi.fn().mockImplementation(function() {
      return mockJsPdfInstance;
    }),
  };
});

describe("story-export.utils", () => {
  describe("getSafeFileName", () => {
    it("sanitizes title and appends extension", () => {
      expect(getSafeFileName("My Cool Story!", "md")).toBe("my_cool_story.md");
      expect(getSafeFileName("My Cool Story!", "docx")).toBe("my_cool_story.docx");
      expect(getSafeFileName("My Cool Story!", "pdf")).toBe("my_cool_story.pdf");
    });

    it("falls back to story when title is empty", () => {
      expect(getSafeFileName("   ", "md")).toBe("story.md");
    });
  });

  describe("downloadBlob", () => {
    it("creates a temporary anchor and revokes the object URL", () => {
      const createObjectURL = vi
        .spyOn(URL, "createObjectURL")
        .mockReturnValue("blob:mock");
      const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
      const click = vi.fn();
      const remove = vi.fn();
      const anchor = {
        href: "",
        download: "",
        click,
        remove,
      } as unknown as HTMLAnchorElement;

      vi.spyOn(document, "createElement").mockReturnValue(anchor);
      vi.spyOn(document.body, "appendChild").mockImplementation(() => anchor);

      downloadBlob(new Blob(["hello"]), "hello.md");

      expect(createObjectURL).toHaveBeenCalled();
      expect(anchor.download).toBe("hello.md");
      expect(click).toHaveBeenCalled();
      expect(remove).toHaveBeenCalled();
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock");

      createObjectURL.mockRestore();
      revokeObjectURL.mockRestore();
    });
  });

  describe("createDocxBlob", () => {
    it("returns a docx-compatible blob with escaped html content", async () => {
      const blob = createDocxBlob({
        title: "Test <Title>",
        content: "Line one\nLine two",
        tag: "Adventure",
        author: "Author",
      });

      expect(blob.type).toContain("wordprocessingml");
      const text = await blob.text();
      expect(text).toContain("&lt;Title&gt;");
      expect(text).toContain("<p>Line one</p>");
      expect(text).toContain("<p>Line two</p>");
    });
  });

  describe("createWorkspaceDocxBlob", () => {
    it("returns a docx-compatible blob containing multiple chapters", async () => {
      const blob = createWorkspaceDocxBlob({
        title: "Workspace <Story>",
        authorName: "John Doe",
        dateStr: "2026-06-06",
        chapters: [
          { title: "Chapter 1 <Intro>", content: "Paragraph one.\nParagraph two." },
          { title: "Chapter 2", content: "Paragraph three." },
        ],
      });

      expect(blob.type).toContain("wordprocessingml");
      const text = await blob.text();
      expect(text).toContain("&lt;Story&gt;");
      expect(text).toContain("Author: John Doe");
      expect(text).toContain("Date: 2026-06-06");
      expect(text).toContain("<h2>Chapter 1 &lt;Intro&gt;</h2>");
      expect(text).toContain("<p>Paragraph one.</p>");
      expect(text).toContain("<p>Paragraph two.</p>");
      expect(text).toContain("<h2>Chapter 2</h2>");
      expect(text).toContain("<p>Paragraph three.</p>");
    });
  });

  describe("exportWorkspacePDF", () => {
    it("initializes jsPDF and triggers document save", () => {
      const mockSave = vi.fn();
      const mockJsPdfInstance = {
        setFont: vi.fn(),
        setFontSize: vi.fn(),
        setTextColor: vi.fn(),
        text: vi.fn(),
        setDrawColor: vi.fn(),
        setLineWidth: vi.fn(),
        line: vi.fn(),
        splitTextToSize: vi.fn().mockImplementation((text: string) => [text]),
        addPage: vi.fn(),
        getNumberOfPages: vi.fn().mockReturnValue(2),
        setPage: vi.fn(),
        save: mockSave,
      };

      vi.mocked(jsPDF).mockImplementation(function() {
        return mockJsPdfInstance as any;
      });

      exportWorkspacePDF({
        title: "PDF Story",
        authorName: "John Doe",
        dateStr: "2026-06-06",
        chapters: [
          { title: "Chapter 1", content: "Some content here." },
        ],
      });

      expect(jsPDF).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalledWith("pdf_story.pdf");
    });
  });
});
