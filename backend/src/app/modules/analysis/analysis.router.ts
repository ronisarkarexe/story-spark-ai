import express from "express";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { AnalysisController } from "./analysis.controller";
import validateRequest from "../../middleware/validate.request";
import { AnalysisValidator } from "./analysis.validation";

const router = express.Router();

// Route to get dashboard analysis
router.get(
  "/dashboard",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  AnalysisController.getDashboardAnalysis
);

// Route to analyze generated story content
router.post(
  "/analyze-story",
  validateRequest(AnalysisValidator.analyzeStorySchema),
  AnalysisController.analyzeStory
);

export const AnalysisRouter = router;

