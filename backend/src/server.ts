import { Application, Request, Response } from "express";
import mongoose from "mongoose";
import config from "./config";
import app from "./app";
import dns from "node:dns";
import http from "http";
import { Server } from "socket.io";
import { JwtHelpers } from "./utils/jwt.helper";
import { Secret } from "jsonwebtoken";
import logger from "./utils/logger.util";

// Override DNS resolvers only when explicitly configured; default to the platform resolver.
if (config.dns_servers?.length) {
  dns.setServers(config.dns_servers);
}

if (config.disable_logs) {
  // Silence only verbose channels; keep warn/error so failures stay visible in logs.
  const noop = () => undefined;
  console.log = noop;
  console.info = noop;
  console.debug = noop;
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  // config.database_url is guaranteed non-empty by config/index.ts — it throws at
  // module load time if DATABASE_URL is missing, so no runtime guard is needed here.
  await mongoose.connect(config.database_url as string);
}

async function main() {
  try {
    await connectDB().catch((error) => {
      logger.error("Error connecting to the database on startup:", error);
    });

    const httpServer = http.createServer(app);
    const defaultCorsOrigins =
      process.env.NODE_ENV === "development"
      ? ["http://localhost:4001", "http://localhost:4002"]
      : [];

    const socketCorsOrigins =
      config.cors_origins && config.cors_origins.length > 0
      ? config.cors_origins
      : defaultCorsOrigins;

    const io = new Server(httpServer, {
        cors: {
          origin: socketCorsOrigins,
          credentials: true,
        },
    });

    const [{ setNotificationSocket }, { setupCollabSocket }] = await Promise.all([
      import("./socket/notification.socket"),
      import("./socket/collab.socket"),
    ]);

    setNotificationSocket(io);
    setupCollabSocket(io);

    io.use((socket, next) => {
      try {
        const token = socket.handshake.auth?.token as string | undefined;
        if (!token) {
          return next(new Error("Unauthorized"));
        }

        const verifiedUser = JwtHelpers.verifyToken(
          token,
          config.jwt.secret as Secret
        );
        const userId = verifiedUser._id || verifiedUser.userId || verifiedUser.sub || verifiedUser.id;
        if (!userId) {
          return next(new Error("Unauthorized"));
        }

        socket.data.userId = userId.toString();
        next();
      } catch (error) {
        next(new Error("Unauthorized"));
      }
    });

    io.on("connection", (socket) => {
      const userId = socket.data.userId as string | undefined;
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    httpServer.listen(config.port, () => {
      logger.info(`Story-Spark-AI app listening on port ${config.port}`);
    });
  } catch (error) {
    logger.error("Error in main startup sequence:", error);
  }
}

/**
 * Vercel (@vercel/node) invokes the default export; Express alone must not call listen().
 */
export default async function handler(req: Request, res: Response) {
  try {
    await connectDB();
  } catch (error) {
    logger.error("Error connecting to the database:", error);
    res.status(500).json({
      success: false,
      message: "Database unavailable",
    });
    return;
  }
  (app as Application)(req, res);
}

if (process.env.VERCEL !== "1") {
  void main();
}
