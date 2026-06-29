import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middleware/auth.middleware";
import { NarrationController } from "./narration.controller";

const router = express.Router();

import rateLimit from 'express-rate-limit';

const narrationRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: 'Too many requests, please try again later.',
});

router.get("/voices", narrationRateLimiter, NarrationController.getVoices);
router.post(
  "/synthesize",
  narrationRateLimiter,
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  NarrationController.synthesize
);

router.get("/audio/:filename", narrationRateLimiter, NarrationController.getAudioFile);

export const NarrationRouter = router;
