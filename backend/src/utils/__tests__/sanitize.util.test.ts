import {
  escapeHtml,
  unescapeHtml,
  stripHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeObjectStrings,
  truncateText,
  sanitizeStoryPayload,
} from "../sanitize.util";

describe("escapeHtml", () => {
  it("escapes ampersand", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("escapes less-than and greater-than", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('say "hello"')).toBe("say &quot;hello&quot;");
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("it's great")).toBe("it&#x27;s great");
  });

  it("escapes forward slash", () => {
    expect(escapeHtml("a/b")).toBe("a&#x2F;b");
  });

  it("escapes backtick", () => {
    expect(escapeHtml("`cmd`")).toBe("&#96;cmd&#96;");
  });

  it("escapes backslash", () => {
    expect(escapeHtml("path\\file")).toBe("path&#x5C;file");
  });

  it("returns empty string for undefined", () => {
    expect(escapeHtml(undefined)).toBe("");
  });

  it("returns empty string for null", () => {
    expect(escapeHtml(null)).toBe("");
  });

  it("returns empty string for non-string input", () => {
    expect(escapeHtml(123 as any)).toBe("");
  });

  it("leaves plain text unchanged", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });
});

describe("unescapeHtml", () => {
  it("unescapes &amp;", () => {
    expect(unescapeHtml("a &amp; b")).toBe("a & b");
  });

  it("unescapes &lt; and &gt;", () => {
    expect(unescapeHtml("&lt;script&gt;")).toBe("<script>");
  });

  it("unescapes &quot;", () => {
    expect(unescapeHtml("say &quot;hello&quot;")).toBe('say "hello"');
  });

  it("unescapes &#x27;", () => {
    expect(unescapeHtml("it&#x27;s great")).toBe("it's great");
  });

  it("keeps unknown entities as-is", () => {
    expect(unescapeHtml("&unknown;")).toBe("&unknown;");
  });

  it("returns empty string for undefined", () => {
    expect(unescapeHtml(undefined)).toBe("");
  });

  it("returns empty string for null", () => {
    expect(unescapeHtml(null)).toBe("");
  });
});

describe("stripHtml", () => {
  it("removes simple HTML tags", () => {
    expect(stripHtml("<b>bold</b>")).toBe("bold");
  });

  it("removes script tag with content", () => {
    expect(stripHtml("<script>alert('xss')</script>")).toBe("");
  });

  it("removes style tag with content", () => {
    expect(stripHtml("<style>body{}</style>")).toBe("");
  });

  it("decodes &nbsp;", () => {
    expect(stripHtml("hello&nbsp;world")).toBe("hello world");
  });

  it("decodes &amp;", () => {
    expect(stripHtml("a &amp; b")).toBe("a & b");
  });

  it("returns empty string for undefined", () => {
    expect(stripHtml(undefined)).toBe("");
  });

  it("returns empty string for null", () => {
    expect(stripHtml(null)).toBe("");
  });
});

describe("sanitizeText", () => {
  it("strips HTML then escapes remaining characters", () => {
    const result = sanitizeText("<b>hello & world</b>");
    expect(result).not.toContain("<b>");
    expect(result).toContain("&amp;");
  });

  it("returns empty string for undefined", () => {
    expect(sanitizeText(undefined)).toBe("");
  });

  it("returns empty string for null", () => {
    expect(sanitizeText(null)).toBe("");
  });

  it("returns empty string for non-string input", () => {
    expect(sanitizeText(999 as any)).toBe("");
  });

  it("handles empty string", () => {
    expect(sanitizeText("")).toBe("");
  });
});

