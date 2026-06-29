import {
  getISTTimeFormate,
  timeAgo,
  formatDateShort,
} from "../time-formate";

describe("getISTTimeFormate", () => {
  it("returns a non-empty formatted string for a valid timestamp", () => {
    const result = getISTTimeFormate(Date.now() + 60_000);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("includes a timezone indicator in the output", () => {
    const result = getISTTimeFormate(Date.now());
    // Intl.DateTimeFormat with timeZoneName:"short" should produce something like "IST"
    expect(result).toMatch(/[A-Z]{2,5}/);
  });
});

describe("timeAgo", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-06-20T12:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns 'just now' for future timestamps", () => {
    const future = new Date("2026-06-20T13:00:00.000Z").toISOString();
    expect(timeAgo(future)).toBe("just now");
  });

  it("returns '1 second ago' for exactly 1 second in the past", () => {
    const oneSecondAgo = new Date(Date.now() - 1_000).toISOString();
    expect(timeAgo(oneSecondAgo)).toBe("1 second ago");
  });

  it("returns 'X seconds ago' for multiple seconds in the past", () => {
    const tenSecondsAgo = new Date(Date.now() - 10_000).toISOString();
    expect(timeAgo(tenSecondsAgo)).toBe("10 seconds ago");
  });

  it("returns '1 minute ago' for exactly 1 minute in the past", () => {
    const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
    expect(timeAgo(oneMinuteAgo)).toBe("1 minute ago");
  });

  it("returns 'X minutes ago' for multiple minutes in the past", () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60_000).toISOString();
    expect(timeAgo(fiveMinutesAgo)).toBe("5 minutes ago");
  });

  it("returns '1 hour ago' for exactly 1 hour in the past", () => {
    const oneHourAgo = new Date(Date.now() - 3_600_000).toISOString();
    expect(timeAgo(oneHourAgo)).toBe("1 hour ago");
  });

  it("returns 'X hours ago' for multiple hours in the past", () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3_600_000).toISOString();
    expect(timeAgo(threeHoursAgo)).toBe("3 hours ago");
  });

  it("returns '1 day ago' for exactly 1 day in the past", () => {
    const oneDayAgo = new Date(Date.now() - 86_400_000).toISOString();
    expect(timeAgo(oneDayAgo)).toBe("1 day ago");
  });

  it("returns 'X days ago' for multiple days in the past", () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 86_400_000).toISOString();
    expect(timeAgo(tenDaysAgo)).toBe("10 days ago");
  });

  it("returns '1 month ago' for approximately 1 month in the past", () => {
    const oneMonthAgo = new Date(Date.now() - 30 * 86_400_000).toISOString();
    expect(timeAgo(oneMonthAgo)).toBe("1 month ago");
  });

  it("returns 'X months ago' for multiple months in the past", () => {
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 86_400_000).toISOString();
    expect(timeAgo(sixMonthsAgo)).toBe("6 months ago");
  });

  it("returns '1 year ago' for approximately 1 year in the past", () => {
    const oneYearAgo = new Date(Date.now() - 365 * 86_400_000).toISOString();
    expect(timeAgo(oneYearAgo)).toBe("1 year ago");
  });

  it("returns 'X years ago' for multiple years in the past", () => {
    const threeYearsAgo = new Date(Date.now() - 3 * 365 * 86_400_000).toISOString();
    expect(timeAgo(threeYearsAgo)).toBe("3 years ago");
  });
});

describe("formatDateShort", () => {
  it("formats a date string into short date format", () => {
    const result = formatDateShort("2026-06-20T00:00:00.000Z");
    expect(typeof result).toBe("string");
    expect(result).toMatch(/2026/);
  });

  it("produces consistent output for the same date", () => {
    const date = "2026-01-15T00:00:00.000Z";
    const result1 = formatDateShort(date);
    const result2 = formatDateShort(date);
    expect(result1).toBe(result2);
  });

  it("handles a date string with time component", () => {
    const result = formatDateShort("2026-06-20T15:30:00.000Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
