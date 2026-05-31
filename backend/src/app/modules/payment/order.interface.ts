import { Model, Types } from "mongoose";

export interface IOrder {
  userId: Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  plan: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
}

export type OrderModel = Model<IOrder, object>;