describe("sanitizeUrl", () => {
  it("allows relative URLs starting with /", () => {
    expect(sanitizeUrl("/api/users")).toBe("/api/users");
  });

  it("allows http URLs", () => {
    expect(sanitizeUrl("http://example.com")).toBe("http://example.com");
  });

  it("allows https URLs", () => {
    expect(sanitizeUrl("https://example.com")).toBe("https://example.com");
  });

  it("allows mailto URLs", () => {
    expect(sanitizeUrl("mailto:test@example.com")).toBe("mailto:test@example.com");
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

  it("blocks arbitrary protocols", () => {
    expect(sanitizeUrl("vbscript:msgbox('xss')")).toBe("");
  });

  it("trims whitespace from input", () => {
    expect(sanitizeUrl("  /api/path  ")).toBe("/api/path");
  });

  it("returns empty string for undefined", () => {
    expect(sanitizeUrl(undefined)).toBe("");
  });

  it("returns empty string for null", () => {
    expect(sanitizeUrl(null)).toBe("");
  });
});

describe("sanitizeObjectStrings", () => {
  it("sanitizes all string fields recursively", () => {
    const input = {
      name: "<b>Alice</b>",
      email: "alice@example.com",
      nested: {
        bio: "<script>xss</script>",
      },
    };
    const result = sanitizeObjectStrings(input);
    expect(result.name).not.toContain("<b>");
    expect(result.bio).not.toContain("<script>");
  });

  it("preserves non-string fields", () => {
    const input = { age: 30, active: true, count: null };
    const result = sanitizeObjectStrings(input);
    expect(result.age).toBe(30);
    expect(result.active).toBe(true);
    expect(result.count).toBe(null);
  });

  it("handles arrays of strings", () => {
    const input = { tags: ["<b>tag1</b>", "normal"] };
    const result = sanitizeObjectStrings(input);
    expect(result.tags[0]).not.toContain("<b>");
    expect(result.tags[1]).toBe("normal");
  });

  it("handles arrays of objects", () => {
    const input = { users: [{ name: "<i>Bob</i>" }] };
    const result = sanitizeObjectStrings(input);
    expect(result.users[0].name).not.toContain("<i>");
  });

  it("returns input unchanged for non-object input", () => {
    expect(sanitizeObjectStrings(null as any)).toBe(null);
    expect(sanitizeObjectStrings("string" as any)).toBe("string");
  });

  it("uses custom sanitizer when provided", () => {
    const input = { url: "/api/path" };
    const result = sanitizeObjectStrings(input, (s) => s.toUpperCase());
    expect(result.url).toBe("/API/PATH");
  });
});

describe("truncateText", () => {
  it("truncates text longer than maxLength with ellipsis", () => {
    const result = truncateText("this is a long string", 10);
    expect(result).toBe("this is a ...");
    expect(result.length).toBe(13); // 10 chars + "..."
  });

  it("returns original text when within maxLength", () => {
    expect(truncateText("hello", 10)).toBe("hello");
  });

  it("uses default maxLength of 200", () => {
    const long = "a".repeat(300);
    const result = truncateText(long);
    expect(result.length).toBe(203); // 200 + "..."
  });

  it("returns empty string for undefined", () => {
    expect(truncateText(undefined)).toBe("");
  });

  it("returns empty string for null", () => {
    expect(truncateText(null)).toBe("");
  });

  it("returns empty string for non-string input", () => {
    expect(truncateText(42 as any)).toBe("");
  });
});

describe("sanitizeStoryPayload", () => {
  it("sanitizes title field with sanitizeText", () => {
    const result = sanitizeStoryPayload({ title: "<b>My Title</b>" });
    expect(result.title).not.toContain("<b>");
  });

  it("sanitizes tag field with sanitizeText", () => {
    const result = sanitizeStoryPayload({ tag: "<script>xss</script>" });
    expect(result.tag).not.toContain("<script>");
  });

  it("preserves undefined fields", () => {
    const result = sanitizeStoryPayload({});
    expect((result as any).title).toBeUndefined();
    expect((result as any).content).toBeUndefined();
  });

  it("returns a new object", () => {
    const original = { title: "test" };
    const result = sanitizeStoryPayload(original);
    expect(result).not.toBe(original);
  });
});
