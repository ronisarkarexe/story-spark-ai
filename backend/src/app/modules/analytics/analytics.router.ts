import express from "express";
import { AnalyticsController } from "./analytics.controller";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();
const ALL_ROLES = [
  ENUM_USER_ROLE.ADMIN,
  ENUM_USER_ROLE.SUPER_ADMIN,
  ENUM_USER_ROLE.USER,
  ENUM_USER_ROLE.WRITER,
];

router.get("/overview", auth(...ALL_ROLES), AnalyticsController.getAnalyticsOverview);
router.get("/heatmap", auth(...ALL_ROLES), AnalyticsController.getHeatmap);
router.get("/genres", auth(...ALL_ROLES), AnalyticsController.getGenreDistribution);
router.get("/wordcloud", auth(...ALL_ROLES), AnalyticsController.getWordCloud);
router.get(
  "/productive-hours",
  auth(...ALL_ROLES),
  AnalyticsController.getProductiveHours
);
router.get(
  "/emotion-distribution",
  auth(...ALL_ROLES),
  AnalyticsController.getEmotionDistribution
);
router.get(
  "/mood-timeline",
  auth(...ALL_ROLES),
  AnalyticsController.getMoodTimeline
);

export const AnalyticsRouter = router;
