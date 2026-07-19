import express, { Express, Request, Response } from "express";
import request from "supertest";
import { searchRateLimiter, apiRateLimiter } from "../rateLimit.middleware";

function buildApp(limiter: express.RequestHandler): Express {
  const app = express();
  app.use(limiter);
  app.get("/test", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
  });
  return app;
}

describe("searchRateLimiter", () => {
  let app: Express;

  beforeEach(() => {
    app = buildApp(searchRateLimiter);
  });

  it("allows a request within the limit and sets standard rate-limit headers", async () => {
    const res = await request(app).get("/test");

    expect(res.status).toBe(200);
    expect(res.headers["ratelimit-limit"]).toBe("30");
    expect(res.headers["ratelimit-remaining"]).toBeDefined();
    // legacyHeaders is false, so X-RateLimit-* should NOT be present
    expect(res.headers["x-ratelimit-limit"]).toBeUndefined();
  });

  it("blocks the 31st request from the same IP within the 1-minute window", async () => {
    for (let i = 0; i < 30; i++) {
      await request(app).get("/test");
    }
    const res = await request(app).get("/test");

    expect(res.status).toBe(429);
    expect(res.text).toContain("Too many search requests");
  });

  it("uses the first IP in x-forwarded-for as the rate limit key", async () => {
    const forwardedIp = "203.0.113.5, 70.41.3.18";

    for (let i = 0; i < 30; i++) {
      await request(app).get("/test").set("x-forwarded-for", forwardedIp);
    }
    const blocked = await request(app).get("/test").set("x-forwarded-for", forwardedIp);
    expect(blocked.status).toBe(429);

    // A different forwarded IP should have its own separate limit
    const allowed = await request(app).get("/test").set("x-forwarded-for", "198.51.100.7");
    expect(allowed.status).toBe(200);
  });
});

describe("apiRateLimiter", () => {
  let app: Express;

  beforeEach(() => {
    app = buildApp(apiRateLimiter);
  });

  it("allows a request within the limit and sets standard rate-limit headers", async () => {
    const res = await request(app).get("/test");

    expect(res.status).toBe(200);
    expect(res.headers["ratelimit-limit"]).toBe("100");
  });

  it("blocks the 101st request from the same IP within the 15-minute window", async () => {
    for (let i = 0; i < 100; i++) {
      await request(app).get("/test");
    }
    const res = await request(app).get("/test");

    expect(res.status).toBe(429);
    expect(res.text).toContain("Too many requests from this IP");
  }, 20000); // longer timeout since 100 sequential requests take time
});