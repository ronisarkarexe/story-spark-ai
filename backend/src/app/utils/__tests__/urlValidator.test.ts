import { isValidUrl } from "../urlValidator";

describe("isValidUrl", () => {
  describe("valid HTTP/HTTPS URLs", () => {
    it("accepts a valid https URL", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
    });

    it("accepts a valid http URL", () => {
      expect(isValidUrl("http://example.com")).toBe(true);
    });

    it("accepts URL with a path", () => {
      expect(isValidUrl("https://example.com/story/123")).toBe(true);
    });

    it("accepts URL with query string", () => {
      expect(isValidUrl("https://example.com/search?q=hello")).toBe(true);
    });

    it("accepts URL with fragment", () => {
      expect(isValidUrl("https://example.com/page#section")).toBe(true);
    });

    it("accepts URL with port number", () => {
      expect(isValidUrl("http://localhost:3000")).toBe(true);
    });

    it("accepts localhost with various ports", () => {
      expect(isValidUrl("http://localhost:8080")).toBe(true);
      expect(isValidUrl("https://localhost:443")).toBe(true);
    });

    it("accepts IP address with port", () => {
      expect(isValidUrl("http://127.0.0.1:4000")).toBe(true);
      expect(isValidUrl("http://192.168.1.1:3000")).toBe(true);
    });

    it("accepts URL with credentials in hostname", () => {
      expect(isValidUrl("http://user:pass@example.com")).toBe(true);
    });

    it("accepts URL with multiple path segments", () => {
      expect(isValidUrl("https://example.com/a/b/c/d")).toBe(true);
    });
  });

  describe("invalid protocols", () => {
    it("rejects ftp protocol", () => {
      expect(isValidUrl("ftp://example.com")).toBe(false);
    });

    it("rejects file protocol", () => {
      expect(isValidUrl("file:///path/to/file")).toBe(false);
    });

    it("rejects javascript protocol", () => {
      expect(isValidUrl("javascript:alert(1)")).toBe(false);
    });

    it("rejects data URL", () => {
      expect(isValidUrl("data:text/html,<h1>test</h1>")).toBe(false);
    });

    it("rejects mailto protocol", () => {
      expect(isValidUrl("mailto:test@example.com")).toBe(false);
    });

    it("rejects ws (WebSocket) protocol", () => {
      expect(isValidUrl("ws://example.com/socket")).toBe(false);
    });

    it("rejects relative URLs (no protocol)", () => {
      expect(isValidUrl("/story/123")).toBe(false);
      expect(isValidUrl("story/123")).toBe(false);
    });
  });

  describe("invalid inputs", () => {
    it("rejects empty string", () => {
      expect(isValidUrl("")).toBe(false);
    });

    it("rejects null", () => {
      expect(isValidUrl(null as unknown as string)).toBe(false);
    });

    it("rejects undefined", () => {
      expect(isValidUrl(undefined as unknown as string)).toBe(false);
    });

    it("rejects plain text", () => {
      expect(isValidUrl("not a url")).toBe(false);
    });

    it("rejects domain without protocol", () => {
      expect(isValidUrl("example.com")).toBe(false);
    });

    it("rejects malformed URL", () => {
      expect(isValidUrl("https://")).toBe(false);
      expect(isValidUrl("http://")).toBe(false);
    it("returns true for standard https URL", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
    });

    it("returns true for standard http URL", () => {
      expect(isValidUrl("http://example.com")).toBe(true);
    });

    it("returns true for localhost", () => {
      expect(isValidUrl("http://localhost:3000")).toBe(true);
    });

    it("returns true for URL with port", () => {
      expect(isValidUrl("https://example.com:8080")).toBe(true);
    });

    it("returns true for URL with path", () => {
      expect(isValidUrl("https://example.com/path/to/page")).toBe(true);
    });

    it("returns true for URL with query string", () => {
      expect(isValidUrl("https://example.com?search=term&page=1")).toBe(true);
    });

    it("returns true for URL with fragment", () => {
      expect(isValidUrl("https://example.com#section")).toBe(true);
    });

    it("returns true for URL with query and fragment", () => {
      expect(isValidUrl("https://example.com/path?a=1#anchor")).toBe(true);
    });

    it("returns true for URL with subdomain", () => {
      expect(isValidUrl("https://api.example.com/v1/users")).toBe(true);
    });

    it("returns true for URL with IP address", () => {
      expect(isValidUrl("http://127.0.0.1:5000")).toBe(true);
    });

    it("returns true for URL with authentication", () => {
      expect(isValidUrl("https://user:pass@example.com")).toBe(true);
    });
  });

  describe("invalid URLs", () => {
    it("returns false for relative path", () => {
      expect(isValidUrl("/path/to/page")).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isValidUrl("")).toBe(false);
    });

    it("returns false for whitespace-only string", () => {
      expect(isValidUrl("   ")).toBe(false);
    });

    it("returns false for plain domain without protocol", () => {
      expect(isValidUrl("example.com")).toBe(false);
    });

    it("returns false for ftp protocol", () => {
      expect(isValidUrl("ftp://example.com")).toBe(false);
    });

    it("returns false for javascript protocol", () => {
      expect(isValidUrl("javascript:void(0)")).toBe(false);
    });

    it("returns false for data URL", () => {
      expect(isValidUrl("data:text/html,<h1>test</h1>")).toBe(false);
    });

    it("returns false for file protocol", () => {
      expect(isValidUrl("file:///etc/passwd")).toBe(false);
    });

    it("returns false for mailto protocol", () => {
      expect(isValidUrl("mailto:test@example.com")).toBe(false);
    });

    it("returns false for tel protocol", () => {
      expect(isValidUrl("tel:+1234567890")).toBe(false);
    });
  });

  describe("null and type safety", () => {
    it("returns false for null", () => {
      expect(isValidUrl(null as any)).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(isValidUrl(undefined as any)).toBe(false);
    });

    it("returns false for number input", () => {
      expect(isValidUrl(123 as any)).toBe(false);
    });

    it("returns false for object input", () => {
      expect(isValidUrl({ url: "https://example.com" } as any)).toBe(false);
    });
  });
});
