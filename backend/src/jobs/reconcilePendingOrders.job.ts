import cron from "node-cron";
import { Order } from "../app/modules/payment/order.model";
import { User } from "../app/modules/user/user.model";
import logger from "../utils/logger.util";

const STUCK_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ENTITLEMENT_ATTEMPTS = 5;

const PLANS: Record<string, { durationDays: number; label: string }> = {
  monthly: { durationDays: 30, label: "Monthly Premium" },
  yearly: { durationDays: 365, label: "Yearly Premium" },
};

/**
 * Scans for orders stuck in "paid_pending_entitlement" — i.e. Razorpay was
 * charged and the order was claimed, but the User.subscriptionType write
 * never completed (process crash, deploy, Mongo failover) and no client
 * retry has come in to recover it. See issue #4876.
 */
export async function reconcilePendingOrders(): Promise<void> {
  const cutoff = new Date(Date.now() - STUCK_THRESHOLD_MS);

  const stuckOrders = await Order.find({
    status: "paid_pending_entitlement",
    updatedAt: { $lt: cutoff },
    entitlementAttempts: { $lt: MAX_ENTITLEMENT_ATTEMPTS },
  }).limit(50);

  for (const order of stuckOrders) {
    try {
      const plan = PLANS[order.plan];
      if (!plan) {
        logger.error(`[reconcile] Order ${order._id} has unknown plan "${order.plan}" — flagging for manual review.`);
        await Order.updateOne({ _id: order._id }, { $inc: { entitlementAttempts: 1 } });
        continue;
      }

      const subscriptionExpiry = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);

      const updatedUser = await User.findByIdAndUpdate(
        order.userId,
        {
          subscriptionType: "premium",
          subscriptionExpiry,
          lastPaymentId: order.razorpayPaymentId,
          lastOrderId: order.razorpayOrderId,
        },
        { new: true }
      );

      if (!updatedUser) {
        logger.error(`[reconcile] Order ${order._id} references missing user ${order.userId} — flagging for manual review.`);
        await Order.updateOne({ _id: order._id }, { $inc: { entitlementAttempts: 1 } });
        continue;
      }

      await Order.updateOne(
        { _id: order._id, status: "paid_pending_entitlement" },
        { status: "paid" }
      );

      logger.info(`[reconcile] Completed entitlement for order ${order._id} (user ${order.userId}).`);
    } catch (err) {
      logger.error(`[reconcile] Failed to reconcile order ${order._id}:`, err);
      await Order.updateOne({ _id: order._id }, { $inc: { entitlementAttempts: 1 } });
    }
  }

  const exhausted = await Order.countDocuments({
    status: "paid_pending_entitlement",
    entitlementAttempts: { $gte: MAX_ENTITLEMENT_ATTEMPTS },
  });
  if (exhausted > 0) {
    logger.error(`[reconcile] ${exhausted} order(s) exhausted retry attempts and need manual review.`);
  }
}

/** Runs the reconciliation sweep every 5 minutes. */
export function startOrderReconciliationJob(): void {
  cron.schedule("*/5 * * * *", () => {
    reconcilePendingOrders().catch((err) =>
      logger.error("[reconcile] Unhandled error in scheduled sweep:", err)
    );
  });
  logger.info("🔁 Order reconciliation job scheduled (every 5 minutes).");
}