import express from "express";
import * as CharacterController from "./character.controller";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

// Create a new character
router.post(
  "/create",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  CharacterController.createCharacter
);

// Get all characters belonging to the logged-in user
router.get(
  "/all",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  CharacterController.getMyCharacters
);

// Delete a character by ID
router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  CharacterController.deleteCharacter
);

export const CharacterRouter = router;