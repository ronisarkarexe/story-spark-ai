// backend/src/__tests__/aiLimiter.test.ts
import { aiLimit, getAIConcurrencyStats } from "../utils/aiLimiter";

describe("aiLimiter", () => {
  it("should export aiLimit as a function", () => {
    expect(typeof aiLimit).toBe("function");
  });

  it("should run a task and return its result", async () => {
    const result = await aiLimit(() => Promise.resolve(42));
    expect(result).toBe(42);
  });

  it("should enforce concurrency limit", async () => {
    let active = 0;
    let maxActive = 0;

    const task = () =>
      aiLimit(async () => {
        active++;
        maxActive = Math.max(maxActive, active);
        await new Promise((res) => setTimeout(res, 20));
        active--;
      });

    await Promise.all(Array.from({ length: 10 }, task));
    expect(maxActive).toBeLessThanOrEqual(getAIConcurrencyStats().concurrencyLimit);
  });

  it("should propagate errors from tasks", async () => {
    await expect(
      aiLimit(() => Promise.reject(new Error("AI failed")))
    ).rejects.toThrow("AI failed");
  });

  it("should clamp AI_CONCURRENCY between 1 and 10", () => {
    const { concurrencyLimit } = getAIConcurrencyStats();
    expect(concurrencyLimit).toBeGreaterThanOrEqual(1);
    expect(concurrencyLimit).toBeLessThanOrEqual(10);
  });

  it("should report activeCount and pendingCount as numbers", () => {
    const stats = getAIConcurrencyStats();
    expect(typeof stats.activeCount).toBe("number");
    expect(typeof stats.pendingCount).toBe("number");
  });
});