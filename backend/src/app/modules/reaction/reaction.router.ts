import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middleware/auth.middleware";
import csrfMiddleware from "../../middleware/csrf.middleware";
import { ReactionController } from "./reaction.controller";

const router = express.Router();

router.post(
  "/toggle",
  auth(
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.USER
  ),
  csrfMiddleware,
  ReactionController.toggleReaction
);

export const ReactionRouter = router;
