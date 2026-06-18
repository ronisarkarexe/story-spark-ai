import express from "express";
import { AiModelService } from "../app/modules/ai_model/ai_model.service";
import { ReviewController } from "../app/modules/review/review.controller";
import { AIModelValidator } from "../app/modules/ai_model/ai_model.validation";
import { ReviewValidator } from "../app/modules/review/review.validation";
import validateRequest from "../app/middleware/validate.request";
import auth from "../app/middleware/auth.middleware";
import freeAiRateLimiter from "../app/middleware/free-ai.rate-limiter";
import storyGenerationRateLimiter from "../app/middleware/story.rate-limiter";
import { ENUM_USER_ROLE } from "../enums/user";
import catchAsync from "../shared/catch_async";
import sendResponse from "../shared/send_response";
import httpStatus from "http-status";
import { Request, Response } from "express";
import piiScrubberMiddleware from "../app/middleware/pii_scrubber";

const router = express.Router();

/** STORY CONTINUATION - single */
router.post(
  "/continue",
  // For authenticated users: apply per-user tier-aware limit (fixes #3023).
  // For unauthenticated guests: fall back to the IP-based free limit.
  // Both middlewares are intentionally stacked so unauthenticated requests
  // still get the IP cap while authenticated users get the user-keyed one.
  freeAiRateLimiter,
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  storyGenerationRateLimiter,
  piiScrubberMiddleware,
  validateRequest(AIModelValidator.aiStoryContinuation),
  catchAsync(async (req: Request, res: Response) => {
    const { prompt, language } = req.body as { prompt: string; language?: string };
    const result = await AiModelService.aiModelStoryContinuation({ prompt, language });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
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
  piiScrubberMiddleware,
  validateRequest(AIModelValidator.aiStoryContinuation),
  catchAsync(async (req: Request, res: Response) => {
    const { prompt, language, count } = req.body as { prompt: string; language?: string; count?: number };
    const result = await AiModelService.aiFreeStoryContinuationMultiple({ prompt, language, count });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
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

export default router;
