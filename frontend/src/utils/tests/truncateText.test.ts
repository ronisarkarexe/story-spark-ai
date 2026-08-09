import { describe, it, expect } from "vitest";
import { truncateText } from "../truncateText";

describe("truncateText", () => {
  it("returns empty string for null or undefined input", () => {
    expect(truncateText(null as unknown as string, 10)).toBe("");
    expect(truncateText(undefined as unknown as string, 10)).toBe("");
  });

  it("returns empty string for non-string input", () => {
    expect(truncateText(123 as unknown as string, 10)).toBe("");
    expect(truncateText({} as unknown as string, 10)).toBe("");
  });

  it("returns text unchanged when length is within maxLength", () => {
    expect(truncateText("hello world", 50)).toBe("hello world");
    expect(truncateText("short", 10)).toBe("short");
  });

  it("truncates to maxLength with default ellipsis suffix", () => {
    const result = truncateText("this is a very long sentence", 12);
    expect(result).toBe("this is a...");
  });

  it("breaks at word boundary when possible", () => {
    const result = truncateText("hello world", 8);
    expect(result).toBe("hello...");
  });

  it("falls back to hard truncation when no space found", () => {
    // Single long word longer than maxLength minus suffix
    const result = truncateText("superlongword", 8);
    expect(result).toBe("superlo...");
  });

  it("handles exact maxLength match without suffix", () => {
    const result = truncateText("hello", 5);
    expect(result).toBe("hello");
  });

  it("uses custom suffix when provided", () => {
    const result = truncateText("hello world", 8, "...");
    expect(result).toBe("hello...");
  });

  it("uses ellipsis continuation when suffix is longer", () => {
    const result = truncateText("hello world", 3, "...");
    expect(result).toBe("hel");
  });

  it("returns empty string when maxLength is 0", () => {
    expect(truncateText("hello world", 0)).toBe("");
  });

  it("handles whitespace-only strings", () => {
    expect(truncateText("     ", 10)).toBe("     ");
  });

  it("handles single character truncation", () => {
    const result = truncateText("hello world", 6);
    expect(result).toBe("hello...");
  });

  it("handles maxLength equal to suffix length", () => {
    const result = truncateText("hello world", 3, "...");
    expect(result).toBe("hel");
  });

  it("correctly truncates at sentence boundary", () => {
    const result = truncateText("The quick brown fox jumps", 15);
    expect(result).toBe("The quick...");
  });
});
