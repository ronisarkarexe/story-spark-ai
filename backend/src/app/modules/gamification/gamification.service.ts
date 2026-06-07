import { User } from "../user/user.model";

const DAILY_LOGIN_XP = 10;

const calculateLevel = (xp: number) => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

const updateDailyStreak = async (userId: string) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const now = new Date();

    const user = await User.findById(userId).select(
      "gamification.lastActiveDate gamification.xp gamification.level"
    );
    if (!user) return;

    const currentXp = user.gamification?.xp || 0;
    const newLevel = calculateLevel(currentXp + DAILY_LOGIN_XP);

    const lastActive = user.gamification?.lastActiveDate;

    if (!lastActive) {
      await User.findOneAndUpdate(
        {
          _id: userId,
          $or: [
            { "gamification.lastActiveDate": { $exists: false } },
            { "gamification.lastActiveDate": null },
          ],
        },
        {
          $set: {
            "gamification.streak": 1,
            "gamification.lastActiveDate": now,
          },
          $inc: { "gamification.xp": DAILY_LOGIN_XP },
          $max: { "gamification.level": newLevel },
          $setOnInsert: {
            "gamification.xp": 0,
            "gamification.level": 1,
            "gamification.badges": [],
          },
        }
      );

      return;
    }

    const lastActiveDate = new Date(lastActive);
    lastActiveDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastActiveDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      await User.findOneAndUpdate(
        {
          _id: userId,
          "gamification.lastActiveDate": lastActive,
        },
        {
          $inc: {
            "gamification.streak": 1,
            "gamification.xp": DAILY_LOGIN_XP,
          },
          $set: { "gamification.lastActiveDate": now },
          $max: { "gamification.level": newLevel },
        }
      );
    } else if (diffDays > 1) {
      await User.findOneAndUpdate(
        {
          _id: userId,
          "gamification.lastActiveDate": lastActive,
        },
        {
          $inc: { "gamification.xp": DAILY_LOGIN_XP },
          $set: {
            "gamification.streak": 1,
            "gamification.lastActiveDate": now,
          },
          $max: { "gamification.level": newLevel },
        }
      );
    }
  } catch (error) {
    console.error("Error updating daily streak:", error);
  }
};

const addXp = async (userId: string, amount: number, reason: string) => {
  try {
    await User.updateOne(
      { _id: userId },
      [
        {
          $set: {
            "gamification.xp": { $add: [{ $ifNull: ["$gamification.xp", 0] }, amount] }
          }
        },
        {
          $set: {
            "gamification.level": {
              $max: [
                { $ifNull: ["$gamification.level", 1] },
                { $add: [{ $floor: { $sqrt: { $divide: ["$gamification.xp", 100] } } }, 1] }
              ]
            }
          }
        }
      ]
    );
  } catch (error) {
    console.error(`Error adding XP for ${reason}:`, error);
  }
};

const awardBadge = async (userId: string, badgeName: string) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { "gamification.badges": badgeName },
    });
  } catch (error) {
    console.error("Error awarding badge:", error);
  }
};

export const GamificationService = {
  updateDailyStreak,
  addXp,
  awardBadge,
};
