import express from "express";
import { WriterApplicationController } from "./writer_application.controller";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";
import validateRequest from "../../middleware/validate.request";
import { WriterApplicationValidation } from "./writer_application.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.USER),
  validateRequest(WriterApplicationValidation.submitApplicationZodSchema),
  WriterApplicationController.submitApplication
);

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  WriterApplicationController.getAllApplications
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(WriterApplicationValidation.updateApplicationStatusZodSchema),
  WriterApplicationController.updateApplicationStatus
);

export const WriterApplicationRoutes = router;
