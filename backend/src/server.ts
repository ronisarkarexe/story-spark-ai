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

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  // config.database_url is guaranteed non-empty by config/index.ts – if it throws at
  // module load time if DATABASE_URL is missing, so no runtime guard is needed here
  await mongoose.connect(config.database_url as string);
}

async function main() {
  // ==========================================
  // CENTRALIZED GRACEFUL SHUTDOWN HANDLERS FOR #2784
  // ==========================================
  const handleGracefulShutdown = async (errorType: string, error: unknown) => {
    logger.error(`💥 CRITICAL: ${errorType} encountered! Initiating defensive shutdown cleanup...`);
    logger.error(error);

    try {
      if (mongoose && mongoose.connection && mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        logger.info('🔌 MongoDB connection safely closed.');
      }
      process.exit(1);
    } catch (shutdownError) {
      logger.error('❌ Error during graceful shutdown cleanup sequence:', shutdownError);
      process.exit(1);
    }
  };

  // Catch unhandled Promise failures across asynchronous operations
  process.on('unhandledRejection', (reason: unknown) => {
    handleGracefulShutdown('Unhandled Rejection', reason);
  });

  // Intercept unexpected application crashes before they tear down the system
  process.on('uncaughtException', (error: Error) => {
    handleGracefulShutdown('Uncaught Exception', error);
  });

  try {
    await connectDB().catch((error) => {
      logger.error("Error connecting to the database on startup:", error);
    });
  } catch (startupError) {
    logger.error("Critical error during application startup:", startupError);
  }

  const httpServer = http.createServer(app);
  const defaultCorsOrigins = 
    process.env.NODE_ENV === "development"
      ? ["http://localhost:4001", "http://localhost:4002"]
      : [];

  const socketCorsOrigins =
    config.cors_origins && config.cors_origins.length > 0
      ? config.cors_origins
      : defaultCorsOrigins;

  // Start the server listener
  const PORT = config.port || 4000;
  httpServer.listen(PORT, () => {
    logger.info(`🚀 Server running smoothly on port ${PORT}`);
  });
}

// Invoke the main initialization lifecycle block
main();