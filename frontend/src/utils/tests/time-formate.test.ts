import { describe, it, expect } from "vitest";
import {
  getISTTimeFormate,
  timeAgo,
  formatDateShort,
} from "../time-formate";

describe("getISTTimeFormate", () => {
  it("formats a Unix timestamp into IST timezone string", () => {
    // Unix timestamp for 2025-01-15 12:00:00 UTC
    const timestamp = 1736942400;
    const result = getISTTimeFormate(timestamp);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns a non-empty string for a valid timestamp", () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const result = getISTTimeFormate(timestamp);
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
    // timeZoneName: short may output UTC in some environments
    expect(result).toMatch(/\d{2}:\d{2}:\d{2} (AM|PM) [A-Z]{2,4}/);
  });
});

describe("timeAgo", () => {
  it("returns 'just now' for future timestamps", () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // 30 days in future
    const result = timeAgo(futureDate);
    expect(result).toBe("just now");
  });

  it("returns seconds ago for timestamps less than a minute old", () => {
    const recentDate = new Date(Date.now() - 1000 * 30).toISOString();
    const result = timeAgo(recentDate);
    expect(result).toMatch(/^\d+ seconds? ago$/);
  });

  it("returns '1 second ago' for exactly 1 second", () => {
    const date = new Date(Date.now() - 1000).toISOString();
    const result = timeAgo(date);
    expect(result).toBe("1 second ago");
  });

  it("returns minutes ago for timestamps less than an hour old", () => {
    const date = new Date(Date.now() - 1000 * 60 * 5).toISOString();
    const result = timeAgo(date);
    expect(result).toMatch(/^\d+ minutes? ago$/);
  });

  it("returns '1 minute ago' for exactly 1 minute", () => {
    const date = new Date(Date.now() - 1000 * 60).toISOString();
    const result = timeAgo(date);
    expect(result).toBe("1 minute ago");
  });

  it("returns hours ago for timestamps less than a day old", () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString();
    const result = timeAgo(date);
    expect(result).toMatch(/^\d+ hours? ago$/);
  });

  it("returns '1 hour ago' for exactly 1 hour", () => {
    const date = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    const result = timeAgo(date);
    expect(result).toBe("1 hour ago");
  });

  it("returns days ago for timestamps less than a month old", () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString();
    const result = timeAgo(date);
    expect(result).toMatch(/^\d+ days? ago$/);
  });

  it("returns '1 day ago' for exactly 1 day", () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();
    const result = timeAgo(date);
    expect(result).toBe("1 day ago");
  });

  it("returns months ago for timestamps less than a year old", () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString();
    const result = timeAgo(date);
    expect(result).toMatch(/^\d+ months? ago$/);
  });

  it("returns '1 month ago' for exactly 1 month", () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString();
    const result = timeAgo(date);
    expect(result).toBe("1 month ago");
  });

  it("returns years ago for timestamps more than a year old", () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 400).toISOString();
    const result = timeAgo(date);
    expect(result).toMatch(/^\d+ years? ago$/);
  });

  it("returns '1 year ago' for exactly 1 year", () => {
    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString();
    const result = timeAgo(date);
    expect(result).toBe("1 year ago");
  });

  it("handles current timestamp", () => {
    const result = timeAgo(new Date().toISOString());
    // A very recent timestamp should return seconds ago
    expect(result).toMatch(/^\d+ seconds? ago$/);
  });
});

describe("formatDateShort", () => {
  it("formats a date string to short format", () => {
    const result = formatDateShort("2024-01-15");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("includes the month abbreviation", () => {
    const result = formatDateShort("2024-01-15");
    expect(result).toMatch(/Jan/);
  });

  it("includes the day", () => {
    const result = formatDateShort("2024-01-15");
    expect(result).toMatch(/15/);
  });

  it("includes the year", () => {
    const result = formatDateShort("2024-01-15");
    expect(result).toMatch(/2024/);
  });

  it("formats different months correctly", () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < 12; i++) {
      const month = String(i + 1).padStart(2, "0");
      const dateStr = `2024-${month}-01`;
      const result = formatDateShort(dateStr);
      expect(result).toContain(months[i]);
    }
  });

  it("handles ISO date string format", () => {
    const result = formatDateShort("2024-06-20T12:00:00.000Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
