import { QuotaRefundGuard } from "../app/modules/ai_model/quota.lifecycle";

declare global {
  namespace Express {
    interface Locals {
      quotaRefundGuard?: QuotaRefundGuard;
      quotaUserEmail?: string;
    }
  }
}

export {};
