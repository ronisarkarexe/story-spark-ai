import { User } from "../user/user.model";

const calculateLevel = (xp: number) => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

const updateDailyStreak = async (userId: string) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const now = new Date();

    const user = await User.findById(userId).select("gamification.lastActiveDate");
    if (!user) return;

    const lastActive = user.gamification?.lastActiveDate;

    if (!lastActive) {
      const updatedUser = await User.findOneAndUpdate(
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
          $setOnInsert: {
            "gamification.xp": 0,
            "gamification.level": 1,
            "gamification.badges": [],
          },
        },
        { new: true }
      );

      if (updatedUser) {
        await addXp(userId, 10, "First login");
      }

      return;
    }

    const lastActiveDate = new Date(lastActive);
    lastActiveDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastActiveDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: userId,
          "gamification.lastActiveDate": lastActive,
        },
        {
          $inc: { "gamification.streak": 1 },
          $set: { "gamification.lastActiveDate": now },
        },
        { new: true }
      );

      if (updatedUser) {
        await addXp(userId, 10, "Daily Streak XP");
      }
    } else if (diffDays > 1) {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: userId,
          "gamification.lastActiveDate": lastActive,
        },
        {
          $set: {
            "gamification.streak": 1,
            "gamification.lastActiveDate": now,
          },
        },
        { new: true }
      );

      if (updatedUser) {
        await addXp(userId, 10, "Daily Login XP");
      }
    }
  } catch (error) {
    console.error("Error updating daily streak:", error);
  }
};

const addXp = async (userId: string, amount: number, reason: string) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { "gamification.xp": amount },
      },
      { new: true }
    );

    if (!updatedUser?.gamification) return;

    const newXp = updatedUser.gamification.xp || 0;
    const newLevel = calculateLevel(newXp);

    if (newLevel > (updatedUser.gamification.level || 1)) {
      await User.findByIdAndUpdate(userId, {
        $max: { "gamification.level": newLevel },
      });
    }
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