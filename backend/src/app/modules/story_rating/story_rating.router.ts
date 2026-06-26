import express from "express";
import validateRequest from "../../middleware/validate.request";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { StoryRatingController } from "./story_rating.controller";
import { StoryRatingValidation } from "./story_rating.validation";

const router = express.Router();

// POST /story-rating — create or update a rating (auth required)
router.post(
  "/",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(StoryRatingValidation.createOrUpdateRating),
  StoryRatingController.createOrUpdateRating
);

// GET /story-rating/top-rated — top rated stories (must be before /:storyId)
router.get("/top-rated", StoryRatingController.getTopRatedStories);

// GET /story-rating/:storyId/average — average rating + distribution for a story
router.get("/:storyId/average", StoryRatingController.getAverageRating);

// GET /story-rating/:storyId/ratings — paginated ratings for a story
router.get("/:storyId/ratings", StoryRatingController.getStoryRatings);

// DELETE /story-rating/:ratingId — delete own rating (auth required)
router.delete(
  "/:ratingId",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  StoryRatingController.deleteRating
);

export const StoryRatingRouter = router;
