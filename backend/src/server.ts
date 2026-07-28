import { Application, Request, Response } from "express";
import mongoose from "mongoose";
import config from "./config";
import app, { defaultCorsOrigins } from "./app";
import dns from "node:dns";
import http from "http";
import { Server } from "socket.io";
import { JwtHelpers } from "./utils/jwt.helper";
import { Secret } from "jsonwebtoken";
import logger from "./utils/logger.util";
import { setNotificationSocket } from "./socket/notification.socket";
import { setupCollabSocket } from "./socket/collab.socket";
import { YjsGateway } from "./app/modules/collab/yjs.gateway";
import { socketRateLimiter } from "./socket/socket-rate-limiter";
import { startOrderReconciliationJob } from "./jobs/reconcilePendingOrders.job";

// Override DNS resolvers only when explicitly configured, default to the platform environment
if (config.dns_servers?.length) {
  dns.setServers(config.dns_servers);
}

if (config.disable_logs) {
  // Silence only verbose channels; keep warn/error so failures stay visible in logs
  const noop = () => undefined;
  console.log = noop;
  console.info = noop;
  console.debug = noop;
}

const MAX_MONGO_RECONNECT_ATTEMPTS = 5;
const MONGO_RECONNECT_DELAY_MS = 2000;
let isMongoReconnectInProgress = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function reconnectMongo() {
  if (isMongoReconnectInProgress) return;
  isMongoReconnectInProgress = true;

  try {
    for (let attempt = 1; attempt <= MAX_MONGO_RECONNECT_ATTEMPTS; attempt += 1) {
      try {
        logger.info(`MongoDB reconnect attempt ${attempt}/${MAX_MONGO_RECONNECT_ATTEMPTS}`);
        await mongoose.connect(config.database_url as string, {
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          connectTimeoutMS: 10000,
        });
        logger.info('MongoDB reconnected successfully.');
        return;
      } catch (error) {
        logger.error(`MongoDB reconnect attempt ${attempt} failed:`, error);
        if (attempt < MAX_MONGO_RECONNECT_ATTEMPTS) {
          await delay(MONGO_RECONNECT_DELAY_MS * attempt);
        }
      }
    }

    logger.error(
      `MongoDB failed to reconnect after ${MAX_MONGO_RECONNECT_ATTEMPTS} attempts. ` +
        'Database operations may fail until the service becomes available again.'
    );
  } finally {
    isMongoReconnectInProgress = false;
  }
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  if (!mongoose.connection.listeners('error').length) {
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB runtime connection error:', err);
    });

    mongoose.connection.on('disconnected', async () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
      await reconnectMongo();
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB connection reestablished.');
    });
  }

  await mongoose.connect(config.database_url as string, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
  });
}

async function main() {
  let httpServer: http.Server | undefined;

  const handleGracefulShutdown = async (errorType: string, error: unknown) => {
    logger.error(`CRITICAL: ${errorType} encountered! Initiating defensive shutdown cleanup...`);
    logger.error(error);

    try {
      if (httpServer) {
        await new Promise<void>((resolve) => {
          httpServer!.close(() => resolve());
        });
        logger.info('HTTP server closed.');
      }
      logger.info('HTTP server closed.');
      if (mongoose && mongoose.connection && mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        logger.info('MongoDB connection safely closed.');
      }
      process.exit(1);
    } catch (shutdownError) {
      logger.error('Error during graceful shutdown cleanup sequence:', shutdownError);
      process.exit(1);
    }
  };

  process.on('unhandledRejection', (reason: unknown) => {
    void handleGracefulShutdown('Unhandled Rejection', reason);
  });

  process.on('uncaughtException', (error: Error) => {
    void handleGracefulShutdown('Uncaught Exception', error);
  });

  try {
    await connectDB();
  } catch (startupError) {
    logger.error("Critical error during application startup:", startupError);
    process.exit(1);
  }

  try {
    httpServer = http.createServer(app);

    const socketCorsOrigins =
      config.cors_origins && config.cors_origins.length > 0
        ? config.cors_origins
        : defaultCorsOrigins;

    const io = new Server(httpServer, {
      cors: {
        origin: socketCorsOrigins,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
      },
    });

    io.use(socketRateLimiter);

    setupCollabSocket(io);
    setNotificationSocket(io);
    new YjsGateway(io);

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
      } catch {
        next(new Error("Unauthorized"));
      }
    });

    io.on("connection", (socket) => {
      const userId = socket.data.userId as string | undefined;
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    // Recovers orders left in "paid_pending_entitlement" by a crash between
    // the Order write and the User write in verifyPayment. See issue #4876.
    startOrderReconciliationJob();

    httpServer.listen(config.port, () => {
      logger.info(`Story-Spark-AI app listening on port ${config.port}`);
    });
  } catch (error) {
    logger.error("Error in main startup sequence:", error);
  }
}

main();
