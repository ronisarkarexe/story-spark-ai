import {
  escapeHtml,
  unescapeHtml,
  stripHtml,
  sanitizeRichText,
  sanitizeText,
  sanitizeUrl,
  sanitizeObjectStrings,
  truncateText,
  sanitizeStoryPayload,
} from "../sanitize.util";

// Jest globals (this repo compiles tests without pulling in Jest types into the TS program)
/* eslint-disable @typescript-eslint/no-explicit-any */

declare const describe: any;
declare const it: any;
declare const expect: any;

describe("sanitize.util — escapeHtml", () => {
  it("escapes all HTML special characters correctly", () => {
    const input = `& < > " ' / \\ \``;
    const expected = "&amp; &lt; &gt; &quot; &#x27; &#x2F; &#x5C; &#96;";
    expect(escapeHtml(input)).toBe(expected);
  });

  it("returns an empty string for non-string inputs", () => {
    expect(escapeHtml(null as any)).toBe("");
    expect(escapeHtml(undefined as any)).toBe("");
    expect(escapeHtml(123 as any)).toBe("");
    expect(escapeHtml({} as any)).toBe("");
    expect(escapeHtml([] as any)).toBe("");
  });
});

describe("sanitize.util — unescapeHtml", () => {
  it("reverses escapeHtml transformations", () => {
    const input = "&amp; &lt; &gt; &quot; &#x27; &#x2F; &#x5C; &#96;";
    const expected = `& < > " ' / \\ \``;
    expect(unescapeHtml(input)).toBe(expected);
  });

  it("handles unknown HTML entities gracefully", () => {
    const input = "&unknown; &copy; &invalid;";
    expect(unescapeHtml(input)).toBe(input);
  });

  it("returns an empty string for non-string inputs", () => {
    expect(unescapeHtml(null as any)).toBe("");
    expect(unescapeHtml(undefined as any)).toBe("");
  });
});

describe("sanitize.util — stripHtml", () => {
  it("removes script and style tags along with their contents", () => {
    const input = "<div>Hello<script>alert(1)</script><style>body {color: red;}</style> World</div>";
    expect(stripHtml(input)).toBe("Hello World");
  });

  it("removes all other HTML tags", () => {
    const input = "<p>This is <strong>bold</strong> and <em>italic</em>.</p>";
    expect(stripHtml(input)).toBe("This is bold and italic.");
  });

  it("decodes common HTML entities", () => {
    const input = "Hello&nbsp;World &amp; &lt;friends&gt; &quot;yes&quot;";
    expect(stripHtml(input)).toBe("Hello World & <friends> \"yes\"");
  });

  it("returns an empty string for non-string inputs", () => {
    expect(stripHtml(null as any)).toBe("");
    expect(stripHtml(undefined as any)).toBe("");
  });
});

describe("sanitize.util — sanitizeRichText", () => {
  it("removes dangerous tags like script, iframe, and object while preserving other tags", () => {
    const input = "<div><h1>Title</h1><script>evil()</script><iframe src='http://evil.com'></iframe><p>Paragraph</p></div>";
    expect(sanitizeRichText(input)).toBe("<div><h1>Title</h1><p>Paragraph</p></div>");
  });

  it("removes dangerous attributes like event handlers", () => {
    const input = '<div onclick="alert(1)" class="safe" onerror="destroy()">Content</div>';
    expect(sanitizeRichText(input)).toBe('<div class="safe">Content</div>');
  });

  it("blocks dangerous URL protocols (javascript, data) in href and src", () => {
    const input = '<a href="javascript:alert(1)">Link</a> <img src="data:text/html,evil" />';
    const result = sanitizeRichText(input);
    expect(result).toContain('href="#blocked"');
    expect(result).toContain('src="#blocked"');
  });

  it("returns an empty string for non-string inputs", () => {
    expect(sanitizeRichText(null as any)).toBe("");
    expect(sanitizeRichText(undefined as any)).toBe("");
  });
});

describe("sanitize.util — sanitizeText", () => {
  it("combines stripHtml and escapeHtml", () => {
    const input = "<p>Hello & <strong>Welcome</strong></p>";
    // stripHtml: "Hello & Welcome"
    // escapeHtml: "Hello &amp; Welcome"
    expect(sanitizeText(input)).toBe("Hello &amp; Welcome");
  });

  it("handles null/undefined inputs", () => {
    expect(sanitizeText(null)).toBe("");
    expect(sanitizeText(undefined)).toBe("");
  });
});

describe("sanitize.util — sanitizeUrl", () => {
  it("allows relative URLs starting with /", () => {
    expect(sanitizeUrl("/dashboard/profile")).toBe("/dashboard/profile");
  });

  it("allows safe protocols (http, https, mailto, tel)", () => {
    expect(sanitizeUrl("http://example.com")).toBe("http://example.com");
    expect(sanitizeUrl("https://example.com/path")).toBe("https://example.com/path");
    expect(sanitizeUrl("mailto:test@example.com")).toBe("mailto:test@example.com");
    expect(sanitizeUrl("tel:+1234567890")).toBe("tel:+1234567890");
  });

  it("blocks dangerous protocols (javascript, data, about, etc.)", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBe("");
    expect(sanitizeUrl("data:text/html,evil")).toBe("");
    expect(sanitizeUrl("about:blank")).toBe("");
  });

  it("returns an empty string for non-string inputs", () => {
    expect(sanitizeUrl(null as any)).toBe("");
    expect(sanitizeUrl(undefined as any)).toBe("");
  });
});

describe("sanitize.util — sanitizeObjectStrings", () => {
  it("recursively sanitizes all string fields in an object", () => {
    const input = {
      title: "<h1>Dangerous Title</h1>",
      count: 42,
      nested: {
        description: "<script>alert(1)</script>Safe Text",
        tags: ["<p>tag1</p>", "tag2", 123],
      },
    };

    const expected = {
      title: "Dangerous Title",
      count: 42,
      nested: {
        description: "Safe Text",
        tags: ["tag1", "tag2", 123],
      },
    };

    expect(sanitizeObjectStrings(input)).toEqual(expected);
  });

  it("returns the input value if it is not an object", () => {
    expect(sanitizeObjectStrings(null as any)).toBeNull();
    expect(sanitizeObjectStrings("test" as any)).toBe("test");
  });
});

describe("sanitize.util — truncateText", () => {
  it("truncates text exceeding maxLength and appends ellipsis", () => {
    const input = "This is a very long text that needs to be truncated.";
    expect(truncateText(input, 10)).toBe("This is a...");
  });

  it("does not truncate text if length is less than or equal to maxLength", () => {
    const input = "Short text";
    expect(truncateText(input, 20)).toBe("Short text");
  });

  it("handles null, undefined, or non-string inputs", () => {
    expect(truncateText(null, 10)).toBe("");
    expect(truncateText(undefined, 10)).toBe("");
    expect(truncateText(123 as any, 10)).toBe("");
  });
});

describe("sanitize.util — sanitizeStoryPayload", () => {
  it("sanitizes title, content, prompt, and tag fields appropriately", () => {
    const payload = {
      title: "<h1>My Story</h1>",
      content: "<p>Once upon a time...</p><script>evil()</script>",
      prompt: "Create a <strong>cool</strong> story",
      tag: "adventure & fun",
      extraField: "should remain <untouched>",
    };

    const expected = {
      title: "My Story",
      content: "<p>Once upon a time...</p>",
      prompt: "Create a cool story",
      tag: "adventure &amp; fun",
      extraField: "should remain <untouched>",
    };

    expect(sanitizeStoryPayload(payload)).toEqual(expected);
  });
});
