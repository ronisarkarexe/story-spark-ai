import { escapeRegex } from "../utils/regex.util";

describe("escapeRegex", () => {
  it("returns empty string for empty input", () => {
    expect(escapeRegex("")).toBe("");
  });

  it("passes plain strings through unchanged", () => {
    expect(escapeRegex("hello world")).toBe("hello world");
    expect(escapeRegex("story spark")).toBe("story spark");
  });

  it("escapes opening square bracket", () => {
    expect(escapeRegex("text[more")).toBe("text\\[more");
  });

  it("escapes closing square bracket", () => {
    expect(escapeRegex("text]more")).toBe("text\\]more");
  });

  it("escapes curly braces", () => {
    expect(escapeRegex("{start}")).toBe("\\{start\\}");
  });

  it("escapes parentheses", () => {
    expect(escapeRegex("(group)")).toBe("\\(group\\)");
  });

  it("escapes dot", () => {
    expect(escapeRegex("file.txt")).toBe("file\\.txt");
  });

  it("escapes asterisk", () => {
    expect(escapeRegex("a*b")).toBe("a\\*b");
  });

  it("escapes plus sign", () => {
    expect(escapeRegex("a+b")).toBe("a\\+b");
  });

  it("escapes question mark", () => {
    expect(escapeRegex("colou?r")).toBe("colou\\?r");
  });

  it("escapes caret", () => {
    expect(escapeRegex("^start")).toBe("\\^start");
  });

  it("escapes dollar sign", () => {
    expect(escapeRegex("end$")).toBe("end\\$");
  });

  it("escapes backslash", () => {
    expect(escapeRegex("path\\to")).toBe("path\\\\to");
  });

  it("escapes pipe", () => {
    expect(escapeRegex("a|b")).toBe("a\\|b");
  });

  it("escapes hash", () => {
    expect(escapeRegex("tag#1")).toBe("tag\\#1");
  });

  it("escapes hyphen (when not in character class range)", () => {
    expect(escapeRegex("a-b")).toBe("a\\-b");
  });

  it("escapes all metacharacters in a combined string", () => {
    const result = escapeRegex("[a-z]{1,3}(foo|bar)+?bar$");
    expect(result).toBe(
      "\\[a\\-z\\]\\{1\\,3\\}\\(foo\\|bar\\)\\+\\?bar\\$"
    );
  });

  it("output can be safely used as pattern in RegExp constructor", () => {
    const userInput = "users[id]: (test|example)*";
    const escaped = escapeRegex(userInput);
    expect(() => new RegExp(escaped)).not.toThrow();
  });

  it("preserves whitespace and alphanumeric characters unchanged", () => {
    expect(escapeRegex("plain text 123")).toBe("plain text 123");
    expect(escapeRegex("hello world 2024")).toBe("hello world 2024");
    expect(escapeRegex("  leading and trailing  ")).toBe("  leading and trailing  ");
  });

  it("is idempotent — already-escaped strings remain unchanged on second call", () => {
    const first = escapeRegex("user.name[0]");
    const second = escapeRegex(first);
    expect(second).toBe(first);
  });

  it("handles MongoDB query-like field paths containing dots", () => {
    const input = "user.email";
    const escaped = escapeRegex(input);
    expect(escaped).toBe("user\\.email");
    expect(() => new RegExp(escaped)).not.toThrow();
  });

  it("handles MongoDB query-like strings with combined special characters", () => {
    const input = "users.[0].name#tag";
    const escaped = escapeRegex(input);
    expect(escaped).toBe("users\\.\\[0\\]\\.name\\#tag");
    expect(() => new RegExp(escaped)).not.toThrow();
  });

  it("escaped pattern matches the original literal string when wrapped", () => {
    const literal = "hello.world";
    const escaped = escapeRegex(literal);
    const regex = new RegExp(escaped);
    expect("hello.world").toMatch(regex);
    expect("helloXworld").not.toMatch(regex);
  });
});
