import express from "express";
import auth from "../../middleware/auth.middleware";
import validateRequest from "../../middleware/validate.request";
import checkRequestLimit from "../../middleware/check.request.limit";
import rateLimit from "express-rate-limit";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { ChapterIllustrationController } from "./chapter_illustration.controller";
import { ChapterIllustrationValidator } from "./chapter_illustration.validation";

const router = express.Router();

// Rate limiter for image generation
const imageGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests per hour
  keyGenerator: (req: any) => req.user?.id ?? req.ip ?? "unknown",
  standardHeaders: true,
  legacyHeaders: false,
});

// Generate illustration for single chapter
router.post(
  "/generate",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  imageGenerationLimiter,
  checkRequestLimit(),
  validateRequest(ChapterIllustrationValidator.generateIllustration),
  ChapterIllustrationController.generateIllustration
);

// Generate illustrations for multiple chapters
router.post(
  "/batch",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  imageGenerationLimiter,
  checkRequestLimit(),
  validateRequest(ChapterIllustrationValidator.batchGenerateIllustrations),
  ChapterIllustrationController.generateBatchIllustrations
);

// Clear expired cache (admin only)
const adminCacheLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour for admin
  keyGenerator: (req: any) => req.user?.id ?? req.ip ?? "unknown",
  standardHeaders: true,
  legacyHeaders: false,
});

router.delete(
  "/cache",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  adminCacheLimiter,
  ChapterIllustrationController.clearCache
);

export const ChapterIllustrationRouter = router;
