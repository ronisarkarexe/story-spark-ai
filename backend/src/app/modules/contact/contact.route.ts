import express from "express";
import validateRequest from "../../middleware/validate.request";
import { ContactController } from "./contact.controller";
import { ContactValidation } from "./contact.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(ContactValidation.contactValidationSchema),
  ContactController.submitContactForm
);

export const ContactRoutes = router;
