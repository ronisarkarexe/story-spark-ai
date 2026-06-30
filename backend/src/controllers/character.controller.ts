import { NextFunction, Request, Response } from 'express';
import { Character } from '../models/Character.model';

export const createCharacter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, age, personality, appearance, background, traits, notes } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Character name is required' });
    }

    const character = new Character({
      userId,
      name: name.trim(),
      age,
      personality,
      appearance,
      background,
      traits,
      notes,
    });

    await character.save();
    res.status(201).json({ success: true, data: character });
  } catch (error) {
    next(error);
  }
};

export const getCharacters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const characters = await Character.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: characters });
  } catch (error) {
    next(error);
  }
};

export const getCharacterById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const character = await Character.findOne({ _id: id, userId });
    if (!character) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }

    res.status(200).json({ success: true, data: character });
  } catch (error) {
    next(error);
  }
};

export const updateCharacter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const updates = req.body;
    const character = await Character.findOneAndUpdate(
      { _id: id, userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!character) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }

    res.status(200).json({ success: true, data: character });
  } catch (error) {
    next(error);
  }
};

export const deleteCharacter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const character = await Character.findOneAndDelete({ _id: id, userId });
    if (!character) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }

    res.status(200).json({ success: true, message: 'Character deleted successfully' });
  } catch (error) {
    next(error);
  }
};