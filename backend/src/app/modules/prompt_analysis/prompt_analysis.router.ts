import express from "express";
import validateRequest from "../../middleware/validate.request";
import { PromptAnalysisValidator } from "./prompt_analysis.validation";
import { PromptAnalysisController } from "./prompt_analysis.controller";
import {
  promptRateLimiter,
  promptPayloadLimit,
  sanitizePromptPayload,
} from "../../middleware/prompt.rate-limiter";

const router = express.Router();

// Apply rate limiting and payload limit to all prompt analysis routes
router.use(promptRateLimiter);
router.use(promptPayloadLimit);

/**
 * POST /api/v1/prompt-analysis/analyze
 */
router.post(
  "/analyze",
  sanitizePromptPayload,
  validateRequest(PromptAnalysisValidator.analyzePrompt),
  PromptAnalysisController.analyzePrompt
);

/**
 * POST /api/v1/prompt-analysis/enhance
 */
router.post(
  "/enhance",
  sanitizePromptPayload,
  validateRequest(PromptAnalysisValidator.analyzePrompt),
  PromptAnalysisController.enhancePrompt
);

/**
 * POST /api/v1/prompt-analysis/batch
 */
router.post(
  "/batch",
  promptRateLimiter,
  promptPayloadLimit,
  PromptAnalysisController.batchAnalyzePrompts
);

export default router;