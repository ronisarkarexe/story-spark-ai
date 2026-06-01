import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../../errors/api_error";
import { JwtHalers } from "../../utils/jwt.helper";
import { User } from "../modules/user/user.model";

const auth =
  (...requiredRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = (req.headers.authorization || '') as string;
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : authHeader.trim();
      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "You are not authorized to access"
        );
      }

      // verify token
      const verifiedUser = JwtHalers.verifyToken(
        token,
        config.jwt.secret as Secret
      );

      const user = await User.findById((verifiedUser as any)._id);
      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
      }

      if (user.tokenVersion !== (verifiedUser as any).tokenVersion) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Token is invalid or expired"
        );
      }

      if (requiredRole.length && !requiredRole.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      }
      req.user = verifiedUser;
      next();
    } catch (err) {
      next(err);
    }
  };
export default auth;
