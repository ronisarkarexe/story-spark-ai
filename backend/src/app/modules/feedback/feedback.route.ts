import express from "express";
import { FeedbackController } from "./feedback.controller";
import validateRequest from "../../middleware/validate.request";
import { FeedbackValidation } from "./feedback.validation";

const router = express.Router();

router.post("/", validateRequest(FeedbackValidation.feedbackValidationSchema), FeedbackController.submitFeedback);

export const FeedbackRoutes = router;
