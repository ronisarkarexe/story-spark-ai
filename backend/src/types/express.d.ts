import { QuotaRefundGuard } from "../app/modules/ai_model/quota.lifecycle";
import { IUser } from "../app/modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser & { _id: string };
    }

    interface Locals {
      quotaRefundGuard?: QuotaRefundGuard;
      quotaUserEmail?: string;
    }
  }
}

export {};
