import express from "express";
import { ConsistencyController } from "./consistency.controller";
import auth from "../../middleware/auth"; // Assuming auth middleware exists
import { ENUM_USER_ROLE } from "../../../enums/user"; // Need to check if this exists or just use a string

const router = express.Router();

router.post(
  "/analyze/:postId",
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.WRITER),
  ConsistencyController.generateReport
);

router.get(
  "/report/:postId",
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.WRITER),
  ConsistencyController.getReport
);

export const ConsistencyRoutes = router;
