import { Router } from "express";
import { 
  createCharacter, 
  getUserCharacters, 
  updateCharacter, 
  deleteCharacter 
} from "../controllers/character.controller";

const router = Router();

// Base path context will be registered as: /api/v1/characters (or similar)
router.post("/", createCharacter);       // POST   /api/v1/characters
router.get("/", getUserCharacters);     // GET    /api/v1/characters
router.put("/:id", updateCharacter);    // PUT    /api/v1/characters/:id
router.delete("/:id", deleteCharacter); // DELETE /api/v1/characters/:id

export default router;