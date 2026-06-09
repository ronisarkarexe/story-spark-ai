import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../app/modules/payment/order.model";
import { User } from "../app/modules/user/user.model";

// Server-side plan -> price map (paise)
// Amount is NEVER trusted from the client. The client sends a plan name;
// the server derives the canonical price.
const PLAN_PRICE_MAP: Record<string, { amount: number; currency: string }> = {
  basic: { amount: 49900, currency: "INR" },
  pro: { amount: 99900, currency: "INR" },
  premium: { amount: 199900, currency: "INR" },
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// POST /api/v1/payment/create-order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { plan } = req.body;

    // Validate plan - reject anything not in the server-side map
    if (!plan || !PLAN_PRICE_MAP[plan]) {
      return res.status(400).json({
        success: false,
        message: `Invalid plan. Valid options: ${Object.keys(PLAN_PRICE_MAP).join(", ")}`,
      });
    }

    const { amount, currency } = PLAN_PRICE_MAP[plan];

    // Create the Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency,
      receipt: `receipt_${userId}_${Date.now()}`,
    });

    // Persist an order record so verifyPayment can resolve the tier
    // without trusting anything from the client
    await Order.create({
      userId,
      razorpayOrderId: razorpayOrder.id,
      plan,
      amount,
      currency,
      status: "created",
    });

    return res.status(201).json({
      success: true,
      orderId: razorpayOrder.id,
      amount,
      currency,
    });
  } catch (error) {
    console.error("createOrder error:", error);
    return res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// POST /api/v1/payment/verify
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment fields" });
    }

    // 1. Verify the HMAC signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // 2. Atomically claim the order: created -> paid
    //    Using findOneAndUpdate with a status guard makes a replayed verify a no-op,
    //    preventing a subscription from being granted twice.
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, status: "created" },
      { status: "paid", razorpayPaymentId: razorpay_payment_id },
      { new: true }
    );

    if (!order) {
      // Either the order doesn't exist or was already claimed
      return res.status(409).json({
        success: false,
        message: "Order not found or already processed",
      });
    }

    // 3. Upgrade the user's subscriptionType using the tier stored in the order
    await User.findByIdAndUpdate(order.userId, {
      subscriptionType: order.plan,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and subscription upgraded",
      plan: order.plan,
    });
  } catch (error) {
    console.error("verifyPayment error:", error);
    return res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
