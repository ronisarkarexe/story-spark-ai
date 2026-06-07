import { Model, Types } from "mongoose";

export interface IAchievementUnlock {
  userId: Types.ObjectId;
  achievementId: string;
  unlockedAt: Date;
}

export type AchievementUnlockModel = Model<IAchievementUnlock, object>;
