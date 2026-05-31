import { Schema, model } from "mongoose";
import { IOrder, OrderModel } from "./order.interface";
import { SUBSCRIPTION_TYPE } from "../../../enums/subscription_type";

const OrderSchema = new Schema<IOrder, OrderModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    plan: { 
      type: String, 
      required: true,
      enum: Object.values(SUBSCRIPTION_TYPE),
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },
  {
    timestamps: true,
  }
);

export const Order = model<IOrder, OrderModel>("Order", OrderSchema);
