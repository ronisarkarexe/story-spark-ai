import { Document, Types } from "mongoose";

export type OrderStatus = "created" | "paid" | "failed";

export interface IOrder extends Document {
  userId: Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  plan: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
