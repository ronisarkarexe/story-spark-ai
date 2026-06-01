"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyQueue = void 0;
class StoryRequestQueue {
    constructor(concurrency = 3) {
        this._running = 0;
        this._queue = [];
        if (concurrency < 1)
            throw new RangeError("concurrency must be >= 1");
        this._concurrency = concurrency;
    }
    /**
     * Enqueue a task. Returns a Promise that resolves/rejects
     * when the task completes execution.
     */
    enqueue(task) {
        return new Promise((resolve, reject) => {
            const run = () => __awaiter(this, void 0, void 0, function* () {
                this._running++;
                try {
                    resolve(yield task());
                }
                catch (err) {
                    reject(err);
                }
                finally {
                    this._running--;
                    this._next();
                }
            });
            if (this._running < this._concurrency) {
                run();
            }
            else {
                this._queue.push(run);
            }
        });
    }
    _next() {
        if (this._queue.length > 0 && this._running < this._concurrency) {
            const next = this._queue.shift();
            next();
        }
    }
    /** Live queue statistics */
    stats() {
        return {
            waiting: this._queue.length,
            active: this._running,
            concurrency: this._concurrency,
        };
    }
    get size() { return this._queue.length; }
    get active() { return this._running; }
}
/**
 * Singleton queue shared across all route handlers.
 * Concurrency controlled by AI_CONCURRENCY env var (default 3).
 */
exports.storyQueue = new StoryRequestQueue(Math.max(1, Number((_a = process.env.AI_CONCURRENCY) !== null && _a !== void 0 ? _a : 3)));
