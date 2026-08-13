
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

// Trust the proxy only when the application is running in production.
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

export const defaultCorsOrigins: string[] = [
  "http://localhost:4001",
  "http://localhost:4002",
  "https://storysparkai-five.vercel.app",
  "https://storysparkai.vercel.app",
];

const corsOrigins =
  config.cors_origins?.length
    ? config.cors_origins
    : defaultCorsOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      const isMissingOrigin = !origin;

      // Requests without an Origin header are allowed.
      if (isMissingOrigin) {
        return callback(null, true);
      }

      const isAllowedOrigin = corsOrigins.includes(origin);

      if (isAllowedOrigin) {
        return callback(null, true);
      }

      return callback(
        new Error("Blocked by Cross-Origin Resource Sharing (CORS) Policy")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Cookie",
    ],
  })
);

// Apply the global rate limiter after CORS handling.
app.use(globalRateLimiter);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser() as unknown as RequestHandler);

app.use(sanitizeAllMiddleware);

// Global sanitization for request bodies and query parameters.
app.use(sanitizeAllMiddleware);

app.use((req, res, next) => {
  const isCharacterNetworkRequest =
    req.method === "GET" &&
    /^\/api\/story\/[a-f0-9]{24}\/character-network$/i.test(req.path);

  if (isCharacterNetworkRequest) {
    req.url = req.url.replace(
      /^\/api\/story\//,
      "/api/v1/story/"
    );
  }

  next();
});

// Allow larger payloads for story and character-network data.
app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser() as unknown as RequestHandler);

app.use("/api/v1", Routers);

app.use(
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const errorMessage =
      `The requested API endpoint route does not exist: ${req.originalUrl}`;

    next(
      new ApiError(
        httpStatus.NOT_FOUND,
        errorMessage
      )
    );
  }
);

app.use(globalErrorHandler);

export default app;
