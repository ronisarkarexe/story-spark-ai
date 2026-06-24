import { Router } from "express";
import { getWeeklyLeaderboard } from "./leaderboard.controller";

const router = Router();

router.get("/", getWeeklyLeaderboard);

export const LeaderboardRoutes = router;