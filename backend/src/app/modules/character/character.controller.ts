import { Request, Response } from "express";
import { Character } from "./character.model";

// POST /api/v1/character/create
export const createCharacter = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, archetype, traits, backstory } = req.body;

    if (!name || !archetype || !backstory) {
      return res.status(400).json({ success: false, message: "Missing required character fields" });
    }

    const newCharacter = await Character.create({
      userId,
      name,
      archetype,
      traits: traits || [],
      backstory,
    });

    return res.status(201).json({
      success: true,
      message: "Character forged successfully!",
      character: newCharacter,
    });
  } catch (error) {
    console.error("createCharacter error:", error);
    return res.status(500).json({ success: false, message: "Failed to forge character" });
  }
};

// GET /api/v1/character/all
export const getMyCharacters = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const characters = await Character.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      characters,
    });
  } catch (error) {
    console.error("getMyCharacters error:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve characters" });
  }
};

// DELETE /api/v1/character/:id
export const deleteCharacter = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;

    const character = await Character.findOneAndDelete({ _id: id, userId });

    if (!character) {
      return res.status(404).json({ success: false, message: "Character not found or unauthorized" });
    }

    return res.status(200).json({
      success: true,
      message: "Character dismissed successfully.",
    });
  } catch (error) {
    console.error("deleteCharacter error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete character" });
  }
};