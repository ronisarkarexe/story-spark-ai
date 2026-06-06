/**
 * storyRequestQueue.ts
 * ────────────────────
 * Async FIFO queue for AI story-generation requests.
 *
 * Prevents thundering-herd overload when many users submit
 * story prompts simultaneously. Caps concurrent AI API calls
 * to AI_CONCURRENCY (default 3) regardless of HTTP traffic.
 *
 * Usage:
 *   import { storyQueue } from "./storyRequestQueue";
 *   const result = await storyQueue.enqueue(() => callAiApi(prompt));
 *
 * GSSoC 2026 | feat/rate-limiting-api-key-rotation
 */

type Task<T> = () => Promise<T>;

interface QueueStats {
  waiting   : number;
  active    : number;
  concurrency: number;
}

class StoryRequestQueue {
  private readonly _concurrency : number;
  private _running              : number = 0;
  private readonly _queue       : Array<() => void> = [];

  constructor(concurrency: number = 3) {
    if (concurrency < 1) throw new RangeError("concurrency must be >= 1");
    this._concurrency = concurrency;
  }

  /**
   * Enqueue a task. Returns a Promise that resolves/rejects
   * when the task completes execution.
   */
  enqueue<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const run = async (): Promise<void> => {
        this._running++;
        try {
          resolve(await task());
        } catch (err) {
          reject(err);
        } finally {
          this._running--;
          this._next();
        }
      };

      if (this._running < this._concurrency) {
        run();
      } else {
        this._queue.push(run);
      }
    });
  }

  private _next(): void {
    if (this._queue.length > 0 && this._running < this._concurrency) {
      const next = this._queue.shift()!;
      next();
    }
  }

  /** Live queue statistics */
  stats(): QueueStats {
    return {
      waiting    : this._queue.length,
      active     : this._running,
      concurrency: this._concurrency,
    };
  }

  get size()   : number { return this._queue.length; }
  get active() : number { return this._running; }
}

/**
 * Singleton queue shared across all route handlers.
 * Concurrency controlled by AI_CONCURRENCY env var (default 3).
 */
export const storyQueue = new StoryRequestQueue(
  Math.max(1, Number(process.env.AI_CONCURRENCY ?? 3))
);
