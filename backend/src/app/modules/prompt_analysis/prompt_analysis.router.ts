import express from "express";
import validateRequest from "../../middleware/validate.request";
import { PromptAnalysisValidator } from "./prompt_analysis.validation";
import { PromptAnalysisController } from "./prompt_analysis.controller";

const router = express.Router();

/**
 * POST /api/v1/prompt-analysis/analyze
 * Analyze a prompt and get creativity score + enhancements
 */
router.post(
  "/analyze",
  validateRequest(PromptAnalysisValidator.analyzePrompt),
  PromptAnalysisController.analyzePrompt
);

/**
 * POST /api/v1/prompt-analysis/enhance
 * Get enhanced version of a prompt (subset of full analysis)
 */
router.post(
  "/enhance",
  validateRequest(PromptAnalysisValidator.analyzePrompt),
  PromptAnalysisController.enhancePrompt
);

/**
 * POST /api/v1/prompt-analysis/batch
 * Analyze multiple prompts in one request
 */
router.post("/batch", PromptAnalysisController.batchAnalyzePrompts);

export default router;
