import express from "express";
import httpStatus from "http-status";
import validateRequest from "../app/middleware/validate.request";
import { AIModelValidator } from "../app/modules/ai_model/ai_model.validation";
import freeAiRateLimiter from "../app/middleware/free-ai.rate-limiter";
import catchAsync from "../shared/catch_async";
import sendResponse from "../shared/send_response";
import { AiModelService } from "../app/modules/ai_model/ai_model.service";

const router = express.Router();

router.post(
  "/continue",
  validateRequest(AIModelValidator.aiStoryContinuation),
  freeAiRateLimiter,
  catchAsync(async (req, res) => {
    const { prompt, language } = req.body;

    const result = await AiModelService.aiFreeStoryContinuation({
      prompt,
      language,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Story continuation generated successfully!",
      data: result,
    });
  })
);

export default router;
