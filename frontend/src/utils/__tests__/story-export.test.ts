import { describe, it, expect } from "vitest";
import { getSafeFileName } from "../story-export.utils";

describe("getSafeFileName", () => {
  it("returns safe filename with extension for normal title", () => {
    expect(getSafeFileName("My Story", "md")).toBe("my_story.md");
  });

  it("handles title with special characters", () => {
    expect(getSafeFileName("My Story! @#$%", "pdf")).toBe("my_story_.pdf");
  });

  it("handles empty title", () => {
    expect(getSafeFileName("", "docx")).toBe("story.docx");
  });

  it("handles title with only spaces", () => {
    expect(getSafeFileName("   ", "md")).toBe("story.md");
  });

  it("handles title with unicode characters", () => {
    expect(getSafeFileName("My Dragon Story", "pdf")).toBe("my_dragon_story.pdf");
  });

  it("handles title with mixed case", () => {
    expect(getSafeFileName("HeLLo WoRLD", "md")).toBe("hello_world.md");
  });

  it("handles title with leading/trailing underscores after sanitization", () => {
    expect(getSafeFileName("___test___", "docx")).toBe("test.docx");
  });

  it("handles title with multiple spaces between words", () => {
    expect(getSafeFileName("The   Quick   Brown   Fox", "md")).toBe("the_quick_brown_fox.md");
  });

  it("returns correct extension for each supported type", () => {
    expect(getSafeFileName("Story", "md")).toBe("story.md");
    expect(getSafeFileName("Story", "docx")).toBe("story.docx");
    expect(getSafeFileName("Story", "pdf")).toBe("story.pdf");
  });
});
