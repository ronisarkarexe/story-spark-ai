import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../../errors/api_error";
import { JwtHalers } from "../../utils/jwt.helper";

const auth =
  (...requiredRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization as string;
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
