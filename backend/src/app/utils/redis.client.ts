import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  retryStrategy(times: number) {
    const delay = Math.min(times * 100, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  reconnectOnError(err: Error) {
    return false;
  },
});

redis.on("ready", () => {
  // Redis is available and ready to serve commands.
});

redis.on("error", (err: Error) => {
  if (err && (err as any).code === "ECONNREFUSED") {
    // Redis is not running. Caching will be skipped until the connection recovers.
    return;
  }
  // Optional: Only log non-ECONNREFUSED errors
});

export default redis;