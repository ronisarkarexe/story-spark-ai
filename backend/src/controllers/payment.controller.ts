import { Request, Response, NextFunction } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { User } from "../app/modules/user/user.model";

let razorpayInstance: any = null;
const getRazorpay = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn("Razorpay credentials missing. Payment features will fail.");
      return null;
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

const PLANS: Record<string, { amountPaise: number; durationDays: number; label: string }> = {
  monthly: {
    amountPaise: 49900,   
    durationDays: 30,
    label: "Monthly Premium",
  },
  yearly: {
    amountPaise: 499900,  
    durationDays: 365,
    label: "Yearly Premium",
  },
};

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
const userId = (req as any).user?._id;

if (!userId) {
   res.status(401).json({ success: false, message: "Unauthorized" });
   return;
}

const { plan } = req.body as { plan?: string };

if (!plan || !PLANS[plan]) {
 res.status(400).json({
  success: false,
  error: `Invalid plan. Valid options: ${Object.keys(PLANS).join(", ")}.`,
});
return;
}

    const selectedPlan = PLANS[plan];

    const razorpay = getRazorpay();
    if (!razorpay) {
      res.status(500).json({ success: false, error: "Payment gateway not configured" });
      return;
    }

    const order = await razorpay.orders.create({
      amount: selectedPlan.amountPaise,  
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan,
        label: selectedPlan.label,
      },
    });

    res.status(201).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({
        success: false,
        error: "Missing required payment fields: order ID, payment ID, or signature.",
      });
      return;
    }
    
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(razorpay_signature, "hex")
    );

    if (!isSignatureValid) {
      res.status(400).json({
        success: false,
        error: "Payment signature verification failed. This request may be tampered.",
      });
      return;
    }
    
    const razorpay = getRazorpay();
    if (!razorpay) {
      res.status(500).json({ success: false, error: "Payment gateway not configured" });
      return;
    }

    const order = await razorpay.orders.fetch(razorpay_order_id);
    const plan = (order.notes as Record<string, string>)?.plan;

    if (!plan || !PLANS[plan]) {
      res.status(400).json({
        success: false,
        error: "Could not determine the subscription plan from the order.",
      });
      return;
    }

    const selectedPlan = PLANS[plan];
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorised. Please log in." });
      return;
    }

    const subscriptionExpiry = new Date(
      Date.now() + selectedPlan.durationDays * 24 * 60 * 60 * 1000
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        subscriptionType: "premium",
        subscriptionExpiry,
        lastPaymentId: razorpay_payment_id,
        lastOrderId: razorpay_order_id,
      },
      { new: true, select: "email subscriptionType subscriptionExpiry" }
    );

    if (!updatedUser) {
      res.status(404).json({ success: false, error: "User not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Subscription upgraded to ${selectedPlan.label} successfully.`,
      subscription: {
        type: updatedUser.subscriptionType,
        expiry: updatedUser.subscriptionExpiry,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorised." });
      return;
    }

    const user = await User.findById(userId).select(
      "subscriptionType subscriptionExpiry"
    );

    if (!user) {
      res.status(404).json({ success: false, error: "User not found." });
      return;
    }

    const isActive =
      user.subscriptionType === "premium" &&
      user.subscriptionExpiry != null &&
      new Date(user.subscriptionExpiry) > new Date();

    res.status(200).json({
      success: true,
      subscription: {
        type: user.subscriptionType ?? "free",
        expiry: user.subscriptionExpiry ?? null,
        isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};
