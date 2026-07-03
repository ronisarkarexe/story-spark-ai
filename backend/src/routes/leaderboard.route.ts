import { Router } from "express";
import { weeklyLeaderboardController } from "../controllers/leaderboard.controller";

const router = Router();

router.get("/weekly", weeklyLeaderboardController);

export default router;