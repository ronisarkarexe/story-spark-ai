import express, { Application, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import cron from "node-cron";
import cookieParser from "cookie-parser";
import config from "./config";
import { Routers } from "./router";
import globalErrorHandler from "./app/middleware/global.error.handler";
import { User } from "./app/modules/user/user.model";

const app: Application = express();

const defaultCorsOrigins = [
  "http://localhost:4001",
  "http://localhost:4002",
  "http://127.0.0.1:4001",
  "http://127.0.0.1:4002",
  "https://storysparkai.vercel.app",
];
const corsOrigins =
  config.cors_origins && config.cors_origins.length > 0
    ? config.cors_origins
    : defaultCorsOrigins;

// Middleware
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api/v1", Routers);

// Global error handler
app.use(globalErrorHandler);

// Handle API not found
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessage: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
});

// Cron job to reset request counts at the beginning of each month (skip on Vercel serverless)
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
