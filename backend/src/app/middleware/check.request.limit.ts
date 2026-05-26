import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { User } from "../modules/user/user.model";
import { REQUEST_LIMITS } from "../../interfaces/ai_model_request_limit";
import ApiError from "../../errors/api_error";
import { JwtHalers } from "../../utils/jwt.helper";
import config from "../../config";
import { Secret } from "jsonwebtoken";

// Note: Actual quota/limit enforcement was moved to the ai_model.service layer 
// to allow for atomic MongoDB operations and rollback on failure.
// This middleware now only ensures the user is authenticated and exists.
const checkRequestLimit =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization as string;
      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "You are not authorized to access"
        );
      }
      const verifiedUser = JwtHalers.verifyToken(
        token,
        config.jwt.secret as Secret
      );
      const { email: userEmail } = verifiedUser;
      const user = await User.findOne({ email: userEmail });

      if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
      }

      next();
    } catch (err) {
      next(err);
    }
  };

export default checkRequestLimit;
