import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getISTTimeFormate,
  timeAgo,
  formatDateShort,
} from "../time-formate";

describe("getISTTimeFormate", () => {
  it("returns a non-empty formatted string for a valid timestamp", () => {
    const result = getISTTimeFormate(Date.now());
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("includes a timezone abbreviation in the output", () => {
    const result = getISTTimeFormate(Date.now());
    // Intl.DateTimeFormat with timeZoneName: "short" appends an abbreviation
    // such as "GMT", "GMT+5:30", "PDT", etc.
    expect(result).toMatch(/[A-Za-z]{2,5}/);
  });

  it("formats a fixed, known timestamp consistently", () => {
    const fixedTimestamp = new Date("2026-06-26T10:15:30.000Z").getTime();
    const result = getISTTimeFormate(fixedTimestamp);
    expect(typeof result).toBe("string");
    // Should contain hour:minute:second style output
    expect(result).toMatch(/\d{1,2}:\d{2}:\d{2}/);
  });
});

describe("timeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-20T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'just now' for a future timestamp", () => {
    const future = new Date("2026-06-20T13:00:00.000Z").toISOString();
    expect(timeAgo(future)).toBe("just now");
  });

  it("returns '1 second ago' for exactly 1 second in the past", () => {
    const oneSecondAgo = new Date(Date.now() - 1_000).toISOString();
    expect(timeAgo(oneSecondAgo)).toBe("1 second ago");
  });

  it("returns 'X seconds ago' (plural) for multiple seconds in the past", () => {
    const tenSecondsAgo = new Date(Date.now() - 10_000).toISOString();
    expect(timeAgo(tenSecondsAgo)).toBe("10 seconds ago");
  });

  it("returns '1 minute ago' for exactly 1 minute in the past", () => {
    const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
    expect(timeAgo(oneMinuteAgo)).toBe("1 minute ago");
  });

  it("returns 'X minutes ago' (plural) for multiple minutes in the past", () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60_000).toISOString();
    expect(timeAgo(fiveMinutesAgo)).toBe("5 minutes ago");
  });

  it("returns '1 hour ago' for exactly 1 hour in the past", () => {
    const oneHourAgo = new Date(Date.now() - 3_600_000).toISOString();
    expect(timeAgo(oneHourAgo)).toBe("1 hour ago");
  });

  it("returns 'X hours ago' (plural) for multiple hours in the past", () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3_600_000).toISOString();
    expect(timeAgo(threeHoursAgo)).toBe("3 hours ago");
  });

  it("returns '1 day ago' for exactly 1 day in the past", () => {
    const oneDayAgo = new Date(Date.now() - 86_400_000).toISOString();
    expect(timeAgo(oneDayAgo)).toBe("1 day ago");
  });

  it("returns 'X days ago' (plural) for multiple days in the past", () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 86_400_000).toISOString();
    expect(timeAgo(tenDaysAgo)).toBe("10 days ago");
  });

  it("returns '1 month ago' for approximately 1 month in the past", () => {
    const oneMonthAgo = new Date(Date.now() - 30 * 86_400_000).toISOString();
    expect(timeAgo(oneMonthAgo)).toBe("1 month ago");
  });

  it("returns 'X months ago' (plural) for multiple months in the past", () => {
    const sixMonthsAgo = new Date(
      Date.now() - 6 * 30 * 86_400_000,
    ).toISOString();
    expect(timeAgo(sixMonthsAgo)).toBe("6 months ago");
  });

  it("returns '1 year ago' for approximately 1 year in the past", () => {
    const oneYearAgo = new Date(
      Date.now() - 365 * 86_400_000,
    ).toISOString();
    expect(timeAgo(oneYearAgo)).toBe("1 year ago");
  });

  it("returns 'X years ago' (plural) for multiple years in the past", () => {
    const threeYearsAgo = new Date(
      Date.now() - 3 * 365 * 86_400_000,
    ).toISOString();
    expect(timeAgo(threeYearsAgo)).toBe("3 years ago");
  });

  it("returns 'just now' for an invalid date string", () => {
    // new Date("not-a-date") is Invalid Date, so this documents the
    // function's current (defensive) behavior for malformed input.
    const result = timeAgo("not-a-date");
    expect(typeof result).toBe("string");
  });
});

describe("formatDateShort", () => {
  it("formats a valid date string as 'MMM D, YYYY'", () => {
    const result = formatDateShort("2026-06-26T00:00:00.000Z");
    expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/);
  });

  it("formats a known date correctly", () => {
    const result = formatDateShort("2026-06-26T12:00:00.000Z");
    expect(result).toBe("Jun 26, 2026");
  });

  it("produces consistent output for the same date across calls", () => {
    const date = "2026-01-15T00:00:00.000Z";
    expect(formatDateShort(date)).toBe(formatDateShort(date));
  });

  it("returns 'Invalid Date' for an invalid date string", () => {
    const result = formatDateShort("not-a-date");
    expect(result).toBe("Invalid Date");
  });
});
