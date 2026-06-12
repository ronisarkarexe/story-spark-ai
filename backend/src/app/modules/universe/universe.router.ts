import express from "express";
import { UniverseController } from "./universe.controller";
import validateRequest from "../../middleware/validate.request";
import { UniverseValidation } from "./universe.validation";
import auth from "../../middleware/auth.middleware";

const router = express.Router();

// Universe CRUD
router.post(
  "/",
  auth(),
  validateRequest(UniverseValidation.createUniverse),
  UniverseController.createUniverse
);

router.get("/", auth(), UniverseController.getAllUniverses);

router.get("/:id", auth(), UniverseController.getUniverseById);

router.patch(
  "/:id",
  auth(),
  validateRequest(UniverseValidation.updateUniverse),
  UniverseController.updateUniverse
);

router.delete("/:id", auth(), UniverseController.deleteUniverse);

// Memory CRUD
router.post(
  "/:id/memories",
  auth(),
  validateRequest(UniverseValidation.createMemory),
  UniverseController.createMemory
);

router.get("/:id/memories", auth(), UniverseController.getMemories);

router.patch(
  "/:id/memories/:memoryId",
  auth(),
  validateRequest(UniverseValidation.updateMemory),
  UniverseController.updateMemory
);

router.delete("/:id/memories/:memoryId", auth(), UniverseController.deleteMemory);

// Retrieve lore based on text context
router.post("/:id/retrieve", auth(), UniverseController.retrieveLore);

export const UniverseRouter = router;
