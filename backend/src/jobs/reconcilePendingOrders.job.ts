import cron from "node-cron";
import { Order } from "../app/modules/payment/order.model";
import { IOrder } from "../app/modules/payment/order.interface";
import { getRazorpay } from "../config/razorpay";
import { grantEntitlementForOrder } from "../controllers/payment.controller";
import logger from "../utils/logger.util";

const STUCK_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
/** Age `created` orders before polling Razorpay so client /payment/verify can win the race. */
const CREATED_RECONCILE_AGE_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ENTITLEMENT_ATTEMPTS = 5;

/**
 * Reconciles paid entitlements that the browser never confirmed via POST /payment/verify.
 *
 * Coverage:
 * 1. status=paid_pending_entitlement — charge claimed, User write never finished.
 * 2. status=created (aged) — checkout completed at Razorpay but verify never ran;
 *    we fetch order/payment status and claim entitlement if paid.
 *
 * A dedicated Razorpay webhook is not required for correctness when this sweep runs;
 * prefer this server-side reconcile over an incomplete webhook handler.
 * See issue #6522.
 */
export async function reconcilePendingOrders(): Promise<void> {
  await reconcilePaidPendingEntitlement();
  await reconcileAgedCreatedOrders();
}

async function reconcilePaidPendingEntitlement(): Promise<void> {
  const cutoff = new Date(Date.now() - STUCK_THRESHOLD_MS);

  const stuckOrders = await Order.find({
    status: "paid_pending_entitlement",
    updatedAt: { $lt: cutoff },
    entitlementAttempts: { $lt: MAX_ENTITLEMENT_ATTEMPTS },
  }).limit(50);

  for (const order of stuckOrders) {
    try {
      await grantEntitlementForOrder(order, null, { respond: false });
      logger.info(
        `[reconcile] Completed entitlement for paid_pending order ${order._id} (user ${order.userId}).`
      );
    } catch (err) {
      logger.error(`[reconcile] Failed to reconcile paid_pending order ${order._id}:`, err);
      await Order.updateOne({ _id: order._id }, { $inc: { entitlementAttempts: 1 } });
    }
  }

  const exhausted = await Order.countDocuments({
    status: "paid_pending_entitlement",
    entitlementAttempts: { $gte: MAX_ENTITLEMENT_ATTEMPTS },
  });
  if (exhausted > 0) {
    logger.error(
      `[reconcile] ${exhausted} paid_pending order(s) exhausted retry attempts and need manual review.`
    );
  }
}

async function reconcileAgedCreatedOrders(): Promise<void> {
  const razorpay = getRazorpay();
  if (!razorpay) {
    logger.warn("[reconcile] Razorpay not configured — skipping created-order sweep.");
    return;
  }

  const cutoff = new Date(Date.now() - CREATED_RECONCILE_AGE_MS);
  const createdOrders = await Order.find({
    status: "created",
    updatedAt: { $lt: cutoff },
    entitlementAttempts: { $lt: MAX_ENTITLEMENT_ATTEMPTS },
  }).limit(50);

  for (const order of createdOrders) {
    try {
      await reconcileOneCreatedOrder(order, razorpay);
    } catch (err) {
      logger.error(`[reconcile] Failed to reconcile created order ${order._id}:`, err);
      await Order.updateOne({ _id: order._id }, { $inc: { entitlementAttempts: 1 } });
    }
  }
}

async function reconcileOneCreatedOrder(
  order: IOrder,
  razorpay: NonNullable<ReturnType<typeof getRazorpay>>
): Promise<void> {
  const rzOrder = await razorpay.orders.fetch(order.razorpayOrderId);
  const rzStatus = String((rzOrder as { status?: string }).status ?? "").toLowerCase();

  if (rzStatus === "paid") {
    const paymentId = await resolveCapturedPaymentId(razorpay, order.razorpayOrderId);
    if (!paymentId) {
      logger.warn(
        `[reconcile] Razorpay order ${order.razorpayOrderId} is paid but no captured payment id yet — will retry.`
      );
      await Order.updateOne({ _id: order._id }, { $inc: { entitlementAttempts: 1 } });
      return;
    }

    const claimed = await Order.findOneAndUpdate(
      { _id: order._id, status: "created" },
      {
        status: "paid_pending_entitlement",
        razorpayPaymentId: paymentId,
      },
      { new: true }
    );

    if (!claimed) {
      // Client verify (or another sweep) claimed it first — nothing to do.
      return;
    }

    await grantEntitlementForOrder(claimed, null, { respond: false });
    logger.info(
      `[reconcile] Granted entitlement for created→paid order ${order._id} (user ${order.userId}).`
    );
    return;
  }

  if (rzStatus === "attempted") {
    // Payment may still be in flight; bump attempts so we eventually stop polling.
    await Order.updateOne({ _id: order._id }, { $inc: { entitlementAttempts: 1 } });
    return;
  }

  // created / expired / etc. — leave as-is but count toward attempt budget so abandoned
  // checkouts do not stay in the sweep forever.
  await Order.updateOne({ _id: order._id }, { $inc: { entitlementAttempts: 1 } });
}

async function resolveCapturedPaymentId(
  razorpay: NonNullable<ReturnType<typeof getRazorpay>>,
  razorpayOrderId: string
): Promise<string | null> {
  const payments = await razorpay.orders.fetchPayments(razorpayOrderId);
  const items = (payments as { items?: Array<{ id?: string; status?: string }> }).items ?? [];
  const preferred =
    items.find((p) => p.status === "captured") ??
    items.find((p) => p.status === "authorized") ??
    items[0];
  return preferred?.id ?? null;
}

/** Runs the reconciliation sweep every 5 minutes. */
export function startOrderReconciliationJob(): void {
  cron.schedule("*/5 * * * *", () => {
    reconcilePendingOrders().catch((err) =>
      logger.error("[reconcile] Unhandled error in scheduled sweep:", err)
    );
  });
  logger.info("Order reconciliation job scheduled (every 5 minutes).");
}
