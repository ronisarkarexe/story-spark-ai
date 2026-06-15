import { Request, Response } from "express";
import Character from "../models/character/character.model";

// 1. CREATE a new character
export const createCharacter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, archetype, backstory, personalityTraits, abilitiesOrSkills, aiPromptContext } = req.body;
    
    // In a real app, req.user is populated by your authentication middleware
    const userId = (req as any).user?._id || req.body.userId; 

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: Missing user authentication context" });
      return;
    }

    const newCharacter = new Character({
      userId,
      name,
      archetype,
      backstory,
      personalityTraits,
      abilitiesOrSkills,
      aiPromptContext
    });

    const savedCharacter = await newCharacter.save();
    res.status(201).json({ message: "Character forged successfully!", character: savedCharacter });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to forge character", error: error.message });
  }
};

// 2. READ all characters belonging to the logged-in user
export const getUserCharacters = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?._id || req.query.userId;

    if (!userId) {
      res.status(400).json({ message: "Missing user identification" });
      return;
    }

    const characters = await Character.find({ userId });
    res.status(200).json(characters);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to retrieve characters", error: error.message });
  }
};

// 3. UPDATE an existing character profile
export const updateCharacter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedCharacter = await Character.findByIdAndUpdate(id, updatedData, {
      new: true, // Returns the modified document rather than the original
      runValidators: true, // Ensures updates adhere to schema rules
    });

    if (!updatedCharacter) {
      res.status(404).json({ message: "Character profile not found" });
      return;
    }

    res.status(200).json({ message: "Character adapted successfully!", character: updatedCharacter });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update character", error: error.message });
  }
};

// 4. DELETE a character
export const deleteCharacter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedCharacter = await Character.findByIdAndDelete(id);

    if (!deletedCharacter) {
      res.status(404).json({ message: "Character profile not found" });
      return;
    }

    res.status(200).json({ message: "Character cast out successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete character", error: error.message });
  }
};