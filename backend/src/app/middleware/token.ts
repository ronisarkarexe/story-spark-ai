import { Request } from "express";
import ApiError from "../../errors/api_error";
import httpStatus from "http-status";
import { JwtHalers } from "../../utils/jwt.helper";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import { ITokenPayload } from "../../interfaces/token";

export const getToken = (req: Request): ITokenPayload => {
  const token = req.headers.authorization as string;
  if (!token) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to access"
    );
  }
  try {
    const verifiedUser = JwtHalers.verifyToken(
      token,
      config.jwt.secret as Secret
    );
    const user = {
      _id: verifiedUser._id,
      email: verifiedUser.email,
      role: verifiedUser.role,
      subscriptionType: verifiedUser.subscriptionType,
      name: verifiedUser.name,
      postsCount: verifiedUser.postsCount,
    };
    return user;
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
  }
};
