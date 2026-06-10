import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middleware/auth.middleware";
import validateRequest from "../../middleware/validate.request";
import { SuggestionController } from "./suggestion.controller";
import { SuggestionValidator } from "./suggestion.validation";
import { storyRateLimiter } from "../../../middlewares/rateLimitMiddleware";

const router = express.Router();

router.post(
  "/generate",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  storyRateLimiter,
  validateRequest(SuggestionValidator.generateSuggestion),
  SuggestionController.generate
);

router.post(
  "/accept/:id",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(SuggestionValidator.handleSuggestionStatus),
  SuggestionController.accept
);

router.post(
  "/reject/:id",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(SuggestionValidator.handleSuggestionStatus),
  SuggestionController.reject
);

router.get(
  "/history",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  SuggestionController.history
);

router.delete(
  "/history/:id",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(SuggestionValidator.handleSuggestionStatus),
  SuggestionController.remove
);

export const SuggestionRouter = router;
