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
import ApiError from "./errors/api_error";

const app: Application = express();
app.set("trust proxy", 1);
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
      if (!origin || corsOrigins.includes(origin)) {
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

// Payload limit set to 10mb to support large story content and
// character network data without triggering 413 errors.
// Previously used Express default (100kb) which was too restrictive.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser() as unknown as RequestHandler);

app.use("/api/v1", Routers);

app.use((req: Request, _res: Response, next: NextFunction) => {
  const error = new ApiError(httpStatus.NOT_FOUND, "API Not Found");
  error.errorMessages = [
    {
      path: req.originalUrl,
      message: "The requested API endpoint route does not exist.",
    },
  ];
  next(error);
});

app.use(globalErrorHandler);

export default app;
export { defaultCorsOrigins };
