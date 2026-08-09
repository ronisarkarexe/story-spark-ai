import express, {
  Application,
  NextFunction,
  Request,
  Response,
  RequestHandler,
} from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import httpStatus from "http-status";

import cookieParser from "cookie-parser";
import config from "./config";
import { Routers } from "./router";
import globalErrorHandler from "./app/middleware/global.error.handler";
import leaderboardRoute from "./routes/leaderboard.route";
import globalRateLimiter from "./app/middleware/global.rate-limiter";
import { sanitizeAllMiddleware } from "./app/middleware/sanitize.middleware";
import ApiError from "./errors/api_error";


const app: Application = express();
// Only trust the proxy in production, where we're actually behind a real
// reverse proxy. In dev there's no real proxy in front of us, so trusting
// X-Forwarded-For would let a client spoof its own IP and bypass rate limiting.
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use(limiter as unknown as RequestHandler);

export const defaultCorsOrigins = [
  "http://localhost:4001",
  "http://localhost:4002",
  "https://storysparkai-five.vercel.app",
  "https://storysparkai.vercel.app",
];

const corsOrigins =
  config.cors_origins && config.cors_origins.length > 0
    ? config.cors_origins
    : defaultCorsOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(new Error("Origin header required"));
        return;
      }
      if (corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by Cross-Origin Resource Sharing (CORS) Policy"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cookie"],
  })
);

// Rate limiter — placed after CORS so OPTIONS preflight requests are
// never counted against the limit before CORS has a chance to respond.
app.use(globalRateLimiter);

// Payload limit set to 10mb to support large story content and character
// network data without triggering 413 errors. Previously 2mb, which was
// too restrictive for real story payloads — see PR discussion if this
// needs revisiting against DoS-hardening concerns.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser() as unknown as RequestHandler);

// Global XSS sanitization for all incoming request bodies and query parameters.
app.use(sanitizeAllMiddleware);


app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    /^\/api\/story\/[a-f0-9]{24}\/character-network$/i.test(req.path)
  ) {
    req.url = req.url.replace(/^\/api\/story\//, "/api/v1/story/");
  }
  next();
});


app.use("/api/v1", Routers);

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(
    new ApiError(
      httpStatus.NOT_FOUND,
      `The requested API endpoint route does not exist: ${req.originalUrl}`
    )
  );
});
app.use(globalErrorHandler);


export default app;