// backend/src/app/middleware/idempotency.middleware.ts
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { IdempotencyKey } from "../../models/idempotencyKey.model";

/**
 * Deduplicates POST requests using a client-supplied `Idempotency-Key` header,
 * scoped per user. Must run BEFORE any quota-reservation middleware
 * (enforceQuota / checkRequestLimit) so duplicates never touch quota or AI cost.
 *
 * - No header supplied            -> request proceeds, undeduplicated (back-compat).
 * - First time seeing this key    -> reserved atomically, request proceeds.
 * - Same key, still in progress   -> 409, no quota/AI cost.
 * - Same key, already completed   -> replays the original response verbatim.
 */
const idempotencyMiddleware =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const rawKey = req.header("Idempotency-Key");
    if (!rawKey) return next();

    const userId =
      (req as any).user?.id ?? (req as any).user?._id?.toString() ?? "anon";
    const scopedKey = `${userId}:${rawKey}`;

    try {
      // Atomic "insert if absent" — findOneAndUpdate with upsert returns the
      // PRE-update doc when new:false, so `null` means we just created it.
      const existing = await IdempotencyKey.findOneAndUpdate(
        { key: scopedKey },
        { $setOnInsert: { key: scopedKey, status: "in_progress" } },
        { upsert: true, new: false }
      );

      if (existing === null) {
        res.locals.idempotencyKey = scopedKey;
        return next();
      }

      if (existing.status === "in_progress") {
        return res.status(httpStatus.CONFLICT).json({
          success: false,
          message:
            "A request with this Idempotency-Key is already being processed.",
        });
      }

      // Completed — replay, don't regenerate or re-charge quota.
      res
        .status(existing.statusCode ?? httpStatus.OK)
        .json(existing.responseBody ? JSON.parse(existing.responseBody) : {});
      return;
    } catch (err) {
      // If the idempotency store itself fails, don't block generation —
      // rate limits/quota still protect the endpoint either way.
      return next();
    }
  };

export const completeIdempotentRequest = async (
  scopedKey: string | undefined,
  statusCode: number,
  body: unknown
): Promise<void> => {
  if (!scopedKey) return;
  await IdempotencyKey.findOneAndUpdate(
    { key: scopedKey },
    { status: "completed", statusCode, responseBody: JSON.stringify(body) }
  );
};

export const releaseIdempotentRequest = async (
  scopedKey: string | undefined
): Promise<void> => {
  if (!scopedKey) return;
  // Let a future retry start fresh instead of being stuck "in_progress" forever.
  await IdempotencyKey.deleteOne({ key: scopedKey, status: "in_progress" });
};

export default idempotencyMiddleware;