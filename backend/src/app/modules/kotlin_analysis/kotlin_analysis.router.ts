import express from "express";
import validateRequest from "../../middleware/validate.request";
import { KotlinAnalysisValidator } from "./kotlin_analysis.validation";
import { KotlinAnalysisController } from "./kotlin_analysis.controller";

const router = express.Router();

/**
 * POST /api/v1/kotlin-analysis/analyze
 * Analyze Kotlin code for common anti-patterns
 */
router.post(
  "/analyze",
  validateRequest(KotlinAnalysisValidator.analyzeKotlin),
  KotlinAnalysisController.analyzeKotlin
);

export const KotlinAnalysisRouter = router;
