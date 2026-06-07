import express from "express";
import { AiEditorController } from "./ai_editor.controller";

const router = express.Router();

// Publicly available to support both guest authors and registered writers
router.post("/analyze", AiEditorController.analyzeStory);

export const AIEditorRouter = router;
