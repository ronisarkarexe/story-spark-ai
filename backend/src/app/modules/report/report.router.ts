import express from "express";
import { ReportController } from "./report.controller";
import { ReportValidation } from "./report.validation";
import auth from "../../middleware/auth.middleware";
import validateRequest from "../../middleware/validate.request";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { apiRateLimiter } from "../../middleware/rateLimit.middleware";

const router = express.Router();

// Apply general API rate limiting to all report and resolution endpoints
router.use(apiRateLimiter);

router.post(
  "/",
  auth(
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.USER
  ),
  validateRequest(ReportValidation.createReport),
  ReportController.createReport
);

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  ReportController.getAllReports
);

router.get(
  "/pending-comments",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  ReportController.getPendingCommentReports
);

router.patch(
  "/:id/resolve",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(ReportValidation.resolveReport),
  ReportController.resolveReport
);

export const ReportRouter = router;