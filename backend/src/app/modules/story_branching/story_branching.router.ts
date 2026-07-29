import express from "express";
import { StoryBranchingController } from "./story_branching.controller";
import auth from "../../../app/middleware/auth.middleware";

const router = express.Router();

/**
 * POST /story-branches
 * Create a new branching story with initial segment
 * Requires: Authentication
 */
router.post("/", auth(), StoryBranchingController.createBranchingStory);

/**
 * POST /story-branches/segments
 * Create a new segment branching from parent
 * Requires: Authentication
 */
router.post("/segments", auth(), StoryBranchingController.createSegment);

/**
 * GET /story-branches/:storyId/tree
 * Get complete branch tree for a story
 * Query: maxDepth (optional)
 */
router.get("/:storyId/tree", StoryBranchingController.getBranchTree);

/**
 * POST /story-branches/choices/record
 * Record user choice and track progress
 * Requires: Authentication
 */
router.post("/choices/record", auth(), StoryBranchingController.recordUserChoice);

/**
 * GET /story-branches/:storyId/progress
 * Get user's progress through a branching story
 * Requires: Authentication
 */
router.get("/:storyId/progress", auth(), StoryBranchingController.getUserProgress);

/**
 * GET /story-branches/:storyId/statistics
 * Get choice statistics for a story
 */
router.get("/:storyId/statistics", StoryBranchingController.getChoiceStatistics);

/**
 * GET /story-branches/:storyId/statistics/summary
 * Get choice statistics summary
 */
router.get("/:storyId/statistics/summary", StoryBranchingController.getStatisticsSummary);

/**
 * POST /story-branches/validate
 * Validate branch integrity
 */
router.post("/validate", StoryBranchingController.validateBranchIntegrity);

/**
 * DELETE /story-branches/segments/:segmentId
 * Delete a segment and its children
 * Requires: Authentication
 */
router.delete("/segments/:segmentId", auth(), StoryBranchingController.deleteSegment);

export const StoryBranchingRouter = router;
