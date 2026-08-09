import { slugify } from "../slugify";

describe("slugify", () => {
  it("converts a simple string to lowercase with spaces replaced by hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces multiple spaces with single hyphens", () => {
    expect(slugify("Hello   World")).toBe("hello-world");
  });

  it("removes non-alphanumeric characters except hyphens", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("collapses multiple consecutive hyphens into one", () => {
    expect(slugify("Hello---World")).toBe("hello-world");
  });

  it("trims leading hyphens", () => {
    expect(slugify("  Hello World")).toBe("hello-world");
  });

  it("trims trailing hyphens", () => {
    expect(slugify("Hello World  ")).toBe("hello-world");
  });

  it("handles unicode characters by removing them", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("returns empty string for null input", () => {
    expect(slugify(null as any)).toBe("");
  });

  it("returns empty string for undefined input", () => {
    expect(slugify(undefined as any)).toBe("");
  });

  it("returns empty string for empty string input", () => {
    expect(slugify("")).toBe("");
  });

  it("handles strings that are already valid slugs", () => {
    expect(slugify("hello-world-123")).toBe("hello-world-123");
  });

  it("handles mixed case input", () => {
    expect(slugify("HeLLo WOrLD")).toBe("hello-world");
  });

  it("handles strings with only special characters", () => {
    expect(slugify("!@#$%^&*()")).toBe("");
  });

  it("preserves numbers in the slug", () => {
    expect(slugify("Story 123: The Beginning")).toBe("story-123-the-beginning");
  });
});

  test("converts uppercase letters to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  test("replaces spaces with hyphens", () => {
    expect(slugify("My Story Spark")).toBe("my-story-spark");
  });

  test("collapses multiple spaces into a single hyphen", () => {
    expect(slugify("Hello     World")).toBe("hello-world");
  });

  test("trims leading and trailing whitespace", () => {
    expect(slugify("   Hello World   ")).toBe("hello-world");
  });

  test("removes special characters", () => {
    expect(slugify("Hello@World!")).toBe("helloworld");
  });

  test("collapses multiple hyphens", () => {
    expect(slugify("hello---world")).toBe("hello-world");
  });

  test("removes leading and trailing hyphens", () => {
    expect(slugify("---hello-world---")).toBe("hello-world");
  });

  test("returns an empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  test("handles strings containing only spaces", () => {
    expect(slugify("     ")).toBe("");
  });

  test("handles unicode characters by removing unsupported characters", () => {
    expect(slugify("Héllo Wörld")).toBe("hllo-wrld");
  });

  test("handles numbers correctly", () => {
    expect(slugify("Story 2026 Version 2")).toBe("story-2026-version-2");
  });

  test("removes mixed special characters", () => {
    expect(slugify("Story*&^%$#@! Spark")).toBe("story-spark");
  });
});

  it("converts spaces to hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("converts multiple spaces to single hyphens", () => {
    expect(slugify("Hello   World")).toBe("hello-world");
  });

  it("converts tabs and newlines to hyphens", () => {
    expect(slugify("Hello\tWorld")).toBe("hello-world");
    expect(slugify("Hello\nWorld")).toBe("hello-world");
  });

  it("strips non-alphanumeric characters", () => {
    expect(slugify("Hello@World!")).toBe("helloworld");
    expect(slugify("What's Up?")).toBe("whats-up");
    expect(slugify("Hello#World$Test")).toBe("helloworldtest");
  });

  it("preserves hyphens in the input", () => {
    expect(slugify("hello-world-story")).toBe("hello-world-story");
  });

  it("collapses multiple consecutive hyphens into one", () => {
    expect(slugify("hello---world")).toBe("hello-world");
    expect(slugify("a--b--c")).toBe("a-b-c");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  hello world  ")).toBe("hello-world");
    expect(slugify("--hello--")).toBe("hello");
  });

  it("preserves numbers", () => {
    expect(slugify("Story 123")).toBe("story-123");
    expect(slugify("Chapter 1: The Beginning")).toBe("chapter-1-the-beginning");
  });

  it("lower-cases the result", () => {
    expect(slugify("HELLO WORLD")).toBe("hello-world");
    expect(slugify("HeLLo WoRLd")).toBe("hello-world");
  });

  it("handles single character input", () => {
    expect(slugify("A")).toBe("a");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("handles whitespace-only string", () => {
    expect(slugify("   ")).toBe("");
    expect(slugify("\t\n")).toBe("");
  });

  it("handles null input", () => {
    expect(slugify(null as unknown as string)).toBe("");
  });

  it("handles undefined input", () => {
    expect(slugify(undefined as unknown as string)).toBe("");
  });

  it("handles strings with only special characters", () => {
    expect(slugify("@#$%")).toBe("");
    expect(slugify("---")).toBe("");
  });

  it("produces consistent output for mixed input", () => {
    expect(slugify("The Quick-Brown Fox!")).toBe("the-quick-brown-fox");
    expect(slugify("  Hello   World@2024! ")).toBe("hello-world2024");
  });
});

