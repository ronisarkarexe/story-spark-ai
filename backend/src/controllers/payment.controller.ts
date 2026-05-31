import { Request, Response } from "express";
import crypto from "crypto";
import razorpayInstance from "../config/razorpay";
import { Order } from "../app/modules/payment/order.model";
import { User } from "../app/modules/user/user.model";
import { SUBSCRIPTION_TYPE } from "../enums/subscription_type";

// Plan pricing mapping in paisa (e.g. 19.99 INR => 1999 paise)
const PLAN_PRICING: Record<string, number> = {
  [SUBSCRIPTION_TYPE.PRO]: 1999,
  [SUBSCRIPTION_TYPE.PREMIUM]: 4999,
};

// Validate RAZORPAY_KEY_SECRET is present at startup so misconfigured
// deployments fail loudly rather than silently passing undefined to
// crypto.createHmac() and returning an opaque 500 during payment verification.
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
if (!RAZORPAY_KEY_SECRET) {
  throw new Error(
    "Missing required environment variable: RAZORPAY_KEY_SECRET. " +
    "Payment verification cannot work without it."
  );
}

// Creates a new Razorpay order and returns the order details to the frontend
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { plan } = req.body;
    const userId = (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const normalizedPlan = plan?.toLowerCase() as SUBSCRIPTION_TYPE;
    
    // Validate the requested plan
    if (!normalizedPlan || !PLAN_PRICING[normalizedPlan]) {
      return res.status(400).json({ success: false, message: "Invalid or unsupported plan" });
    }

    const amount = PLAN_PRICING[normalizedPlan];

    const options = {
      amount, // Razorpay accepts amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`, // Unique receipt ID using timestamp
    };

    // Create the order on Razorpay
    const order = await razorpayInstance.orders.create(options);

    // Persist order details
    await Order.create({
      userId,
      razorpayOrderId: order.id,
      plan: normalizedPlan,
      amount,
      currency: "INR",
      status: "created"
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Order creation failed", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

// Verifies the payment signature to confirm the payment is legitimate
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate that all required payment fields are present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    // Razorpay signature verification: HMAC-SHA256 of "order_id|payment_id"
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // Use timingSafeEqual to compare signatures and prevent timing-based attacks
    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");
    const signaturesMatch =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!signaturesMatch) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Atomically claim the order to prevent replay attacks
    const updatedOrder = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, status: "created" },
      { $set: { status: "paid", razorpayPaymentId: razorpay_payment_id } },
      { new: true }
    );

    if (!updatedOrder) {
      // Order might have already been processed, or not exist
      return res.status(400).json({ success: false, message: "Order not found or already paid" });
    }

    // Upgrade the user's subscription
    await User.findByIdAndUpdate(updatedOrder.userId, {
      $set: { subscriptionType: updatedOrder.plan }
    });

    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Payment verification failed", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};