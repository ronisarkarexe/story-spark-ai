/**
 * time-formate.test.ts
 * Unit tests for the time-formate utility functions.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getISTTimeFormate,
  timeAgo,
  formatDateShort,
} from "../time-formate";

describe("getISTTimeFormate", () => {
  it("returns a string for a valid timestamp", () => {
    const result = getISTTimeFormate(Date.now());
    expect(typeof result).toBe("string");
  });

  it("includes timezone information in the formatted string", () => {
    const result = getISTTimeFormate(Date.now());
    // The Intl.DateTimeFormat with timeZoneName should include a timezone abbreviation
    expect(result).toMatch(/[A-Z]{2,5}/);
  });

  it("returns a non-empty string", () => {
    const result = getISTTimeFormate(Date.now());
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("timeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "just now" for future timestamps', () => {
    const future = new Date("2024-06-15T12:00:01.000Z").toISOString();
    const result = timeAgo(future);
    expect(result).toBe("just now");
  });

  it("returns correct singular form for 1 second", () => {
    const oneSecAgo = new Date("2024-06-15T11:59:59.000Z").toISOString();
    const result = timeAgo(oneSecAgo);
    expect(result).toBe("1 second ago");
  });

  it("returns correct plural form for multiple seconds", () => {
    const fiveSecAgo = new Date("2024-06-15T11:59:55.000Z").toISOString();
    const result = timeAgo(fiveSecAgo);
    expect(result).toBe("5 seconds ago");
  });

  it("returns correct singular form for 1 minute", () => {
    const oneMinAgo = new Date("2024-06-15T11:59:00.000Z").toISOString();
    const result = timeAgo(oneMinAgo);
    expect(result).toBe("1 minute ago");
  });

  it("returns correct plural form for multiple minutes", () => {
    const threeMinAgo = new Date("2024-06-15T11:57:00.000Z").toISOString();
    const result = timeAgo(threeMinAgo);
    expect(result).toBe("3 minutes ago");
  });

  it("returns correct singular form for 1 hour", () => {
    const oneHourAgo = new Date("2024-06-15T11:00:00.000Z").toISOString();
    const result = timeAgo(oneHourAgo);
    expect(result).toBe("1 hour ago");
  });

  it("returns correct plural form for multiple hours", () => {
    const fourHourAgo = new Date("2024-06-15T08:00:00.000Z").toISOString();
    const result = timeAgo(fourHourAgo);
    expect(result).toBe("4 hours ago");
  });

  it("returns correct singular form for 1 day", () => {
    const oneDayAgo = new Date("2024-06-14T12:00:00.000Z").toISOString();
    const result = timeAgo(oneDayAgo);
    expect(result).toBe("1 day ago");
  });

  it("returns correct plural form for multiple days", () => {
    const sevenDayAgo = new Date("2024-06-08T12:00:00.000Z").toISOString();
    const result = timeAgo(sevenDayAgo);
    expect(result).toBe("7 days ago");
  });

  it("returns correct singular form for 1 month", () => {
    const oneMonthAgo = new Date("2024-05-15T12:00:00.000Z").toISOString();
    const result = timeAgo(oneMonthAgo);
    expect(result).toBe("1 month ago");
  });

  it("returns correct plural form for multiple months", () => {
    const threeMonthsAgo = new Date("2024-03-15T12:00:00.000Z").toISOString();
    const result = timeAgo(threeMonthsAgo);
    expect(result).toBe("3 months ago");
  });

  it("returns correct singular form for 1 year", () => {
    const oneYearAgo = new Date("2023-06-15T12:00:00.000Z").toISOString();
    const result = timeAgo(oneYearAgo);
    expect(result).toBe("1 year ago");
  });

  it("returns correct plural form for multiple years", () => {
    const twoYearsAgo = new Date("2022-06-15T12:00:00.000Z").toISOString();
    const result = timeAgo(twoYearsAgo);
    expect(result).toBe("2 years ago");
  });
});

describe("formatDateShort", () => {
  it("returns a non-empty string", () => {
    const result = formatDateShort("2024-01-15T12:00:00.000Z");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns a string type", () => {
    const result = formatDateShort("2024-06-15T12:00:00.000Z");
    expect(typeof result).toBe("string");
  });

  it("returns a formatted date string for a known date", () => {
    const result = formatDateShort("2024-01-01T00:00:00.000Z");
    // Should contain "Jan" and "2024"
    expect(result).toContain("Jan");
    expect(result).toContain("2024");
  });

  it("handles a date with no time component", () => {
    const result = formatDateShort("2024-12-25");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
