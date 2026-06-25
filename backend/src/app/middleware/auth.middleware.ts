import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../../errors/api_error";
import { JwtHelpers } from "../../utils/jwt.helper";
import { User } from "../modules/user/user.model";
import { TokenBlacklist } from "../modules/auth/tokenBlacklist.model";
import { USER_STATUS } from "../../enums/user_status";

type JwtVerifiedUser = {
  _id: string;
  tokenVersion?: number;
  role?: string;
};


const extractBearerToken = (authHeader: string): string => {
  if (!authHeader) return "";
  if (!authHeader.startsWith("Bearer ")) return "";

  return authHeader.slice("Bearer ".length).trim();
};

const extractTokenFromRequest = (req: Request): string => {
  const authHeader = Array.isArray(req.headers.authorization)
    ? req.headers.authorization[0]
    : req.headers.authorization;

  const bearerToken = extractBearerToken(authHeader ?? "");

  // Support both header-based and cookie-based tokens.
  const cookieToken =
    (req as any).cookies?.accessToken || (req as any).cookies?.token;

  return bearerToken || cookieToken || "";
};

const auth = (...requiredRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = extractTokenFromRequest(req);

      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "You are not authorized to access"
        );
      }

      const verified = JwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      ) as unknown as JwtVerifiedUser;

      if (!verified?._id) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
      }

      // Ensure this exact token string is not blacklisted.
      const blacklisted = await TokenBlacklist.findOne({ token }).lean();
      if (blacklisted) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Token has been revoked. Please log in again."
        );
      }

      const user = await User.findById(verified._id);
      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
      }

      // Token invalidation check (e.g., on refresh/logout via tokenVersion).
      // If the JWT includes tokenVersion, enforce it strictly.
      if (
        typeof verified.tokenVersion === "number" &&
        user.tokenVersion !== verified.tokenVersion
      ) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Token is invalid or expired"
        );
      }

      // Status check
      if (user.status !== USER_STATUS.ACTIVE) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "Your account is not active"
        );
      }

      // Role check (if roles are required)
      if (requiredRole.length) {
        const tokenRole = verified.role;
        if (!tokenRole || !requiredRole.includes(tokenRole)) {
          throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
        }
      }

      (req as any).user = user;
      return next();
    } catch (err) {
      return next(err);
    }
  };

export default auth;


