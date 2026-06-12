import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middleware/auth.middleware";
import { NarrationController } from "./narration.controller";

const router = express.Router();

router.get("/voices", NarrationController.getVoices);
router.post(
  "/synthesize",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  NarrationController.synthesize
);
router.get("/audio/:filename", NarrationController.getAudioFile);

export const NarrationRouter = router;
