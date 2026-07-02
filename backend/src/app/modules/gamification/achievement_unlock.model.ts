import { Schema, model } from "mongoose";
import { IAchievementUnlock, AchievementUnlockModel } from "./achievement_unlock.interface";

const AchievementUnlockSchema = new Schema<IAchievementUnlock, AchievementUnlockModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    achievementId: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: true,
  }
);

// Unique index to prevent duplicate unlocks for the same user + achievement
AchievementUnlockSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export const AchievementUnlock = model<IAchievementUnlock, AchievementUnlockModel>(
  "AchievementUnlock",
  AchievementUnlockSchema
);
