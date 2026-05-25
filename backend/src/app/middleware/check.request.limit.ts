import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import ApiError from "../../errors/api_error";
import { JwtHalers } from "../../utils/jwt.helper";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import { reserveUserQuota } from "../modules/ai_model/quota.service";
import { createUserQuotaGuard } from "../modules/ai_model/quota.lifecycle";

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
      const verifiedUser = await JwtHalers.verifyToken(
        token,
        config.jwt.secret as Secret
      );
      const { email: userEmail } = verifiedUser;

      await reserveUserQuota(userEmail);

      res.locals.quotaUserEmail = userEmail;
      res.locals.quotaRefundGuard = createUserQuotaGuard(userEmail);
      next();
    } catch (err) {
      next(err);
    }
  };

export default checkRequestLimit;
