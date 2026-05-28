import express from "express";
import { RecommendationController } from "./recommendation.controller";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.get(
  "/personalized",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER
  ),
  RecommendationController.getPersonalizedRecommendations
);

export const RecommendationRouter = router;
