import { Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { Character } from "../Character.model";
import { generateCharacterPortrait } from "../utils/character_portrait_generation";

export const generatePortrait = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid character ID",
      });
      return;
    }

    const character = await Character.findOne({
      _id: id,
      userId,
    });

    if (!character) {
      res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Character not found",
      });
      return;
    }

    const portraitUrl = await generateCharacterPortrait({
      name: character.name,
      role: character.role,
      age: character.age,
      personality: character.personality,
      appearance: character.appearance,
      background: character.background,
      traits: character.traits,
    });

    if (!portraitUrl) {
      res.status(httpStatus.SERVICE_UNAVAILABLE).json({
        success: false,
        message: "Unable to generate character portrait",
      });
      return;
    }

    character.portraitUrl = portraitUrl;
    await character.save();

    res.status(httpStatus.OK).json({
      success: true,
      message: "Character portrait generated successfully",
      data: character,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to generate character portrait",
    });
  }
};
