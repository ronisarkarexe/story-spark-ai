import express from "express";
import { AiModelController } from "./ai_model.controller";
import validateRequest from "../../middleware/validate.request";
import { AIModelValidator } from "./ai_model.validation";
import checkRequestLimit from "../../middleware/check.request.limit";
const router = express.Router();

// Generate Model
router.post(
  "/generate-model",
  validateRequest(AIModelValidator.aiModel),
  checkRequestLimit(),
  AiModelController.aiModelGenerate
);

// Generate Free Model
router.post(
  "/generate-free-model",
  validateRequest(AIModelValidator.aiModel),
  AiModelController.aiFreeModelGenerate
);

// Generate Alternate Endings
router.post(
  "/generate-alternate-endings",
  validateRequest(AIModelValidator.aiAlternateEndings),
  checkRequestLimit(),
  AiModelController.aiModelAlternateEndings
);

// Generate Free Alternate Endings
router.post(
  "/generate-free-alternate-endings",
  validateRequest(AIModelValidator.aiAlternateEndings),
  AiModelController.aiFreeModelAlternateEndings
);

export const AIModelRouter = router;

