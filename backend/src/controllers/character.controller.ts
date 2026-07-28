commit 25ffbf8715a7c8f271bf0f4bab81b42a2e7362ad
Author: tmdeveloper007 <tmdeveloper007@users.noreply.github.com>
Date:   Tue Jul 28 00:17:41 2026 +0000

    fix: resolve backend TypeScript syntax errors blocking all PRs

diff --git a/backend/src/controllers/character.controller.ts b/backend/src/controllers/character.controller.ts
index 8b1563a4..8495fe55 100644
--- a/backend/src/controllers/character.controller.ts
+++ b/backend/src/controllers/character.controller.ts
@@ -1,140 +1,9 @@
 import { NextFunction, Request, Response } from 'express';
 import { Character } from '../models/Character.model';
-
-export const createCharacter = async (req: Request, res: Response, next: NextFunction) => {
-  try {
-    const { name, age, personality, appearance, background, traits, notes } = req.body;
-    
-    if (!name || typeof name !== "string") {
-      return res.status(400).json({
-        success: false,
-        message: "Name is required"
-      });
-    }
-
-    if (!appearance || typeof appearance !== "string") {
-      return res.status(400).json({
-        success: false,
-        message: "Appearance is required"
-      });
-    }
-
-    if (personality && !Array.isArray(personality)) {
-      return res.status(400).json({
-        success: false,
-        message: "Personality must be an array"
-      });
-    }
-
-    const userId = req.user?.id;
-
-    if (!userId) {
-      return res.status(401).json({ success: false, message: 'Unauthorized' });
-    }
-
-    if (!name || typeof name !== 'string' || !name.trim()) {
-      return res.status(400).json({ success: false, message: 'Character name is required' });
-    }
-
-    const character = new Character({
-      userId,
-      name: name.trim(),
-      age,
-      personality,
-      appearance,
-      background,
-      traits,
-      notes,
-    });
-
-    await character.save();
-    res.status(201).json({ success: true, data: character });
-  } catch (error) {
-    next(error);
-  }
-};
-
-export const getCharacters = async (req: Request, res: Response, next: NextFunction) => {
-  try {
-    const userId = req.user?.id;
-    if (!userId) {
-      return res.status(401).json({ success: false, message: 'Unauthorized' });
-    }
-
-    const characters = await Character.find({ userId }).sort({ createdAt: -1 });
-    res.status(200).json({ success: true, data: characters });
-  } catch (error) {
-    next(error);
-  }
-};
-
-export const getCharacterById = async (req: Request, res: Response, next: NextFunction) => {
-  try {
-    const { id } = req.params;
-    const userId = req.user?.id;
-
-    if (!userId) {
-      return res.status(401).json({ success: false, message: 'Unauthorized' });
-    }
-
-    const character = await Character.findOne({ _id: id, userId });
-    if (!character) {
-      return res.status(404).json({ success: false, message: 'Character not found' });
-    }
-
-    res.status(200).json({ success: true, data: character });
-  } catch (error) {
-    next(error);
-  }
-};
-
-export const updateCharacter = async (req: Request, res: Response, next: NextFunction) => {
-  try {
-    const { id } = req.params;
-    const userId = req.user?.id;
-
-    if (!userId) {
-      return res.status(401).json({ success: false, message: 'Unauthorized' });
-    }
-
-    const updates = req.body;
-    const character = await Character.findOneAndUpdate(
-      { _id: id, userId },
-      { $set: updates },
-      { new: true, runValidators: true }
-    );
-
-    if (!character) {
-      return res.status(404).json({ success: false, message: 'Character not found' });
-    }
-
-    res.status(200).json({ success: true, data: character });
-  } catch (error) {
-    next(error);
-  }
-};
-
-export const deleteCharacter = async (req: Request, res: Response, next: NextFunction) => {
-  try {
-    const { id } = req.params;
-    const userId = req.user?.id;
-
-    if (!userId) {
-      return res.status(401).json({ success: false, message: 'Unauthorized' });
-    }
-
-    const character = await Character.findOneAndDelete({ _id: id, userId });
-    if (!character) {
-      return res.status(404).json({ success: false, message: 'Character not found' });
-    }
-
-    res.status(200).json({ success: true, message: 'Character deleted successfully' });
-  } catch (error) {
-    next(error);
-import { Character } from '../Character.model';
 import ApiError from '../errors/api_error';
 import httpStatus from 'http-status';
 import catchAsync from '../shared/catch_async';
+
 export const createCharacter = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const { name, age, personality, appearance, background, traits, notes } = req.body;
   const userId = req.user?.id;
@@ -192,22 +61,26 @@ export const updateCharacter = catchAsync(async (req: Request, res: Response, ne
     throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
   }
 
-  const updates = req.body;
-  delete updates.userId;
-  delete updates._id;
-  delete updates.createdAt;
-  delete updates.updatedAt;
-  const character = await Character.findOneAndUpdate(
-    { _id: id, userId },
-    { $set: updates },
-    { new: true, runValidators: true }
-  );
+  try {
+    const updates = req.body;
+    delete updates.userId;
+    delete updates._id;
+    delete updates.createdAt;
+    delete updates.updatedAt;
+    const character = await Character.findOneAndUpdate(
+      { _id: id, userId },
+      { $set: updates },
+      { new: true, runValidators: true }
+    );
 
-  if (!character) {
-    throw new ApiError(httpStatus.NOT_FOUND, 'Character not found');
-  }
+    if (!character) {
+      throw new ApiError(httpStatus.NOT_FOUND, 'Character not found');
+    }
 
-  res.status(200).json({ success: true, data: character });
+    res.status(200).json({ success: true, data: character });
+  } catch (error) {
+    next(error);
+  }
 });
 
 export const deleteCharacter = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
@@ -218,10 +91,14 @@ export const deleteCharacter = catchAsync(async (req: Request, res: Response, ne
     throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
   }
 
-  const character = await Character.findOneAndDelete({ _id: id, userId });
-  if (!character) {
-    throw new ApiError(httpStatus.NOT_FOUND, 'Character not found');
-  }
+  try {
+    const character = await Character.findOneAndDelete({ _id: id, userId });
+    if (!character) {
+      throw new ApiError(httpStatus.NOT_FOUND, 'Character not found');
+    }
 
-  res.status(200).json({ success: true, message: 'Character deleted successfully' });
+    res.status(200).json({ success: true, message: 'Character deleted successfully' });
+  } catch (error) {
+    next(error);
+  }
 });
