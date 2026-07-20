import { Request, Response, NextFunction } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { User } from "../app/modules/user/user.model";
import { Order } from "../app/modules/payment/order.model";
import { IOrder } from "../app/modules/payment/order.interface";

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
        userId: userId.toString(),
      },
    });

    await Order.create({
      userId,
      razorpayOrderId: order.id,
      plan,
      amount: selectedPlan.amountPaise,
      currency: "INR",
      status: "created",
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

/**
 * Grants the subscription for an order that has already been atomically
 * claimed (status === "paid_pending_entitlement"), then flips the order to
 * its terminal "paid" state. Safe to call multiple times for the same order
 * — findByIdAndUpdate on the User is naturally idempotent (same end state
 * every time), and the final Order transition is guarded by status.
 *
 * Used both by the initial verifyPayment call and by the reconciliation job.
 */
async function grantEntitlementAndRespond(
  order: IOrder,
  res: Response,
  { respond }: { respond: boolean }
): Promise<void> {
  const selectedPlan = PLANS[order.plan];
  const subscriptionExpiry = new Date(
    Date.now() + selectedPlan.durationDays * 24 * 60 * 60 * 1000
  );

  const updatedUser = await User.findByIdAndUpdate(
    order.userId,
    {
      subscriptionType: "premium",
      subscriptionExpiry,
      lastPaymentId: order.razorpayPaymentId,
      lastOrderId: order.razorpayOrderId,
    },
    { new: true, select: "email subscriptionType subscriptionExpiry" }
  );

  if (!updatedUser) {
    // User genuinely doesn't exist — revert the claim so the order isn't
    // stuck in limbo forever, and this is a legitimate "created" retry state.
    await Order.findOneAndUpdate(
      { _id: order._id, status: "paid_pending_entitlement" },
      { status: "created", razorpayPaymentId: null }
    );
    if (respond) {
      res.status(404).json({ success: false, error: "User not found." });
    }
    return;
  }

  // Finalize — only transitions if still pending, so a concurrent/retried
  // call (or the reconciliation job) racing this one is a safe no-op.
  await Order.findOneAndUpdate(
    { _id: order._id, status: "paid_pending_entitlement" },
    { status: "paid" }
  );

  if (respond) {
    res.status(200).json({
      success: true,
      message: `Subscription upgraded to ${selectedPlan.label} successfully.`,
      subscription: {
        type: updatedUser.subscriptionType,
        expiry: updatedUser.subscriptionExpiry,
      },
    });
  }
}

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

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const providedBuffer = Buffer.from(razorpay_signature, "hex");

    const isSignatureValid =
      expectedBuffer.length === providedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, providedBuffer);

    if (!isSignatureValid) {
      res.status(400).json({
        success: false,
        error: "Payment signature verification failed. This request may be tampered.",
      });
      return;
    }

    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorised. Please log in." });
      return;
    }

    const localOrder = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!localOrder) {
      res.status(400).json({ success: false, error: "Unknown order." });
      return;
    }

    if (localOrder.userId.toString() !== userId.toString()) {
      res.status(403).json({
        success: false,
        error: "Order does not belong to this user.",
      });
      return;
    }

    const replayedPayment = await Order.findOne({
      razorpayPaymentId: razorpay_payment_id,
      status: "paid",
    });
    if (replayedPayment) {
      if (
        replayedPayment.razorpayOrderId === razorpay_order_id &&
        replayedPayment.userId.toString() === userId.toString()
      ) {
        const existingUser = await User.findById(userId).select(
          "email subscriptionType subscriptionExpiry"
        );
        if (!existingUser) {
          res.status(404).json({ success: false, error: "User not found." });
          return;
        }

        res.status(200).json({
          success: true,
          message: `Subscription already active for ${PLANS[localOrder.plan]?.label ?? localOrder.plan}.`,
          subscription: {
            type: existingUser.subscriptionType,
            expiry: existingUser.subscriptionExpiry,
          },
        });
        return;
      }

      res.status(409).json({ success: false, error: "Payment already redeemed." });
      return;
    }

    if (localOrder.status === "paid") {
      res.status(409).json({ success: false, error: "Order already fulfilled." });
      return;
    }

    const razorpay = getRazorpay();
    if (!razorpay) {
      res.status(500).json({ success: false, error: "Payment gateway not configured" });
      return;
    }

    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    const plan = localOrder.plan;

    if (!plan || !PLANS[plan]) {
      res.status(400).json({
        success: false,
        error: "Could not determine the subscription plan from the order.",
      });
      return;
    }

    const selectedPlan = PLANS[plan];

    if (Number(localOrder.amount) !== selectedPlan.amountPaise) {
      res.status(400).json({
        success: false,
        error: "Stored order amount does not match the selected plan.",
      });
      return;
    }

    if (Number(razorpayOrder.amount) !== selectedPlan.amountPaise) {
      res.status(400).json({
        success: false,
        error: "Paid amount does not match the selected plan.",
      });
      return;
    }

    // ── If a previous attempt already claimed this order but crashed before
    // granting the subscription, don't try to re-claim (the status guard
    // below would just fail) — retry entitlement on the existing claim.
    if (localOrder.status === "paid_pending_entitlement") {
      await grantEntitlementAndRespond(localOrder, res, { respond: true });
      return;
    }

    // ── Step 1: atomically claim the order for fulfillment. This is the
    // ONLY state transition guarded on "created", so it can only happen once.
    const claimedOrder = await Order.findOneAndUpdate(
      {
        razorpayOrderId: razorpay_order_id,
        userId,
        status: "created",
      },
      {
        status: "paid_pending_entitlement",
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!claimedOrder) {
      // Raced with another request that claimed it between our read above
      // and this write. Re-read and let the normal status branches handle it.
      res.status(409).json({ success: false, error: "Order already fulfilled." });
      return;
    }

    // ── Step 2: grant the subscription. If the process dies here, the order
    // is left at "paid_pending_entitlement" — recoverable by a retried
    // verifyPayment call (branch above) or by the reconciliation job below.
    await grantEntitlementAndRespond(claimedOrder, res, { respond: true });
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

// Exported for the reconciliation job — keeps the entitlement logic in one place.
export { grantEntitlementAndRespond as grantEntitlementForOrder };