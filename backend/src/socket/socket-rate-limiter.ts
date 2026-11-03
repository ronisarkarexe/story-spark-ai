import { Socket } from "socket.io";
import logger from "../utils/logger.util";
import { consumeRateLimit } from "../app/middleware/rate_limit.store";

interface RateLimiterConfig {
  windowMs: number;
  maxRequests: number;
  blockTimeMs: number;
}

const DEFAULT_CONFIG: RateLimiterConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 connections per minute
  blockTimeMs: 5 * 60 * 1000, // 5 minute block
};

/**
 * Creates a Socket.IO middleware that rate limits connection attempts based on IP address.
 * Uses the existing MongoDB-backed rate limit store for consistency with HTTP rate limiting.
 */
export const createSocketRateLimiter = (config: Partial<RateLimiterConfig> = {}) => {
  const { windowMs, maxRequests, blockTimeMs } = { ...DEFAULT_CONFIG, ...config };

  return async (socket: Socket, next: (err?: Error) => void) => {
    try {
      // Extract IP from socket handshake
      const ip = socket.handshake.address;
      
      if (!ip) {
        logger.warn("Socket.IO connection attempt without IP address");
        return next(new Error("Unable to determine client IP address"));
      }

      // Check rate limit using existing MongoDB store
      const { allowed, retryAfterSec } = await consumeRateLimit({
        key: `socket_connection_${ip}`,
        windowMs,
        maxRequests,
        blockTimeMs,
      });

      if (!allowed) {
        logger.warn(`Socket.IO rate limit exceeded for IP: ${ip}`);
        return next(new Error(`Rate limit exceeded. Please try again in ${retryAfterSec} seconds.`));
      }

      // Allow connection
      next();
    } catch (error) {
      logger.error("Socket.IO rate limiter error:", error);
      // Fail closed on errors
      return next(new Error("Rate limit check failed"));
    }
  };
};

export const socketRateLimiter = createSocketRateLimiter();
export default socketRateLimiter;
