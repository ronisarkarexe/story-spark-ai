import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getISTTimeFormate,
  timeAgo,
  formatDateShort,
} from "../time-formate";

describe("time-formate utility", () => {
  describe("getISTTimeFormate", () => {
    it("formats a timestamp as an IST time string", () => {
      // Fixed timestamp: 2026-06-26 12:00:00 UTC
      const timestamp = 1750939200000;
      const result = getISTTimeFormate(timestamp);
      expect(typeof result).toBe("string");
      expect(result).toContain(":");
    });
  });

  describe("timeAgo", () => {
    const realDate = Date;

    beforeEach(() => {
      vi.useFakeTimers();
      // Set fixed "now" to 2026-06-26 12:00:00 UTC
      vi.setSystemTime(new Date("2026-06-26T12:00:00.000Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns 'just now' for future timestamps", () => {
      const future = "2026-06-27T12:00:00.000Z";
      expect(timeAgo(future)).toBe("just now");
    });

    it("returns '1 second ago' for exactly 1 second ago", () => {
      const oneSecondAgo = "2026-06-26T11:59:59.000Z";
      expect(timeAgo(oneSecondAgo)).toBe("1 second ago");
    });

    it("returns 'N seconds ago' for seconds", () => {
      const fiveSecondsAgo = "2026-06-26T11:59:55.000Z";
      expect(timeAgo(fiveSecondsAgo)).toBe("5 seconds ago");
    });

    it("returns '1 minute ago' for exactly 1 minute ago", () => {
      const oneMinAgo = "2026-06-26T11:59:00.000Z";
      expect(timeAgo(oneMinAgo)).toBe("1 minute ago");
    });

    it("returns 'N minutes ago' for multiple minutes", () => {
      const fiveMinAgo = "2026-06-26T11:55:00.000Z";
      expect(timeAgo(fiveMinAgo)).toBe("5 minutes ago");
    });

    it("returns '1 hour ago' for exactly 1 hour ago", () => {
      const oneHourAgo = "2026-06-26T11:00:00.000Z";
      expect(timeAgo(oneHourAgo)).toBe("1 hour ago");
    });

    it("returns 'N hours ago' for multiple hours", () => {
      const fiveHoursAgo = "2026-06-26T07:00:00.000Z";
      expect(timeAgo(fiveHoursAgo)).toBe("5 hours ago");
    });

    it("returns '1 day ago' for exactly 1 day ago", () => {
      const oneDayAgo = "2026-06-25T12:00:00.000Z";
      expect(timeAgo(oneDayAgo)).toBe("1 day ago");
    });

    it("returns 'N days ago' for multiple days", () => {
      const fiveDaysAgo = "2026-06-21T12:00:00.000Z";
      expect(timeAgo(fiveDaysAgo)).toBe("5 days ago");
    });

    it("returns '1 month ago' for exactly 1 month ago", () => {
      const oneMonthAgo = "2026-05-26T12:00:00.000Z";
      expect(timeAgo(oneMonthAgo)).toBe("1 month ago");
    });

    it("returns 'N months ago' for multiple months", () => {
      const threeMonthsAgo = "2026-03-26T12:00:00.000Z";
      expect(timeAgo(threeMonthsAgo)).toBe("3 months ago");
    });

    it("returns '1 year ago' for exactly 1 year ago", () => {
      const oneYearAgo = "2025-06-26T12:00:00.000Z";
      expect(timeAgo(oneYearAgo)).toBe("1 year ago");
    });

    it("returns 'N years ago' for multiple years", () => {
      const twoYearsAgo = "2024-06-26T12:00:00.000Z";
      expect(timeAgo(twoYearsAgo)).toBe("2 years ago");
    });

    it("handles invalid date strings gracefully", () => {
      expect(() => timeAgo("invalid-date")).not.toThrow();
    });
  });

  describe("formatDateShort", () => {
    it("formats a date string as 'Month DD, YYYY'", () => {
      const result = formatDateShort("2026-06-26T00:00:00.000Z");
      expect(result).toMatch(/Jun 26, 2026/);
    });

    it("handles a different valid date", () => {
      const result = formatDateShort("2025-01-15T00:00:00.000Z");
      expect(result).toMatch(/Jan 15, 2025/);
    });

    it("handles invalid date strings gracefully", () => {
      expect(() => formatDateShort("invalid")).not.toThrow();
    });
  });
});
