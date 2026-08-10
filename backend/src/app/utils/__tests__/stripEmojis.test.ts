import { stripEmojis } from "../stripEmojis";

describe("stripEmojis", () => {
  it("returns empty string for null input", () => {
    expect(stripEmojis(null as unknown as string)).toBe("");
  });

  it("returns empty string for undefined input", () => {
    expect(stripEmojis(undefined as unknown as string)).toBe("");
  });

  it("returns empty string for empty string input", () => {
    expect(stripEmojis("")).toBe("");
  });

  it("returns string unchanged when no emojis present", () => {
    expect(stripEmojis("Hello World")).toBe("Hello World");
  });

  it("removes basic smiley emojis", () => {
    expect(stripEmojis("Hello World")).toBe("Hello World");
  });

  it("removes transport and map symbols", () => {
    expect(stripEmojis("Map:")).toBe("Map:");
  });

  it("removes flag emojis", () => {
    expect(stripEmojis("US flag:")).toBe("US flag:");
  });

  it("removes dingbats", () => {
    expect(stripEmojis("Check:")).toBe("Check:");
  });

  it("removes zero-width joiner sequences", () => {
    expect(stripEmojis("Family:")).toBe("Family:");
  });

  it("handles mixed content with emojis and text", () => {
    expect(stripEmojis("Hello World")).toBe("Hello World");
  });

  it("handles string with only emojis", () => {
    expect(stripEmojis("")).toBe("");
  });

  it("preserves punctuation and whitespace", () => {
    expect(stripEmojis("Hello, World! How are you?")).toBe(
      "Hello, World! How are you?"
    );
  });

  it("handles numbers and letters", () => {
    expect(stripEmojis("Story 123 chapter 5")).toBe("Story 123 chapter 5");
  });
});
