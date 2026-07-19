/**
 * sanitization.test.ts
 * Unit tests for URL sanitization functions in app/utils/sanitization.ts
 */
import { isAllowedUrlProtocol, sanitizeUrl } from "../../../utils/sanitization";

describe("isAllowedUrlProtocol", () => {
  it("returns true for http URLs", () => {
    expect(isAllowedUrlProtocol("http://example.com")).toBe(true);
  });

  it("returns true for https URLs", () => {
    expect(isAllowedUrlProtocol("https://example.com")).toBe(true);
  });

  it("returns true for ftp URLs", () => {
    expect(isAllowedUrlProtocol("ftp://files.example.com")).toBe(true);
  });

  it("returns false for javascript: protocol", () => {
    expect(isAllowedUrlProtocol("javascript:alert(1)")).toBe(false);
  });

  it("returns false for javascript: with uppercase", () => {
    expect(isAllowedUrlProtocol("JAVASCRIPT:alert(1)")).toBe(false);
  });

  it("returns false for data: protocol", () => {
    expect(isAllowedUrlProtocol("data:text/html,<script>alert(1)</script>")).toBe(
      false,
    );
  });

  it("returns false for vbscript: protocol", () => {
    expect(isAllowedUrlProtocol("vbscript:msgbox('xss')")).toBe(false);
  });

  it("returns false for mocha: protocol", () => {
    expect(isAllowedUrlProtocol("mocha:alert(1)")).toBe(false);
  });

  it("returns false for livescript: protocol", () => {
    expect(isAllowedUrlProtocol("livescript:alert(1)")).toBe(false);
  });

  it("returns false for about: protocol", () => {
    expect(isAllowedUrlProtocol("about:blank")).toBe(false);
  });

  it("returns false for file: protocol", () => {
    expect(isAllowedUrlProtocol("file:///etc/passwd")).toBe(false);
  });

  it("returns false for view-source: protocol", () => {
    expect(isAllowedUrlProtocol("view-source:https://example.com")).toBe(false);
  });

  it("returns false for jar: protocol", () => {
    expect(isAllowedUrlProtocol("jar:https://evil.com/evil.jar!")).toBe(false);
  });

  it("returns false for apt: protocol", () => {
    expect(isAllowedUrlProtocol("apt:package-name")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isAllowedUrlProtocol("")).toBe(false);
  });

  it("returns false for null/undefined", () => {
    expect(isAllowedUrlProtocol(null as any)).toBe(false);
    expect(isAllowedUrlProtocol(undefined as any)).toBe(false);
  });

  it("returns true for plain hostname without protocol", () => {
    expect(isAllowedUrlProtocol("example.com")).toBe(true);
  });

  it("returns true for relative paths", () => {
    expect(isAllowedUrlProtocol("/images/logo.png")).toBe(true);
  });

  it("returns true for URLs with query strings", () => {
    expect(
      isAllowedUrlProtocol("https://example.com?redirect=https://evil.com"),
    ).toBe(true);
  });

  it("returns true for URLs with ports", () => {
    expect(isAllowedUrlProtocol("https://example.com:8080/path")).toBe(true);
  });

  it("returns true for mailto: links", () => {
    expect(isAllowedUrlProtocol("mailto:user@example.com")).toBe(true);
  });

  it("is not bypassed by whitespace around dangerous protocol", () => {
    expect(isAllowedUrlProtocol("  javascript:alert(1)")).toBe(false);
    expect(isAllowedUrlProtocol("javascript:alert(1)  ")).toBe(false);
  });
});

describe("sanitizeUrl", () => {
  it("returns URL unchanged when protocol is safe (https)", () => {
    expect(sanitizeUrl("https://example.com")).toBe(
      "https://example.com",
    );
  });

  it("returns URL unchanged when protocol is safe (http)", () => {
    expect(sanitizeUrl("http://example.com")).toBe("http://example.com");
  });

  it("returns fallback for javascript: URLs", () => {
    expect(sanitizeUrl("javascript:alert(1)", "")).toBe("");
    expect(sanitizeUrl("javascript:alert(1)", "/safe/default")).toBe(
      "/safe/default",
    );
  });

  it("returns fallback for data: URLs", () => {
    expect(sanitizeUrl("data:text/html,<script>alert(1)</script>", "")).toBe("");
    expect(sanitizeUrl("data:text/html,<script/>", "fallback.png")).toBe(
      "fallback.png",
    );
  });

  it("returns fallback for vbscript: URLs", () => {
    expect(sanitizeUrl("vbscript:msgbox('xss')", "")).toBe("");
  });

  it("returns fallback for file: URLs", () => {
    expect(sanitizeUrl("file:///etc/passwd", "")).toBe("");
  });

  it("returns fallback for empty string", () => {
    expect(sanitizeUrl("", "")).toBe("");
    expect(sanitizeUrl("", "https://default.com")).toBe(
      "https://default.com",
    );
  });

  it("returns fallback for null/undefined", () => {
    expect(sanitizeUrl(null as any, "https://default.com")).toBe(
      "https://default.com",
    );
    expect(sanitizeUrl(undefined as any, "https://default.com")).toBe(
      "https://default.com",
    );
  });

  it("trims whitespace from safe URLs", () => {
    expect(sanitizeUrl("  https://example.com  ")).toBe(
      "https://example.com",
    );
  });

  it("uses empty string as default fallback", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBe("");
  });

  it("returns URL unchanged for relative paths", () => {
    expect(sanitizeUrl("/images/logo.png")).toBe("/images/logo.png");
  });

  it("returns URL unchanged for plain hostnames", () => {
    expect(sanitizeUrl("example.com")).toBe("example.com");
  });
});
