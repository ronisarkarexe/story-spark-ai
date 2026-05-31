import { Request, Response } from "express";
import crypto from "crypto";
import getRazorpay from "../config/razorpay";
import { getToken } from "../app/middleware/token";
import { Order } from "../app/modules/payment/order.model";
import { User } from "../app/modules/user/user.model";
import { PLAN_PRICING, normalizePlan } from "../app/modules/payment/payment.constant";

// Creates a Razorpay order for a chosen plan. The price is resolved server
// side from PLAN_PRICING so the client cannot dictate the amount, and the
// order is persisted so verifyPayment can map it back to the user and tier.
export const createOrder = async (req: Request, res: Response) => {
  try {
    const token = getToken(req);
    const plan = normalizePlan(req.body?.plan);
    if (!plan) {
      return res.status(400).json({ success: false, message: "Invalid or missing plan" });
    }

    const pricing = PLAN_PRICING[plan];
    const order = await getRazorpay().orders.create({
      amount: pricing.amount,
      currency: pricing.currency,
      receipt: `receipt_${token._id}_${Date.now()}`,
    });

    await Order.create({
      userId: token._id,
      razorpayOrderId: order.id,
      plan,
      amount: pricing.amount,
      currency: pricing.currency,
      status: "created",
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

// Verifies the Razorpay signature, then atomically claims the persisted order
// and upgrades the user's subscription. The atomic status transition makes a
// replayed verify request a no-op so a tier cannot be granted twice.
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    if (!RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: "Payment not configured" });
    }

    const token = getToken(req);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");
    const signaturesMatch =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!signaturesMatch) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, userId: token._id, status: "created" },
      { status: "paid", razorpayPaymentId: razorpay_payment_id },
      { new: true }
    );

    if (!order) {
      const existing = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (existing && existing.status === "paid" && existing.userId.toString() === token._id) {
        return res.status(200).json({ success: true, message: "Payment already verified" });
      }
      return res.status(400).json({ success: false, message: "Order not found" });
    }

    const pricing = PLAN_PRICING[order.plan];
    if (pricing) {
      await User.findByIdAndUpdate(order.userId, {
        subscriptionType: pricing.subscriptionType,
      });
    }

    res.status(200).json({ success: true, message: "Payment verified and subscription upgraded" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
