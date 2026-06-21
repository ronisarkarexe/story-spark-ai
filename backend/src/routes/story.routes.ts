import express from "express";
import { AiModelService } from "../app/modules/ai_model/ai_model.service";
import { ReviewController } from "../app/modules/review/review.controller";
import { AIModelValidator } from "../app/modules/ai_model/ai_model.validation";
import { ReviewValidator } from "../app/modules/review/review.validation";
import validateRequest from "../app/middleware/validate.request";
import auth from "../app/middleware/auth.middleware";
import checkRequestLimit from "../app/middleware/check.request.limit";
import storyGenerationRateLimiter from "../app/middleware/story.rate-limiter";
import { ENUM_USER_ROLE } from "../enums/user";
import catchAsync from "../shared/catch_async";
import sendResponse from "../shared/send_response";
import httpStatus from "http-status";
import { Request, Response } from "express";
import piiScrubberMiddleware from "../app/middleware/pii_scrubber";
import { generateStory } from "../services/ai.service";
import { runWithQuotaCleanup } from "../app/modules/ai_model/quota.lifecycle";

const router = express.Router();

/** STORY CONTINUATION - single */
router.post(
  "/continue",
  // Authenticated users get the per-user storyGenerationRateLimiter.
  // Unauthenticated requests are rejected by auth middleware first.
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  storyGenerationRateLimiter,
  checkRequestLimit(),
  piiScrubberMiddleware,
  validateRequest(AIModelValidator.aiStoryContinuation),
  catchAsync(async (req: Request, res: Response) => {
    const { prompt, language } = req.body as { prompt: string; language?: string };
    const guard = res.locals.quotaRefundGuard;

    if (!guard) {
      throw new Error(
        "Quota guard missing — checkRequestLimit middleware is required"
      );
    }

    const controller = new AbortController();
    req.on("close", () => controller.abort());

    await runWithQuotaCleanup(guard, async () => {
      const result = await AiModelService.aiModelStoryContinuation(
        { prompt, language },
        undefined,
        controller.signal
      );
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        data: result,
      });
    });
  })
);

/** STORY CONTINUATIONS - multiple */
router.post(
  "/continuations",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  storyGenerationRateLimiter,
  checkRequestLimit(),
  piiScrubberMiddleware,
  validateRequest(AIModelValidator.aiStoryContinuation),
  catchAsync(async (req: Request, res: Response) => {
    const { prompt, language, count } = req.body as { prompt: string; language?: string; count?: number };
    const guard = res.locals.quotaRefundGuard;

    if (!guard) {
      throw new Error(
        "Quota guard missing — checkRequestLimit middleware is required"
      );
    }

    const controller = new AbortController();
    req.on("close", () => controller.abort());

    await runWithQuotaCleanup(guard, async () => {
      const result = await AiModelService.aiFreeStoryContinuationMultiple(
        { prompt, language, count },
        controller.signal
      );
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        data: result,
      });
    });
  })
);

/** CREATE REVIEW */
router.post(
  "/create",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(ReviewValidator.createReview),
  ReviewController.createReview
);

/** GENERATE STORY */
router.post(
  "/generate",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  storyGenerationRateLimiter,
  checkRequestLimit(),
  catchAsync(async (req: Request, res: Response) => {
    const { prompt, provider, options } = req.body;
    const guard = res.locals.quotaRefundGuard;

    if (!guard) {
      throw new Error(
        "Quota guard missing — checkRequestLimit middleware is required"
      );
    }

    const controller = new AbortController();
    req.on("close", () => controller.abort());

    await runWithQuotaCleanup(guard, async () => {
      const result = await generateStory(prompt, provider, options);
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Story generated successfully in structured format!",
        data: result,
      });
    });
  })
);

export default router;
