import { Schema, model } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, default: null },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "paid_pending_entitlement", "paid", "failed"],
      default: "created",
    },
    entitlementAttempts: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Order = model<IOrder>("Order", orderSchema);
