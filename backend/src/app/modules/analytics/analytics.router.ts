import express from "express";
import { AnalyticsController } from "./analytics.controller";

const router = express.Router();

router.get("/overview", AnalyticsController.getAnalyticsOverview);
router.get("/heatmap", AnalyticsController.getHeatmap);
router.get("/genres", AnalyticsController.getGenreDistribution);
router.get("/wordcloud", AnalyticsController.getWordCloud);
router.get("/productive-hours", AnalyticsController.getProductiveHours);

export const AnalyticsRouter = router;