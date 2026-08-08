# Payment reconciliation (Razorpay)

Premium entitlement is granted when:

1. The client calls `POST /payment/verify` after checkout (happy path), or
2. The scheduled job in `backend/src/jobs/reconcilePendingOrders.job.ts` recovers missed grants.

## Why reconcile `created` orders

If checkout succeeds at Razorpay but the browser never reaches `/payment/verify`
(tab closed, network drop, ad blocker), the local `Order` stays `status=created`
and the user remains on free forever.

The reconcile job ages those rows (~10 minutes), fetches Razorpay order + payment
status, and if paid claims the order (`paid_pending_entitlement`) then reuses the
same `grantEntitlementForOrder` path as verify.

## Webhook

A Razorpay webhook is optional while this sweep runs every 5 minutes. Prefer a
complete reconcile over a partial webhook. If a webhook is added later, it should
call the same claim + `grantEntitlementForOrder` helpers so entitlement stays
idempotent.
