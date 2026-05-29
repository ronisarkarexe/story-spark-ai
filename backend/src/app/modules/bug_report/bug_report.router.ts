import express from "express";
import validateRequest from "../../middleware/validate.request";
import { BugReportController } from "./bug_report.controller";
import { BugReportValidation } from "./bug_report.validation";

const router = express.Router();

router.post(
  "/submit",
  validateRequest(BugReportValidation.createBugReport),
  BugReportController.submitBugReport
);

export const BugReportRouter = router;
