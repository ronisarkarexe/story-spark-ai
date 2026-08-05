import {
  escapeHtml,
  unescapeHtml,
  stripHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeObjectStrings,
  truncateText,
  sanitizeStoryPayload,
  sanitizeRichText,
} from "../utils/sanitize.util";

describe("escapeHtml", () => {
  it("escapes ampersand", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("escapes angle brackets", () => {
    expect(escapeHtml("<div>")).toBe("&lt;div&gt;");
  });

  it("escapes double and single quotes", () => {
    expect(escapeHtml('say "hi"')).toBe("say &quot;hi&quot;");
    expect(escapeHtml("it's")).toBe("it&#x27;s");
  });

  it("escapes backtick and backslash", () => {
    expect(escapeHtml("`cmd`")).toBe("&#96;cmd&#96;");
    expect(escapeHtml("path\\to")).toBe("path&#x5C;to");
  });

  it("escapes forward slash", () => {
    expect(escapeHtml("a/b")).toBe("a&#x2F;b");
  });

  it("returns empty string for null", () => {
    expect(escapeHtml(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(escapeHtml(undefined)).toBe("");
  });

  it("returns empty string for non-string input", () => {
    expect(escapeHtml(123 as any)).toBe("");
    expect(escapeHtml({} as any)).toBe("");
  });

  it("returns unchanged string with no special characters", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });
});

describe("unescapeHtml", () => {
  it("unescapes &amp;", () => {
    expect(unescapeHtml("a &amp; b")).toBe("a & b");
  });

  it("unescapes &lt; and &gt;", () => {
    expect(unescapeHtml("&lt;div&gt;")).toBe("<div>");
  });

  it("unescapes &quot;", () => {
    expect(unescapeHtml("&quot;hello&quot;")).toBe('"hello"');
  });

  it("unescapes numeric HTML entities", () => {
    expect(unescapeHtml("&#x27;hello&#x27;")).toBe("'hello'");
    expect(unescapeHtml("&#x2F;")).toBe("/");
  });

  it("returns empty string for null", () => {
    expect(unescapeHtml(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(unescapeHtml(undefined)).toBe("");
  });

  it("returns empty string for non-string input", () => {
    expect(unescapeHtml(123 as any)).toBe("");
  });
});

describe("stripHtml", () => {
  it("removes a single HTML tag", () => {
    expect(stripHtml("<p>Hello</p>")).toBe("Hello");
  });

  it("removes script tags with content", () => {
    expect(stripHtml("<script>alert(1)</script>text")).toBe("text");
  });

  it("removes style tags with content", () => {
    expect(stripHtml("<style>body{}</style>text")).toBe("text");
  });

  it("removes all HTML tags from mixed content", () => {
    expect(stripHtml("<b>bold</b> and <i>italic</i>")).toBe("bold and italic");
  });

  it("decodes common HTML entities", () => {
    expect(stripHtml("&amp; &lt; &gt; &quot; &nbsp;")).toBe("& < > \"");
  });

  it("trims whitespace from result", () => {
    expect(stripHtml("  <p>  text  </p>  ")).toBe("text");
  });

  it("returns empty string for null", () => {
    expect(stripHtml(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(stripHtml(undefined)).toBe("");
  });

  it("returns empty string for non-string input", () => {
    expect(stripHtml(123 as any)).toBe("");
  });

  it("handles nested tags", () => {
    expect(stripHtml("<div><p><span>nested</span></p></div>")).toBe("nested");
  });
});

describe("sanitizeText", () => {
  it("strips HTML and escapes remaining characters", () => {
    const result = sanitizeText("<script>alert(1)</script>Hello & World");
    expect(result).toBe("alert(1)Hello &amp; World");
  });

  it("escapes special characters without HTML", () => {
    expect(sanitizeText("a < b & c > d")).toBe("a &lt; b &amp; c &gt; d");
  });

  it("returns empty string for null", () => {
    expect(sanitizeText(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(sanitizeText(undefined)).toBe("");
  });
});

describe("sanitizeUrl", () => {
  it("allows relative URLs", () => {
    expect(sanitizeUrl("/stories/123")).toBe("/stories/123");
    expect(sanitizeUrl("/api/users")).toBe("/api/users");
  });

  it("allows http URLs", () => {
    expect(sanitizeUrl("http://example.com")).toBe("http://example.com");
  });

  it("allows https URLs", () => {
    expect(sanitizeUrl("https://example.com")).toBe("https://example.com");
  });

  it("allows mailto URLs", () => {
    expect(sanitizeUrl("mailto:user@example.com")).toBe("mailto:user@example.com");
  });

  it("allows tel URLs", () => {
    expect(sanitizeUrl("tel:+1234567890")).toBe("tel:+1234567890");
  });

  it("blocks javascript: URLs", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBe("");
  });

  it("blocks data: URLs", () => {
    expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBe("");
  });

  it("blocks vbscript: URLs", () => {
    expect(sanitizeUrl("vbscript:alert(1)")).toBe("");
  });

  it("returns empty string for null", () => {
    expect(sanitizeUrl(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(sanitizeUrl(undefined)).toBe("");
  });

  it("trims and evaluates trimmed URL", () => {
    expect(sanitizeUrl("  https://example.com  ")).toBe("https://example.com");
  });

  it("blocks unknown protocols", () => {
    expect(sanitizeUrl("ftp://example.com")).toBe("");
    expect(sanitizeUrl("file:///etc/passwd")).toBe("");
  });
});

describe("sanitizeObjectStrings", () => {
  it("sanitizes all top-level string fields", () => {
    const input = { name: "<b>Alice</b>", age: 30 };
    const result = sanitizeObjectStrings(input);
    expect(result.name).toBe("&lt;b&gt;Alice&lt;/b&gt;");
    expect(result.age).toBe(30);
  });

  it("sanitizes nested objects", () => {
    const input = { user: { bio: "<script>x</script>" } };
    const result = sanitizeObjectStrings(input);
    expect(result.user.bio).toBe("scriptx");
  });

  it("sanitizes string items in arrays", () => {
    const input = { tags: ["<a>", "<b>"] };
    const result = sanitizeObjectStrings(input);
    expect(result.tags).toEqual(["&lt;a&gt;", "&lt;b&gt;"]);
  });

  it("handles mixed arrays with strings, objects, and primitives", () => {
    const input = { mixed: ["<p>", { nested: "<i>" }, 42, null] };
    const result = sanitizeObjectStrings(input);
    expect(result.mixed).toEqual(["&lt;p&gt;", { nested: "&lt;i&gt;" }, 42, null]);
  });

  it("uses a custom sanitizer when provided", () => {
    const input = { url: "/path/to?a=1" };
    const customSanitizer = (s: string) => s.toUpperCase();
    const result = sanitizeObjectStrings(input, customSanitizer);
    expect(result.url).toBe("/PATH/TO?A=1");
  });

  it("returns the input unchanged when it is not an object", () => {
    expect(sanitizeObjectStrings(null as any)).toBe(null);
    expect(sanitizeObjectStrings("string" as any)).toBe("string");
  });
});

describe("truncateText", () => {
  it("returns unchanged string shorter than maxLength", () => {
    expect(truncateText("hello", 10)).toBe("hello");
  });

  it("truncates string longer than maxLength with ellipsis", () => {
    expect(truncateText("hello world this is a long text", 10)).toBe("hello world...");
  });

  it("trims trailing whitespace before ellipsis", () => {
    expect(truncateText("hello world   ", 10)).toBe("hello...");
  });

  it("uses default maxLength of 200", () => {
    const long = "a".repeat(250);
    const result = truncateText(long);
    expect(result.length).toBe(203); // 200 + "..."
    expect(result.endsWith("...")).toBe(true);
  });

  it("returns empty string for null", () => {
    expect(truncateText(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(truncateText(undefined)).toBe("");
  });

  it("returns empty string for non-string input", () => {
    expect(truncateText(123 as any)).toBe("");
  });
});

describe("sanitizeStoryPayload", () => {
  it("sanitizes all present story fields", () => {
    const input = {
      title: "<script>bad</script>Good Title",
      content: "<script>alert(1)</script><p>Safe paragraph</p>",
      prompt: "<b>Prompt</b>",
      tag: "<div>tag</div>",
    };
    const result = sanitizeStoryPayload(input);
    expect(result.title).toBe("scriptbadGood Title"); // stripHtml + escapeHtml
    expect(result.content).toContain("Safe paragraph");
    expect(result.content).not.toContain("<script>");
    expect(result.prompt).toBe("&lt;b&gt;Prompt&lt;/b&gt;");
    expect(result.tag).toBe("&lt;div&gt;tag&lt;/div&gt;");
  });

  it("omits fields that are undefined", () => {
    const result = sanitizeStoryPayload({});
    expect(result.title).toBeUndefined();
    expect(result.content).toBeUndefined();
    expect(result.prompt).toBeUndefined();
    expect(result.tag).toBeUndefined();
  });
});

describe("sanitizeRichText", () => {
  it("removes script tags with content", () => {
    const input = "<p>Hello</p><script>alert(1)</script>";
    expect(sanitizeRichText(input)).not.toContain("<script>");
    expect(sanitizeRichText(input)).toContain("<p>Hello</p>");
  });

  it("removes style tags with content", () => {
    const input = "<style>body{}</style><p>text</p>";
    expect(sanitizeRichText(input)).not.toContain("<style>");
    expect(sanitizeRichText(input)).toContain("<p>text</p>");
  });

  it("removes dangerous tags", () => {
    const input = "<iframe src='evil.com'></iframe><p>ok</p>";
    expect(sanitizeRichText(input)).not.toContain("<iframe");
    expect(sanitizeRichText(input)).toContain("<p>ok</p>");
  });

  it("removes dangerous attributes", () => {
    const input = '<img src="x" onerror="alert(1)">';
    expect(sanitizeRichText(input)).not.toContain("onerror");
  });

  it("blocks javascript: in href attributes", () => {
    const input = '<a href="javascript:alert(1)">click</a>';
    expect(sanitizeRichText(input)).toContain('href="#blocked"');
  });

  it("returns empty string for null", () => {
    expect(sanitizeRichText(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(sanitizeRichText(undefined)).toBe("");
  });
});
