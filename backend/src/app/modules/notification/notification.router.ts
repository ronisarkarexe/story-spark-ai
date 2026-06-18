import express from "express";
import { NotificationController } from "./notification.controller";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.get(
  "/",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.USER
  ),
  NotificationController.getUserNotifications
);

router.patch(
  "/:id/read",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.USER
  ),
  NotificationController.markNotificationAsRead
);

router.patch(
  "/mark-all-read",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.USER
  ),
  NotificationController.markAllNotificationsAsRead
);

router.delete(
  "/",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.USER
  ),
  NotificationController.deleteAllNotifications
);

export const NotificationRouter = router;
