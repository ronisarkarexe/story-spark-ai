import { escapeRegex } from "../utils/regex.util";

describe("escapeRegex", () => {
  // 1. Plain string
  it("should return the original string if it contains no regex metacharacters", () => {
    const plainString = "HelloWorld123";
    expect(escapeRegex(plainString)).toBe(plainString);
  });

  // 2. Individual metacharacters
  describe("individual metacharacters", () => {
    const cases = [
      ["[", "\\["],
      ["]", "\\]"],
      ["{", "\\{"],
      ["}", "\\}"],
      ["(", "\\("],
      [")", "\\)"],
      [".", "\\."],
      ["*", "\\*"],
      ["+", "\\+"],
      ["?", "\\?"],
      ["^", "\\^"],
      ["$", "\\$"],
      ["\\", "\\\\"],
      ["|", "\\|"],
      ["#", "\\#"],
      ["-", "\\-"],
    ];

    it.each(cases)("should escape '%s' to '%s'", (input, expected) => {
      expect(escapeRegex(input)).toBe(expected);
    });
  });

  // 3. Combined metacharacters
  it("should escape a string containing all supported metacharacters", () => {
    const combinedInput = "[]{}()*+?.-^$\\|#";
    const expectedOutput = "\\[\\]\\{\\}\\(\\)\\*\\+\\?\\.\\-\\^\\$\\\\\\|\\#";
    expect(escapeRegex(combinedInput)).toBe(expectedOutput);
  });

  // 4. Empty string
  it("should return an empty string when the input is an empty string", () => {
    expect(escapeRegex("")).toBe("");
  });

  // 5. RegExp safety
  it("should produce a safe string for RegExp constructor that matches the original input", () => {
    const dangerousInput = "user.name+test?*([123])^$|#-\\";
    const escaped = escapeRegex(dangerousInput);

    // Confirm new RegExp does not throw
    let regex: RegExp;
    expect(() => {
      regex = new RegExp(escaped);
    }).not.toThrow();

    // Confirm it matches the exact input
    expect(regex!.test(dangerousInput)).toBe(true);

    // Confirm it does NOT match variations that the unescaped regex would match
    // For example, '.' in the unescaped pattern matches any character, but in the escaped version it should only match '.'
    const mismatchedInput = dangerousInput.replace(".", "x");
    expect(regex!.test(mismatchedInput)).toBe(false);
  });

  // 6. Multiple repeated metacharacters
  it("should escape multiple repeated metacharacters correctly", () => {
    expect(escapeRegex("***+++???")).toBe("\\*\\*\\*\\+\\+\\+\\?\\?\\?");
    expect(escapeRegex("[[[ ]]]")).toBe("\\[\\[\\[ \\]\\]\\]");
  });

  // 7. Metacharacters mixed with normal text
  it("should escape metacharacters mixed with normal text", () => {
    expect(escapeRegex("hello.world")).toBe("hello\\.world");
    expect(escapeRegex("user-name_123")).toBe("user\\-name_123");
    expect(escapeRegex("Price is $100.00")).toBe("Price is \\$100\\.00");
  });

  // 8. Strings containing spaces plus metacharacters
  it("should escape strings with spaces and metacharacters", () => {
    expect(escapeRegex("hello world *")).toBe("hello world \\*");
    expect(escapeRegex("  [hello world]  ")).toBe("  \\[hello world\\]  ");
  });

  // 9. Long strings containing multiple escaped segments
  it("should escape a long string containing multiple escaped segments", () => {
    const longInput =
      "This is a long string with multiple special characters: [bracket], {curly}, (parentheses), a dot., a star*, a plus+, a question mark?, a caret^, a dollar$, a backslash\\, a pipe|, a hash#, and a dash-.";
    const expectedOutput =
      "This is a long string with multiple special characters: \\[bracket\\]\\, \\{curly\\}\\, \\(parentheses\\)\\, a dot\\.\\, a star\\*\\, a plus\\+\\, a question mark\\?\\, a caret\\^\\, a dollar\\$\\, a backslash\\\\\\, a pipe\\|\\, a hash\\#\\, and a dash\\-\\.";
    expect(escapeRegex(longInput)).toBe(expectedOutput);
  });

  // 10. Already escaped content to verify behavior remains consistent
  it("should escape already escaped content consistently (escaping the escape characters)", () => {
    // If input is already escaped, the backslashes should also get escaped.
    expect(escapeRegex("\\[")).toBe("\\\\\\[");
    expect(escapeRegex("hello\\\\world")).toBe("hello\\\\\\\\world");
  });
});
