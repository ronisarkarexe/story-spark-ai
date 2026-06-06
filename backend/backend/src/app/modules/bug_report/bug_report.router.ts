import express from "express";
import validateRequest from "../../middleware/validate.request";
import { bugReportRateLimiter } from "../../middleware/ip.rate-limiter";
import { BugReportController } from "./bug_report.controller";
import { BugReportValidation } from "./bug_report.validation";

const router = express.Router();

router.post(
  "/submit",
  bugReportRateLimiter,
  validateRequest(BugReportValidation.createBugReport),
  BugReportController.submitBugReport
);

export const BugReportRouter = router;
