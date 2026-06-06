import express from "express";

import validateRequest from "../../middleware/validate.request";
import auth from "../../middleware/auth.middleware";

import { ENUM_USER_ROLE } from "../../../enums/user";

import { ReviewController } from "./review.controller";
import { ReviewValidator } from "./review.validation";

const router = express.Router();

// Public published reviews
router.get(
  "/lists",
  ReviewController.getPublishedReviews
);

// Pending reviews (Admin only)
router.get(
  "/pending",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  ReviewController.getPendingReviews
);

// Create review
router.post(
  "/create",
  auth(
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.USER
  ),
  validateRequest(ReviewValidator.createReview),
  ReviewController.createReview
);

// Approve review (Admin only)
router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  ReviewController.approveReview
);

export const ReviewRouter = router;