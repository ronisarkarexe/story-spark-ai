/**
 * Test the DisabledRedisClient fallback class.
 * When REDIS_URL is not set, the module exports a DisabledRedisClient
 * that gracefully degrades instead of crashing.
 */

// Mock process.env before importing redis.client
const originalEnv = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv, REDIS_URL: "" };
});

afterAll(() => {
  process.env = originalEnv;
});

describe("DisabledRedisClient", () => {
  it("returns null on get()", async () => {
    const { default: redis } = await import("../redis.client");
    const result = await redis.get("any-key");
    expect(result).toBeNull();
  });

  it("returns 'OK' on set()", async () => {
    const { default: redis } = await import("../redis.client");
    const result = await redis.set("key", "value");
    expect(result).toBe("OK");
  });

  it("returns 0 on del()", async () => {
    const { default: redis } = await import("../redis.client");
    const result = await redis.del("any-key");
    expect(result).toBe(0);
  });

  it("returns 0 on incrby()", async () => {
    const { default: redis } = await import("../redis.client");
    const result = await redis.incrby("counter", 1);
    expect(result).toBe(0);
  });

  it("returns 0 on expire()", async () => {
    const { default: redis } = await import("../redis.client");
    const result = await redis.expire("key", 60);
    expect(result).toBe(0);
  });

  it("on() returns this for chainability", async () => {
    const { default: redis } = await import("../redis.client");
    const result = redis.on("ready", () => {});
    expect(result).toBe(redis);
  });

  it("status is 'end' indicating disabled state", async () => {
    const { default: redis } = await import("../redis.client");
    expect(redis.status).toBe("end");
  });
});
