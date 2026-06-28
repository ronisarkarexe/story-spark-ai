import express, {
  Application,
  NextFunction,
  Request,
  Response,
} from "express";
import helmet from "helmet";
import cors from "cors";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";
import config from "./config";
import { Routers } from "./router";
import globalErrorHandler from "./app/middleware/global.error.handler";
import leaderboardRoute from "./routes/leaderboard.route";
import globalRateLimiter from "./app/middleware/global.rate-limiter";

const app: Application = express();
app.set("trust proxy", 1);
app.use(helmet());

const defaultCorsOrigins =
  process.env.NODE_ENV === "development"
    ? ["http://localhost:4001", "http://localhost:4002"]
    : ["https://storysparkai.vercel.app"];

const corsOrigins =
  config.cors_origins && config.cors_origins.length > 0
    ? config.cors_origins.map((origin) => origin.replace(/\/$/, ""))
    : defaultCorsOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        if (process.env.NODE_ENV === "production") {
          const corsError: any = new Error("Origin header required");
          corsError.statusCode = httpStatus.FORBIDDEN;
          return callback(corsError);
        }

        return callback(null, true);
      }

      if (corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      const corsError: any = new Error(
        "Blocked by Cross-Origin Resource Sharing (CORS) Policy"
      );
      corsError.statusCode = httpStatus.FORBIDDEN;
      return callback(corsError);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Rate limiter — placed after CORS so OPTIONS preflight requests are
// never counted against the limit before CORS has a chance to respond.
app.use(globalRateLimiter);

// ─── 1. FIXED: ENFORCED HARDENED PAYLOAD LIMITS TO PREVENT DoS ───
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

// Legacy Route Rewrite Rewrite Rules
app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    /^\/api\/story\/[a-f0-9]{24}\/character-network$/i.test(req.path)
  ) {
    req.url = req.url.replace(/^\/api\/story\//, "/api/v1/story/");
  }

  next();
});

// Primary API Router Matrix Engagement
app.use("/api/v1/leaderboard", leaderboardRoute);
app.use("/api/v1", Routers);

// ─── 2. FIXED: REFUSED TO SHORT-CIRCUIT, DELEGATING 404 TO NEXT() ───
app.use((req: Request, res: Response, next: NextFunction) => {
  // Constructing a standardized operational error structure
  const error: any = new Error("API Not Found");
  error.statusCode = httpStatus.NOT_FOUND;
  error.errorMessages = [
    {
      path: req.originalUrl,
      message: "The requested API endpoint route does not exist.",
    },
  ];

  // Passing the error downward to the centralized engine
  next(error);
});

// ─── 3. FIXED: REORDERED PIPELINE CALL TO SIT AS ABSOLUTE TERMINATOR ───
app.use(globalErrorHandler);

export default app;
