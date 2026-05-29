import { Application, Request, Response } from "express";
import mongoose from "mongoose";
import config from "./config";
import app from "./app";
import dns from "dns";
import http from "http";
import { Server } from "socket.io";
import { JwtHalers } from "./utils/jwt.helper";
import { Secret } from "jsonwebtoken";
import logger from "./utils/logger.util";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

if (config.disable_logs) {
  const noop = () => undefined;
  console.log = noop;
  console.info = noop;
  console.debug = noop;
  console.warn = noop;
  console.error = noop;
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  // config.database_url is guaranteed non-empty by config/index.ts — it throws at
  // module load time if DATABASE_URL is missing, so no runtime guard is needed here.
  await mongoose.connect(config.database_url);
}

async function main() {
  try {
    await connectDB();
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: config.cors_origins?.length
          ? config.cors_origins
          : ["http://localhost:4001", "https://storysparkai.vercel.app"],
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

        const verifiedUser = JwtHalers.verifyToken(
          token,
          config.jwt.secret as Secret
        );
        const userId = verifiedUser.userId || verifiedUser.sub || verifiedUser.id;
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
    logger.error("Error connecting to the database:", error);
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
