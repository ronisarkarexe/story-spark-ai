import express from "express";
import validateRequest from "../../middleware/validate.request";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { DialogueFingerprintValidator } from "./dialogueFingerprint.validation";
import { DialogueFingerprintController } from "./dialogueFingerprint.controller";
import { dialogueFingerprintRateLimiter } from "../../middleware/ip.rate-limiter";

const router = express.Router();

router.post(
  "/:storyId/dialogue-fingerprint",
  dialogueFingerprintRateLimiter,
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(DialogueFingerprintValidator.generateFingerprintSchema),
  DialogueFingerprintController.analyzeDialogueVoices
);

export const DialogueFingerprintRouter = router;
