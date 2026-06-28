import Redis from "ioredis";

type RedisLike = {
  status: string;
  on: (event: string, listener: (...args: any[]) => void) => RedisLike;
  get: (key: string) => Promise<string | null>;
  set: (...args: unknown[]) => Promise<unknown>;
  del: (...args: unknown[]) => Promise<unknown>;
  incrby: (...args: unknown[]) => Promise<unknown>;
  expire: (...args: unknown[]) => Promise<unknown>;
};

class DisabledRedisClient implements RedisLike {
  status = "end";

  on() {
    return this;
  }

  async get() {
    return null;
  }

  async set() {
    return "OK";
  }

  async del() {
    return 0;
  }

  async incrby() {
    return 0;
  }

  async expire() {
    return 0;
  }
}

const redisUrl = process.env.REDIS_URL?.trim();
const redis: RedisLike = redisUrl
  ? (new Redis(redisUrl, {
      retryStrategy(times: number) {
        const delay = Math.min(times * 100, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      reconnectOnError(err: Error) {
        return err?.message?.includes("ECONNREFUSED") ?? false;
      },
    }) as unknown as RedisLike)
  : new DisabledRedisClient();

if (redisUrl) {
  redis.on("ready", () => {
    // Redis is available and ready to serve commands.
  });

  redis.on("error", (err: Error) => {
    if (err && (err as any).code === "ECONNREFUSED") {
      // Redis is not running. Caching will be skipped until the connection recovers.
      return;
    }
    console.error("Redis Error:", err);
  });
}

export default redis;
