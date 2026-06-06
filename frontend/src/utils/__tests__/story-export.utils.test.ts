import { createDocxBlob, downloadBlob, getSafeFileName } from "../story-export.utils";

describe("story-export.utils", () => {
  describe("getSafeFileName", () => {
    it("sanitizes title and appends extension", () => {
      expect(getSafeFileName("My Cool Story!", "md")).toBe("my_cool_story.md");
      expect(getSafeFileName("My Cool Story!", "docx")).toBe("my_cool_story.docx");
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
});
