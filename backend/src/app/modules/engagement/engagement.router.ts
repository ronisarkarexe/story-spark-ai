import express from "express";
import { EngagementController } from "./engagement.controller";

const router = express.Router();

router.post("/analyze", EngagementController.analyzeChapter);

export const EngagementRouter = router;
