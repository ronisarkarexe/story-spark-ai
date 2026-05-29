import express, { Application } from "express";
import cors from "cors";
import httpStatus from "http-status";
import cron from "node-cron";
import cookieParser from "cookie-parser";
import config from "./config";
import { Routers } from "./router";
import globalErrorHandler from "./app/middleware/global.error.handler";
import { User } from "./app/modules/user/user.model";
import storyRoutes from "./routes/story.routes";

const app: Application = express();

app.set("trust proxy", 1); // Trust first proxy to securely read req.ip

const defaultCorsOrigins = [
  "http://localhost:4001",
  "http://localhost:4002",
  "https://storysparkai.vercel.app",
];

const corsOrigins =
  config.cors_origins && config.cors_origins.length > 0
    ? config.cors_origins
    : defaultCorsOrigins;

// FIXED CORS MIDDLEWARE ENGINE
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

app.use("/review", storyRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// Routes
app.use("/api/v1", Routers);

// Global 404 Fallback Handler (Switched to app.all to bypass the strict app.use routing overload bug)
app.all("*", (req: any, res: any) => {
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

app.use(globalErrorHandler);

// Cron job to reset request counts at the beginning of each month
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