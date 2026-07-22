import express from "express";
import validateRequest from "../../middleware/validate.request";
import { CodeAnalysisValidator } from "./code_analysis.validation";
import { CodeAnalysisController } from "./code_analysis.controller";

const router = express.Router();

/**
 * POST /api/v1/code-analysis/swift
 * Analyze Swift code for common anti-patterns
 */
router.post(
  "/swift",
  validateRequest(CodeAnalysisValidator.analyzeSwift),
  CodeAnalysisController.analyzeSwift
);

export const CodeAnalysisRouter = router;
