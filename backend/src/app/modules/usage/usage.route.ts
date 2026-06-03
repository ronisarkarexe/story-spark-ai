import express from "express";
import { UsageController } from "./usage.controller";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.get(
  "/me",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  UsageController.getUsage
);

export const UsageRouter = router;
