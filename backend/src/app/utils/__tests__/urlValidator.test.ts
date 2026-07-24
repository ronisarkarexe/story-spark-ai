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
    });
  });
});
