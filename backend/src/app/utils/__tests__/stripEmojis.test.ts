import { stripEmojis } from "../stripEmojis";

describe("stripEmojis utility", () => {
  it("should return empty string for null, undefined or non-string inputs", () => {
    expect(stripEmojis(null as any)).toBe("");
    expect(stripEmojis(undefined as any)).toBe("");
    expect(stripEmojis(123 as any)).toBe("");
  });

  it("should return the original string if it contains no emojis", () => {
    expect(stripEmojis("hello world")).toBe("hello world");
    expect(stripEmojis("12345!@#$%")).toBe("12345!@#$%");
  });

  it("should strip simple smiley face emojis", () => {
    expect(stripEmojis("hello 😊 world")).toBe("hello  world");
    expect(stripEmojis("🚀 space adventure")).toBe("space adventure");
  });

  it("should strip complex zero-width joiner sequences", () => {
    // Family emoji: 👨‍👩‍👧‍👦
    expect(stripEmojis("family 👨‍👩‍👧‍👦 time")).toBe("family  time");
  });

  it("should strip country flag emojis", () => {
    // Flag: 🇮🇳
    expect(stripEmojis("India flag 🇮🇳")).toBe("India flag");
  });

  it("should return empty string if the input only contains emojis", () => {
    expect(stripEmojis("😊🚀🇮🇳")).toBe("");

describe("stripEmojis", () => {
  it("removes basic smiley emojis", () => {
    expect(stripEmojis("Hello 😀 World")).toBe("Hello  World");
  });

  it("removes transport and map symbols", () => {
    expect(stripEmojis("Travel ✈️ ✈")).toBe("Travel  ");
  });

  it("removes dingbats and arrows", () => {
    expect(stripEmojis("Arrow ➡️ Check")).toBe("Arrow  Check");
  });

  it("removes flags (regional indicator symbols)", () => {
    expect(stripEmojis("US 🇺🇸 UK 🇬🇧")).toBe("US  UK ");
  });

  it("removes zero-width joiner emoji sequences (skin tones)", () => {
    expect(stripEmojis("Wave 👋🏽")).toBe("Wave ");
  });

  it("removes family and people emojis with modifiers", () => {
    expect(stripEmojis("Family 👨‍👩‍👧")).toBe("Family ");
  });

  it("removes multi-emoji sequences", () => {
    expect(stripEmojis("🔥lit🔥")).toBe("lit");
  });

  it("removes control characters in the emoji range", () => {
    expect(stripEmojis("Text\u{1F600}Text")).toBe("TextText");
  });

  it("returns empty string for null input", () => {
    expect(stripEmojis(null as any)).toBe("");
  });

  it("returns empty string for undefined input", () => {
    expect(stripEmojis(undefined as any)).toBe("");
  });

  it("returns empty string for empty string input", () => {
    expect(stripEmojis("")).toBe("");
  });

  it("returns string unchanged when no emojis present", () => {
    expect(stripEmojis("Hello World")).toBe("Hello World");
  });

  it("preserves numbers, punctuation, and spaces", () => {
    expect(stripEmojis("123 !?@#$%^&*()")).toBe("123 !?@#$%^&*()");
  });

  it("handles unicode text outside emoji blocks", () => {
    expect(stripEmojis("Cafe with accent: cafe")).toBe("Cafe with accent: cafe");

  });
});
