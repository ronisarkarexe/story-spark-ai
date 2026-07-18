import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../../errors/api_error";
import { JwtHelpers } from "../../utils/jwt.helper";
import { User } from "../modules/user/user.model";
import { USER_STATUS } from "../../enums/user_status";

type JwtVerifiedUser = {
  _id: string;
  tokenVersion?: number;
  role?: string;
  iat?: number;
};
const isJwtVerifiedUser = (
  payload: unknown
): payload is JwtVerifiedUser => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "_id" in payload &&
    typeof (payload as { _id?: unknown })._id === "string"
  );
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

  const cookieToken =
    (req).cookies?.accessToken ||
    (req).cookies?.token;

  return bearerToken || cookieToken || "";
};

const auth =
  (...requiredRole: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = extractTokenFromRequest(req);

        if (!token) {
          throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "You are not authorized to access"
          );
        }

        // Verify JWT token
          const decodedUser = JwtHelpers.verifyToken(
            token,
            config.jwt.secret as Secret
          );

          if (!isJwtVerifiedUser(decodedUser)) {
            throw new ApiError(
              httpStatus.UNAUTHORIZED,
              "Invalid token"
            );
        }

      const verifiedUser = decodedUser;

        const user = await User.findById(verifiedUser._id);

        if (!user) {
          throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "User not found"
          );
        }
        if (user.passwordChangedAt && verifiedUser.iat) {
          const changedAtSeconds = Math.floor(user.passwordChangedAt.getTime() / 1000);

          if (verifiedUser.iat < changedAtSeconds) {
            throw new ApiError(
              httpStatus.UNAUTHORIZED,
              "Session expired. Please log in again."
            );
          }
        }
        // Token version validation replaces blacklist check
        if (
          typeof verifiedUser.tokenVersion === "number" &&
          user.tokenVersion !== verifiedUser.tokenVersion
        ) {
          throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Token is invalid or expired"
          );
        }

        // Check user status
        if (user.status !== USER_STATUS.ACTIVE) {
          throw new ApiError(
            httpStatus.FORBIDDEN,
            "Your account is not active"
          );
        }

        // Role authorization
        if (requiredRole.length) {
          if (
            !verifiedUser.role ||
            !requiredRole.includes(verifiedUser.role)
          ) {
            throw new ApiError(
              httpStatus.FORBIDDEN,
              "Forbidden"
            );
          }
        }

        (req as any).user = user;

        next();
      } catch (err) {
        next(err);
      }
    };

export default auth;