import express from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import httpStatus from "http-status";

import validateRequest from "../app/middleware/validate.request";
import { StoryBranchingController } from "../controllers/storyBranchingController";
import auth from "../app/middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../enums/user";
import { enforceQuota } from "../app/middleware/enforceQuota.middleware";
import { PostController } from "../app/modules/post/post.controller";
import { PostValidator } from "../app/modules/post/post.validation";
import catchAsync from "../shared/catch_async";
import sendResponse from "../shared/send_response";

const router = express.Router();

const storyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const branchingStorySchema = z.object({
  body: z.object({
    storyContext: z
      .string({ required_error: "storyContext is required!" })
      .min(1, "storyContext cannot be empty")
      .max(8000, "storyContext must not exceed 8000 characters"),

    selectedChoice: z
      .string({ required_error: "selectedChoice is required!" })
      .min(1, "selectedChoice cannot be empty")
      .max(500, "selectedChoice must not exceed 500 characters"),

    genre: z.string().min(1).max(120).optional(),
  }),
});

const autosaveDraftSchema = z.object({
  draftId: z.string().min(1, "draftId is required"),
  title: z.string().default(""),
  content: z.string().default(""),
});

const autosaveDraftStore = new Map<string, { draftId: string; title: string; content: string; savedAt: string }>();

router.put(
  "/save",
  catchAsync(async (req, res) => {
    const parsed = autosaveDraftSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid autosave payload",
        errors: parsed.error.flatten(),
      });
    }

    const { draftId, title, content } = parsed.data;
    const savedAt = new Date().toISOString();

    autosaveDraftStore.set(draftId, { draftId, title, content, savedAt });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: { draftId, savedAt },
    });
  })
);

router.post(
  "/branching",
  storyLimiter,
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  enforceQuota("story_generate"),
  validateRequest(branchingStorySchema),
  StoryBranchingController.createBranchingStory
);

router.post(
  "/:id/fork",
  storyLimiter,
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  PostController.forkStory
);

router.post(
  "/bulk-delete",
  storyLimiter,
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(PostValidator.bulkDelete),
  PostController.bulkDelete
);

export const StoriesRouter = router;
