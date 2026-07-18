import { Request, Response } from 'express';
import { Character } from '../Character.model';

export const createCharacter = async (req: Request, res: Response) => {
  try {
    const { name, role, age, personality, appearance, background, traits, notes } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const character = new Character({
      userId,
      name,
      role,
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
    console.error('Create character error:', error);
    res.status(500).json({ success: false, message: 'Failed to create character' });
  }
};

export const getCharacters = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const characters = await Character.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: characters });
  } catch (error) {
    console.error('Get characters error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch characters' });
  }
};

export const getCharacterById = async (req: Request, res: Response) => {
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
    console.error('Get character error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch character' });
  }
};

export const updateCharacter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const updates = req.body;
    delete updates.userId;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;
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
    console.error('Update character error:', error);
    res.status(500).json({ success: false, message: 'Failed to update character' });
  }
};

export const deleteCharacter = async (req: Request, res: Response) => {
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
    console.error('Delete character error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete character' });
  }
};
