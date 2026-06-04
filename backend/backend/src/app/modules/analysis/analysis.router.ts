import express from "express";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { AnalysisController } from "./analysis.controller";

const router = express.Router();

// Route to get dashboard analysis
router.get(
  "/dashboard",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  AnalysisController.getDashboardAnalysis
);

export const AnalysisRouter = router;
