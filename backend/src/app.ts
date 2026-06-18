import express, {
  Application,
  NextFunction,
  Request,
  Response,
} from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";
import config from "./config";
import { Routers } from "./router";
import globalErrorHandler from "./app/middleware/global.error.handler";

const app: Application = express();
app.set("trust proxy", 1);
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

app.use(limiter);

const defaultCorsOrigins =
  process.env.NODE_ENV === "development"
    ? ["http://localhost:4001", "http://localhost:4002"]
    : [
        "https://storysparkai.vercel.app",
        "https://www.storysparkai.vercel.app",
      ];

const corsOrigins =
  config.cors_origins && config.cors_origins.length > 0
    ? config.cors_origins
    : defaultCorsOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
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

// ─── 1. FIXED: ENFORCED HARDENED PAYLOAD LIMITS TO PREVENT DoS ───
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

// Legacy Route Rewrite Rewrite Rules
app.use((req, res, next) => {
  if (req.method === "GET" && /^\/api\/story\/[a-f0-9]{24}\/character-network$/i.test(req.path)) {
    req.url = req.url.replace(/^\/api\/story\//, "/api/v1/story/");
  }
  next();
});

// Primary API Router Matrix Engagement
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
