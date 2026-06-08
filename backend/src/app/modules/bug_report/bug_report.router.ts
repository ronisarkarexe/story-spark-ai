import express from "express";
import multer from "multer";
import validateRequest from "../../middleware/validate.request";
import { bugReportRateLimiter } from "../../middleware/ip.rate-limiter";
import { BugReportController } from "./bug_report.controller";
import { BugReportValidation } from "./bug_report.validation";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const router = express.Router();

router.post(
  "/submit",
  bugReportRateLimiter,
  upload.single("screenshot"),
  validateRequest(BugReportValidation.createBugReport),
  BugReportController.submitBugReport
);

export const BugReportRouter = router;