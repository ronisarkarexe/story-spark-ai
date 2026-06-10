import express from "express";
import { AiModelService } from "../app/modules/ai_model/ai_model.service";
import { ReviewController } from "../app/modules/review/review.controller";
import { AIModelValidator } from "../app/modules/ai_model/ai_model.validation";
import { ReviewValidator } from "../app/modules/review/review.validation";
import validateRequest from "../app/middleware/validate.request";
import auth from "../app/middleware/auth.middleware";
import freeAiRateLimiter from "../app/middleware/free-ai.rate-limiter";
import { ENUM_USER_ROLE } from "../enums/user";
import catchAsync from "../shared/catch_async";
import sendResponse from "../shared/send_response";
import httpStatus from "http-status";
import { Request, Response } from "express";
import piiScrubberMiddleware from "../app/middleware/pii_scrubber";

const router = express.Router();

/**
 * STORY CONTINUATION
 * POST /api/v1/story-continuation/continue
 *
 * Previously returned a hardcoded string and never called the AI.
 * Now validates the request body, applies a rate limit, and delegates
 * to AiModelService.aiFreeStoryContinuation which calls Gemini.
 */
router.post(
  "/continue",
  freeAiRateLimiter,
  piiScrubberMiddleware,
  validateRequest(AIModelValidator.aiStoryContinuation),
  catchAsync(async (req: Request, res: Response) => {
    const { prompt, language } = req.body as { prompt: string; language?: string };
    const result = await AiModelService.aiFreeStoryContinuation({ prompt, language });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Story continuation generated successfully!",
      data: result,
    });
  })
);

/**
 * CREATE REVIEW
 * POST /api/v1/story-continuation/create
 *
 * Previously was a no-op stub that always returned 201 without
 * authentication, validation, or a database write.
 * Now requires authentication, validates the request body, and
 * persists the review via ReviewController.createReview.
 */
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
