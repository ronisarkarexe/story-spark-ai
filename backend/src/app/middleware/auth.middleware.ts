import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../../errors/api_error";
import { JwtHelpers } from "../../utils/jwt.helper";
import { User } from "../modules/user/user.model";
import { TokenBlacklist } from "../modules/auth/tokenBlacklist.model";
import { USER_STATUS } from "../../enums/user_status";

const auth =
  (...requiredRole: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = (req.headers.authorization || "") as string;

        // Support both header-based and cookie-based tokens.
        // Logout() blacklists whatever token string it receives (header or cookie),
        // so auth middleware must check the same token string source.
        const bearerToken = authHeader.startsWith("Bearer ")
          ? authHeader.slice(7).trim()
          : authHeader.trim();

        const cookieToken = (req as any).cookies?.accessToken || (req as any).cookies?.token;

        const token = bearerToken || cookieToken || "";

        if (!token) {
          throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "You are not authorized to access"
          );
        }

        const verifiedUser = JwtHelpers.verifyToken(
          token,
          config.jwt.secret as Secret
        );

        const isBlacklisted = await TokenBlacklist.findOne({ token });

        if (isBlacklisted) {
          throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Token has been revoked. Please log in again."
          );
        }

        const user = await User.findById((verifiedUser as any)._id);

        if (!user) {
          throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "User not found"
          );
        }

        if (user.tokenVersion !== (verifiedUser as any).tokenVersion) {
          throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Token is invalid or expired"
          );
        }

        if (user.status !== USER_STATUS.ACTIVE) {
          throw new ApiError(
            httpStatus.FORBIDDEN,
            "Your account is not active"
          );
        }

        if (
          requiredRole.length &&
          !requiredRole.includes((verifiedUser as any).role)
        ) {
          throw new ApiError(
            httpStatus.FORBIDDEN,
            "Forbidden"
          );
        }

        (req as any).user = user;

        next();
      } catch (err) {
        next(err);
      }
    };

export default auth;