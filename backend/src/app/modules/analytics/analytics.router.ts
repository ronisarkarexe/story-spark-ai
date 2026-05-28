import express from "express";
import { AnalyticsController } from "./analytics.controller";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.get("/overview", AnalyticsController.getAnalyticsOverview);
router.get("/heatmap", AnalyticsController.getHeatmap);
router.get("/genres", AnalyticsController.getGenreDistribution);
router.get("/wordcloud", AnalyticsController.getWordCloud);
router.get(
  "/productive-hours",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER
  ),
  AnalyticsController.getProductiveHours
);

router.get(
  "/emotion-distribution",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER
  ),
  AnalyticsController.getEmotionDistribution
);

router.get(
  "/mood-timeline",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER
  ),
  AnalyticsController.getMoodTimeline
);

export const AnalyticsRouter = router;