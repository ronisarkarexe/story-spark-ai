import { Document, Types } from "mongoose";

export type OrderStatus =
  | "created"
  | "paid_pending_entitlement"
  | "paid"
  | "failed";

export interface IOrder extends Document {
  userId: Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  plan: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  entitlementAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}
