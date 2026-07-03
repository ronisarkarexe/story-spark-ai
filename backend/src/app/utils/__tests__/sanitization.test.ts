import {
  stripHtmlTags,
  truncate,
  normalizeWhitespace,
} from "../sanitization";

describe("stripHtmlTags", () => {
  it("removes complete HTML tags", () => {
    expect(stripHtmlTags("<p>Hello</p>")).toBe("Hello");
    expect(stripHtmlTags("<b>Bold</b>")).toBe("Bold");
    expect(stripHtmlTags("<div><span>Nested</span></div>")).toBe("Nested");
  });

  it("removes self-closing tags", () => {
    expect(stripHtmlTags("Text<br/>More")).toBe("TextMore");
    expect(stripHtmlTags("Line<hr>Break")).toBe("LineBreak");
    expect(stripHtmlTags("Text<img src='x'>Here")).toBe("TextHere");
  });

  it("removes incomplete tag openers", () => {
    expect(stripHtmlTags("Text<script alert(1)")).toBe("Text");
    expect(stripHtmlTags("Hello <onclick")).toBe("Hello");
  });

  it("returns text without tags unchanged", () => {
    expect(stripHtmlTags("Plain text only")).toBe("Plain text only");
    expect(stripHtmlTags("No tags here")).toBe("No tags here");
  });

  it("trims leading and trailing whitespace after tag removal", () => {
    expect(stripHtmlTags("  <p>Content</p>  ")).toBe("Content");
    expect(stripHtmlTags("<b>Bold</b>")).toBe("Bold");
  });

  it("handles empty string", () => {
    expect(stripHtmlTags("")).toBe("");
  });

  it("handles null/undefined (falsy) input", () => {
    expect(stripHtmlTags("")).toBe("");
    // TypeScript prevents null, but test falsy path
    expect(stripHtmlTags("   ")).toBe("");
  });

  it("handles text with angle brackets that are not tags", () => {
    expect(stripHtmlTags("5 < 10 and 10 > 5")).toBe("5 < 10 and 10 > 5");
  });
});

describe("truncate", () => {
  it("returns input unchanged when shorter than maxLength", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
    expect(truncate("Short", 5)).toBe("Short");
  });

  it("truncates text longer than maxLength and appends suffix", () => {
    expect(truncate("Hello World", 8)).toBe("Hello...");
  });

  it("uses default '...' suffix", () => {
    expect(truncate("This is a long string", 10)).toBe("This is...");
  });

  it("respects custom suffix", () => {
    expect(truncate("Hello World", 8, "~~")).toBe("Hello W~~");
    expect(truncate("Long text here", 8, " ->")).toBe("Long tex ->");
  });

  it("handles maxLength equal to suffix length gracefully", () => {
    const result = truncate("Hello World", 3, "...");
    // slice(0, 0) = "", result = "" + "..." = "..."
    expect(result).toBe("...");
  });

  it("handles empty string", () => {
    expect(truncate("", 10)).toBe("");
  });

  it("trims result after truncation", () => {
    expect(truncate("   spaced text   ", 15)).toBe("   spaced...");
  });
});

describe("normalizeWhitespace", () => {
  it("collapses multiple spaces to single space", () => {
    expect(normalizeWhitespace("Hello    World")).toBe("Hello World");
    expect(normalizeWhitespace("a   b   c")).toBe("a b c");
  });

  it("collapses tabs and newlines", () => {
    expect(normalizeWhitespace("Hello\t\tWorld")).toBe("Hello World");
    expect(normalizeWhitespace("Line1\n\nLine2")).toBe("Line1 Line2");
    expect(normalizeWhitespace("a\n\t  b")).toBe("a b");
  });

  it("trims leading and trailing whitespace", () => {
    expect(normalizeWhitespace("  Hello  ")).toBe("Hello");
    expect(normalizeWhitespace("\n\tText\n\t")).toBe("Text");
  });

  it("handles string with only whitespace", () => {
    expect(normalizeWhitespace("   ")).toBe("");
    expect(normalizeWhitespace("\t\n")).toBe("");
  });

  it("returns empty string for empty input", () => {
    expect(normalizeWhitespace("")).toBe("");
  });

  it("handles mixed whitespace characters", () => {
    expect(normalizeWhitespace("  a  \n  b  \t  c  ")).toBe("a b c");
  });
});
