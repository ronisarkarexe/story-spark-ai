import express from "express";
import { ReportController } from "./report.controller";
import { ReportValidation } from "./report.validation";
import auth from "../../middleware/auth.middleware";
import validateRequest from "../../middleware/validate.request";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/",
  auth(
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.USER
  ),
  validateRequest(ReportValidation.createReport),
  ReportController.createReport
);

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  ReportController.getAllReports
);
export const ReportRouter = router;