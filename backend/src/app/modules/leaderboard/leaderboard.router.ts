import { Router } from "express";
import { getWeeklyLeaderboardController } from "./leaderboard.controller";

const router = Router();

router.get("/", getWeeklyLeaderboardController);

export const LeaderboardRoutes = router;