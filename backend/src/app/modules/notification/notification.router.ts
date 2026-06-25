import express from "express";
import { NotificationController } from "./notification.controller";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

const allRoles = auth(
  ENUM_USER_ROLE.ADMIN,
  ENUM_USER_ROLE.SUPER_ADMIN,
  ENUM_USER_ROLE.WRITER,
  ENUM_USER_ROLE.USER
);

// Existing routes
router.get("/", allRoles, NotificationController.getUserNotifications);
router.patch("/mark-all-read", allRoles, NotificationController.markAllNotificationsAsRead);
router.patch("/:id/read", allRoles, NotificationController.markNotificationAsRead);
router.delete("/", allRoles, NotificationController.deleteAllNotifications);

// New push notification routes
router.post("/subscribe", allRoles, NotificationController.subscribePush);
router.delete("/subscribe", allRoles, NotificationController.unsubscribePush);
router.patch("/preferences", allRoles, NotificationController.updateNotificationPreferences);

export const NotificationRouter = router;