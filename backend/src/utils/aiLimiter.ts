// backend/src/utils/aiLimiter.ts
const rawConcurrency = parseInt(process.env.AI_CONCURRENCY ?? "3", 10);

// Guard: clamp between 1 and 10
const concurrency = Math.min(Math.max(rawConcurrency || 1, 1), 10);

class ConcurrencyLimiter {
  private queue: Array<() => void> = [];
  public activeCount = 0;
  public get pendingCount() {
    return this.queue.length;
  }

  constructor(private limit: number) {}

  async run<T>(fn: () => Promise<T> | T): Promise<T> {
    if (this.activeCount >= this.limit) {
      await new Promise<void>((resolve) => this.queue.push(resolve));
    }
    this.activeCount++;
    try {
      return await fn();
    } finally {
      this.activeCount--;
      const next = this.queue.shift();
      if (next) {
        next();
      }
    }
  }
}

const limiter = new ConcurrencyLimiter(concurrency);

export const aiLimit = Object.assign(
  <T>(fn: () => Promise<T> | T): Promise<T> => limiter.run(fn),
  {
    get activeCount() {
      return limiter.activeCount;
    },
    get pendingCount() {
      return limiter.pendingCount;
    },
  }
);

export const getAIConcurrencyStats = () => ({
  concurrencyLimit: concurrency,
  activeCount: limiter.activeCount,
  pendingCount: limiter.pendingCount,
});