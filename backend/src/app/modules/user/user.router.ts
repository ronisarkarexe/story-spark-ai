import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";
import validateRequest from "../../middleware/validate.request";
import { UserValidator } from "./user.validation";

const router = express.Router();

// User List
router.get("/lists", auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), UserController.getAllUsers);

// Profile
router.get("/profile", UserController.getProfileInfo);

// Apply for Writer
router.get(
  "/writer-application-list",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.WRITER),
  UserController.getAllWriterApplicationUsers
);

// Get Single User
router.get(
  "/:id",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  UserController.getUser
);

// Update Single User
router.patch(
  "/update",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(UserValidator.updateUser),
  UserController.updateUser
);

// Delete Single User
router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.deleteUser
);

// Apply for Writer
router.post(
  "/apply-for-writer",
  auth(ENUM_USER_ROLE.USER),
  UserController.applyForWriter
);

// Apply for Writer
router.post(
  "/approve-writer-application",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.WRITER),
  UserController.approveWriterApplication
);

// Follow / Unfollow
router.post(
  "/follow/:authorId",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  UserController.toggleFollow
);

// Get Follow Status
router.get(
  "/follow-status/:authorId",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  UserController.getFollowStatus
);

export const UserRouter = router;
