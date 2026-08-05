import express from "express";
import auth from "../../middleware/auth.middleware";
import { AiModelController } from "./ai_model.controller";

const router = express.Router();

router.get("/me", auth(), AiModelController.getUsageMe);

export const UsageRouter = router;
