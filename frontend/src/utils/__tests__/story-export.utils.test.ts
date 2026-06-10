/* eslint-disable */
import { createDocxBlob, downloadBlob, getSafeFileName, createWorkspaceDocxBlob, exportWorkspacePDF } from "../story-export.utils";
import jsPDF from "jspdf";

jest.mock("jspdf", () => {
  const mockJsPdfInstance = {
    setFont: jest.fn(),
    setFontSize: jest.fn(),
    setTextColor: jest.fn(),
    text: jest.fn(),
    setDrawColor: jest.fn(),
    setLineWidth: jest.fn(),
    line: jest.fn(),
    splitTextToSize: jest.fn().mockImplementation((text: string) => [text]),
    addPage: jest.fn(),
    getNumberOfPages: jest.fn().mockReturnValue(2),
    setPage: jest.fn(),
    save: jest.fn(),
  };
  return {
    default: jest.fn().mockImplementation(() => mockJsPdfInstance),
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
      const createObjectURL = jest
        .spyOn(URL, "createObjectURL")
        .mockReturnValue("blob:mock");
      const revokeObjectURL = jest.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
      const click = jest.fn();
      const remove = jest.fn();
      const anchor = {
        href: "",
        download: "",
        click,
        remove,
      } as unknown as HTMLAnchorElement;

      jest.spyOn(document, "createElement").mockReturnValue(anchor);
      jest.spyOn(document.body, "appendChild").mockImplementation(() => anchor);

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
      const mockSave = jest.fn();
      const mockJsPdfInstance = {
        setFont: jest.fn(),
        setFontSize: jest.fn(),
        setTextColor: jest.fn(),
        text: jest.fn(),
        setDrawColor: jest.fn(),
        setLineWidth: jest.fn(),
        line: jest.fn(),
        splitTextToSize: jest.fn().mockImplementation((text: string) => [text]),
        addPage: jest.fn(),
        getNumberOfPages: jest.fn().mockReturnValue(2),
        setPage: jest.fn(),
        save: mockSave,
      };

      jest.mocked(jsPDF).mockImplementation(() => mockJsPdfInstance as any);

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

