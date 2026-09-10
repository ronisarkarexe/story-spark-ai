import { generateEpub, generateInteractiveHtml, StoryExportData } from "./story_exporter";
const sampleData: StoryExportData = {
  title: "The Test Story",
  author: "Test Author",
  genre: "fantasy",
  nodes: [
    { id: "1", parentId: null, choiceText: null, title: "The Beginning", content: "Once upon a time." },
    { id: "2", parentId: "1", choiceText: "Go left", title: "The Forest", content: "You wandered into the woods." },
    { id: "3", parentId: "1", choiceText: "Go right", title: "The River", content: "You found a river." },
  ],
};

describe("story_exporter", () => {
  describe("generateEpub", () => {
    it("produces a valid EPUB/ZIP container", async () => {
      const buffer = await generateEpub(sampleData);
      expect(Buffer.isBuffer(buffer)).toBe(true);
      // ZIP local file header signature — every valid EPUB is a ZIP container.
      expect(buffer.slice(0, 4).toString("hex")).toBe("504b0304");
      expect(buffer.length).toBeGreaterThan(0);
    });
  });

  describe("generateInteractiveHtml", () => {
    it("embeds all nodes and produces a self-contained HTML document", () => {
      const html = generateInteractiveHtml(sampleData);
      expect(html).toContain("<!doctype html>");
      expect(html).toContain("The Test Story");
      expect(html).toContain("Go left");
      expect(html).toContain("Go right");
      // No external script/link tags — must be fully self-contained.
      expect(html).not.toMatch(/<script[^>]+src=/i);
      expect(html).not.toMatch(/<link[^>]+href=/i);
    });
  });
});
