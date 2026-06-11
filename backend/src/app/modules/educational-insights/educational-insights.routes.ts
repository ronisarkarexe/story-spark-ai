import express from "express";
import validateRequest from "../../middleware/validate.request";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { EducationalInsightsValidator } from "./educational-insights.validation";
import { EducationalInsightsController } from "./educational-insights.controller";

const router = express.Router();

router.post(
  "/:storyId/educational-insights",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(EducationalInsightsValidator.generateInsightsSchema),
  EducationalInsightsController.generateEducationalInsights
);

export const EducationalInsightsRouter = router;
