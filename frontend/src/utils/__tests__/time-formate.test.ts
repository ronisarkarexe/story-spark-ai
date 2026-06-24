import {
  getISTTimeFormate,
  timeAgo,
  formatDateShort,
} from "../time-formate";

describe("time-formate", () => {
  // ─── getISTTimeFormate ───────────────────────────────────────────
  describe("getISTTimeFormate", () => {
    it("should return a non-empty string for a valid timestamp", () => {
      const timestamp = new Date("2024-01-15T10:30:00Z").getTime();
      const result = getISTTimeFormate(timestamp);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });

    it("should include time components in the output", () => {
      const timestamp = new Date("2024-01-15T10:30:00Z").getTime();
      const result = getISTTimeFormate(timestamp);
      // format: "10:30:00 AM XYZ" — should contain colon
      expect(result).toMatch(/\d{1,2}:\d{2}:\d{2}/);
    });
  });

  // ─── timeAgo ────────────────────────────────────────────────────
  describe("timeAgo", () => {
    it("should return 'just now' for future timestamps (clock skew)", () => {
      const future = new Date(Date.now() + 60000).toISOString();
      expect(timeAgo(future)).toBe("just now");
    });

    it("should return seconds ago", () => {
      const past = new Date(Date.now() - 30000).toISOString(); // 30 sec ago
      expect(timeAgo(past)).toBe("30 seconds ago");
    });

    it("should return '1 second ago'", () => {
      const past = new Date(Date.now() - 1000).toISOString();
      expect(timeAgo(past)).toBe("1 second ago");
    });

    it("should return '1 minute ago'", () => {
      const past = new Date(Date.now() - 60000).toISOString();
      expect(timeAgo(past)).toBe("1 minute ago");
    });

    it("should return minutes ago", () => {
      const past = new Date(Date.now() - 5 * 60000).toISOString();
      expect(timeAgo(past)).toBe("5 minutes ago");
    });

    it("should return '1 hour ago'", () => {
      const past = new Date(Date.now() - 3600000).toISOString();
      expect(timeAgo(past)).toBe("1 hour ago");
    });

    it("should return hours ago", () => {
      const past = new Date(Date.now() - 3 * 3600000).toISOString();
      expect(timeAgo(past)).toBe("3 hours ago");
    });

    it("should return '1 day ago'", () => {
      const past = new Date(Date.now() - 86400000).toISOString();
      expect(timeAgo(past)).toBe("1 day ago");
    });

    it("should return days ago", () => {
      const past = new Date(Date.now() - 3 * 86400000).toISOString();
      expect(timeAgo(past)).toBe("3 days ago");
    });

    it("should return '1 month ago'", () => {
      const past = new Date(Date.now() - 31 * 86400000).toISOString();
      expect(timeAgo(past)).toBe("1 month ago");
    });

    it("should return months ago", () => {
      const past = new Date(Date.now() - 3 * 2592000000).toISOString();
      expect(timeAgo(past)).toBe("3 months ago");
    });

    it("should return '1 year ago'", () => {
      const past = new Date(Date.now() - 365 * 86400000).toISOString();
      expect(timeAgo(past)).toBe("1 year ago");
    });

    it("should return years ago", () => {
      const past = new Date(Date.now() - 2 * 365 * 86400000).toISOString();
      expect(timeAgo(past)).toBe("2 years ago");
    });
  });

  // ─── formatDateShort ────────────────────────────────────────────
  describe("formatDateShort", () => {
    it("should format date in 'Mon DD, YYYY' format", () => {
      const result = formatDateShort("2024-01-15T00:00:00Z");
      // Expected: "Jan 15, 2024"
      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2}, \d{4}$/);
    });

    it("should return correct month and year", () => {
      const result = formatDateShort("2023-06-20T00:00:00Z");
      expect(result).toContain("2023");
      expect(result).toContain("Jun");
    });
  });
});