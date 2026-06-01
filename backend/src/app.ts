import express, { Application, NextFunction, Request, Response, RequestHandler } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import cron from "node-cron";
import cookieParser from "cookie-parser";
import config from "./config";
import { Routers } from "./router";
import globalErrorHandler from "./app/middleware/global.error.handler";
import { User } from "./app/modules/user/user.model";
import { NewsletterSubscriber } from "./app/modules/newsletter/newsletter.model";
import storyRoutes from "./routes/story.routes";

const app: Application = express();

const app: Application = express();
app.set("trust proxy", 1); // Trust first proxy to securely read req.ip
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later."
});

app.use(limiter as any);



const defaultCorsOrigins = [
  "http://localhost:4001",
  "http://localhost:4002",
  "https://storysparkai-five.vercel.app",
];

const corsOrigins =
  config.cors_origins && config.cors_origins.length > 0
    ? config.cors_origins
    : defaultCorsOrigins;

// ── CORS MIDDLEWARE ──
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

// ✅ FIX: BODY PARSERS MUST COME BEFORE ROUTES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Keeps your extended payload parsing enabled
app.use(cookieParser() as any);


app.use(cookieParser() as unknown as RequestHandler);

// ── ROUTES ──
app.use("/review", storyRoutes);
app.use("/api/v1", Routers);

// ── 404 HANDLER ──
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
      path: req.originalUrl,
      message: "API Not Found",
      },
    ],
  });
});

// ── GLOBAL ERROR HANDLER ──
app.use(globalErrorHandler);

// ── CRON JOB ──
if (!process.env.VERCEL) {
  cron.schedule("0 0 1 * *", async () => {
    try {
      await User.updateMany({}, { $set: { requestsThisMonth: 0 } });
    } catch (error) {
      console.error("Failed to reset request counts:", error);
    }
  });
}

export default app;