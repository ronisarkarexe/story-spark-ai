import express from "express";
import { PlotHoleController } from "./plot_hole.controller";
import validateRequest from "../../middleware/validate.request";
import { PlotHoleValidator } from "./plot_hole.validation";

const router = express.Router();

router.post(
  "/detect",
  validateRequest(PlotHoleValidator.detectSchema),
  PlotHoleController.detect,
);

export const PlotHoleRouter = router;
