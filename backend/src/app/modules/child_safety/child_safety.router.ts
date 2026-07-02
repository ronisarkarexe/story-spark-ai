import express from "express";
import validateRequest from "../../middleware/validate.request";
import { ChildSafetyValidator } from "./child_safety.validation";
import { ChildSafetyController } from "./child_safety.controller";

const router = express.Router();

// Route to analyze a story for child safety
router.post(
  "/analyze",
  validateRequest(ChildSafetyValidator.analyzeStorySchema),
  ChildSafetyController.analyzeStory
);

export const ChildSafetyRouter = router;
