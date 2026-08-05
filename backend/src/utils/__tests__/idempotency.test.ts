// Use jest.resetModules + jest.isolateModules to ensure each test suite
// gets a fresh activeRequests Map (module-level singleton).
beforeEach(() => {
  jest.resetModules();
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2025-01-01T00:00:00Z"));
});

afterEach(() => {
  jest.useRealTimers();
});

describe("checkAndTrackRequest", () => {
  let checkAndTrackRequest: (userId: string, body: any) => boolean;

  beforeEach(() => {
    // Re-import inside each test suite to get a fresh module
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      ({ checkAndTrackRequest } = require("../../utils/idempotency"));
    });
  });

  it("returns true on first call for a new userId and payload", () => {
    const result = checkAndTrackRequest("user-1", { data: "test" });
    expect(result).toBe(true);
  });

  it("returns false within the 10s deduplication window for the same payload", () => {
    checkAndTrackRequest("user-1", { data: "test" });
    const result = checkAndTrackRequest("user-1", { data: "test" });
    expect(result).toBe(false);
  });

  it("returns true after the deduplication window expires", () => {
    checkAndTrackRequest("user-1", { data: "test" });
    jest.advanceTimersByTime(10001);
    const result = checkAndTrackRequest("user-1", { data: "test" });
    expect(result).toBe(true);
  });

  it("treats different payloads as separate requests", () => {
    checkAndTrackRequest("user-1", { data: "test1" });
    const result = checkAndTrackRequest("user-1", { data: "test2" });
    expect(result).toBe(true);
  });

  it("treats different users with the same payload as separate requests", () => {
    checkAndTrackRequest("user-1", { data: "test" });
    const result = checkAndTrackRequest("user-2", { data: "test" });
    expect(result).toBe(true);
  });

  it("handles null body as valid payload", () => {
    const result = checkAndTrackRequest("user-1", null);
    expect(result).toBe(true);
  });

  it("handles undefined body as valid payload", () => {
    const result = checkAndTrackRequest("user-1", undefined);
    expect(result).toBe(true);
  });
});

describe("releaseRequest", () => {
  let checkAndTrackRequest: (userId: string, body: any) => boolean;
  let releaseRequest: (userId: string, body: any) => void;

  beforeEach(() => {
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require("../../utils/idempotency");
      checkAndTrackRequest = mod.checkAndTrackRequest;
      releaseRequest = mod.releaseRequest;
    });
  });

  it("allows a new request after manual release", () => {
    checkAndTrackRequest("user-1", { data: "test" });
    releaseRequest("user-1", { data: "test" });
    const result = checkAndTrackRequest("user-1", { data: "test" });
    expect(result).toBe(true);
  });

  it("does not affect other payloads for the same user when releasing one", () => {
    checkAndTrackRequest("user-1", { data: "test1" });
    releaseRequest("user-1", { data: "test1" });
    const result = checkAndTrackRequest("user-1", { data: "test2" });
    expect(result).toBe(true);
  });
});
