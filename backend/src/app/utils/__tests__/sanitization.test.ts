import {
  stripHtmlTags,
  truncate,
  normalizeWhitespace,
} from "../sanitization";

describe("stripHtmlTags", () => {
  it("removes complete HTML tags", () => {
    expect(stripHtmlTags("<p>Hello</p>")).toBe("Hello");
  });

  it("removes nested tags", () => {
    expect(stripHtmlTags("<div><span>text</span></div>")).toBe("text");
  });

  it("removes script tags", () => {
    expect(stripHtmlTags("<script>alert('xss')</script>")).toBe(
      "alert('xss')"
    );
  });

  it("removes incomplete tag openers", () => {
    expect(stripHtmlTags("Hello <script")).toBe("Hello");
  });

  it("returns empty string for null input", () => {
    expect(stripHtmlTags(null as any)).toBe("");
  });

  it("returns empty string for undefined input", () => {
    expect(stripHtmlTags(undefined as any)).toBe("");
  });

  it("returns empty string for empty string", () => {
    expect(stripHtmlTags("")).toBe("");
  });

  it("returns string unchanged when no tags present", () => {
    expect(stripHtmlTags("Hello World")).toBe("Hello World");
  });

  it("handles standalone < characters", () => {
    expect(stripHtmlTags("a < b")).toBe("a");
  });

  it("trims resulting whitespace", () => {
    expect(stripHtmlTags("  <p>text</p>  ")).toBe("text");
  });
});

describe("truncate", () => {
  it("truncates string longer than maxLength", () => {
    expect(truncate("Hello World", 5)).toBe("He...");
  });

  it("returns string unchanged when shorter than maxLength", () => {
    expect(truncate("Hi", 10)).toBe("Hi");
  });

  it("returns string unchanged when equal to maxLength", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });

  it("uses default '...' suffix", () => {
    expect(truncate("Hello World", 8)).toBe("Hello...");
  });

  it("uses custom suffix", () => {
    expect(truncate("Hello World", 8, "***")).toBe("Hello***");
  });

  it("returns input unchanged when input.length <= maxLength", () => {
    expect(truncate("Hi", 10, "...")).toBe("Hi");
  });

  it("returns empty string for null input", () => {
    expect(truncate(null as any, 10)).toBe("");
  });

  it("returns empty string for undefined input", () => {
    expect(truncate(undefined as any, 10)).toBe("");
  });

  it("returns empty string for empty string", () => {
    expect(truncate("", 10)).toBe("");
  });
});

describe("normalizeWhitespace", () => {
  it("collapses multiple spaces to single space", () => {
    expect(normalizeWhitespace("Hello    World")).toBe("Hello World");
  });

  it("collapses tabs and newlines", () => {
    expect(normalizeWhitespace("Hello\t\nWorld")).toBe("Hello World");
  });

  it("trims leading and trailing whitespace", () => {
    expect(normalizeWhitespace("  Hello World  ")).toBe("Hello World");
  });

  it("returns empty string for null input", () => {
    expect(normalizeWhitespace(null as any)).toBe("");
  });

  it("returns empty string for undefined input", () => {
    expect(normalizeWhitespace(undefined as any)).toBe("");
  });

  it("returns empty string for empty string", () => {
    expect(normalizeWhitespace("")).toBe("");
  });

  it("handles mixed whitespace", () => {
    expect(normalizeWhitespace("  Hello  \n\t  World  ")).toBe("Hello World");
  });
});
