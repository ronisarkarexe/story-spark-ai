import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    // Try reconnecting after 15 seconds instead of spamming every second
    return 15000;
  },
});

let hasLoggedError = false;
redis.on("error", (err) => {
  if (!hasLoggedError) {
    console.warn("⚠️ Redis connection refused. StorySparkAI backend will fallback to database directly.");
    hasLoggedError = true;
  }
});

redis.on("connect", () => {
  console.log("✨ Connected to Redis successfully!");
  hasLoggedError = false;
});

export default redis;
