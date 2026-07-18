import { NextFunction, Request, Response } from 'express';
import { Character } from '../Character.model';
import ApiError from '../errors/api_error';
import httpStatus from 'http-status';
import catchAsync from '../shared/catch_async';
export const createCharacter = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, age, personality, appearance, background, traits, notes } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const character = await Character.create({
    userId,
    name,
    age,
    personality,
    appearance,
    background,
    traits,
    notes,
  });

  res.status(201).json({ success: true, data: character });
});

export const getCharacters = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const characters = await Character.find({ userId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: characters });
});

export const getCharacterById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const character = await Character.findOne({ _id: id, userId });
  if (!character) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Character not found');

  }

  res.status(200).json({ success: true, data: character });
});

export const updateCharacter = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Character not found');
  }

  res.status(200).json({ success: true, data: character });
});

export const deleteCharacter = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const character = await Character.findOneAndDelete({ _id: id, userId });
  if (!character) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Character not found');
  }

  res.status(200).json({ success: true, message: 'Character deleted successfully' });
});
