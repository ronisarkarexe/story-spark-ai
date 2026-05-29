import { User } from "../user/user.model";

const updateDailyStreak = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    if (!user.gamification) {
      user.gamification = { xp: 0, level: 1, streak: 0, badges: [], lastActiveDate: null };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let lastActive = user.gamification.lastActiveDate;
    if (!lastActive) {
      user.gamification.streak = 1;
      user.gamification.lastActiveDate = new Date();
      await user.save();
      await addXp(userId, 10, "First login");
      return;
    }

    const lastActiveDate = new Date(lastActive);
    lastActiveDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastActiveDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Logged in yesterday
      user.gamification.streak += 1;
      user.gamification.lastActiveDate = new Date();
      await user.save();
      await addXp(userId, 10, "Daily Streak XP");
    } else if (diffDays > 1) {
      // Missed a day
      user.gamification.streak = 1;
      user.gamification.lastActiveDate = new Date();
      await user.save();
      await addXp(userId, 10, "Daily Login XP");
    }
  } catch (error) {
    console.error("Error updating daily streak:", error);
  }
};

const addXp = async (userId: string, amount: number, reason: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    if (!user.gamification) {
      user.gamification = { xp: 0, level: 1, streak: 0, badges: [], lastActiveDate: null };
    }

    const currentXp = user.gamification.xp || 0;
    const newXp = currentXp + amount;
    
    // Level formula: Level = floor(sqrt(xp / 100)) + 1
    const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;

    user.gamification.xp = newXp;
    
    if (newLevel > user.gamification.level) {
      user.gamification.level = newLevel;
    }

    await user.save();
  } catch (error) {
    console.error("Error adding XP:", error);
  }
};

const awardBadge = async (userId: string, badgeName: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    if (!user.gamification) {
      user.gamification = { xp: 0, level: 1, streak: 0, badges: [], lastActiveDate: null };
    }

    if (!user.gamification.badges.includes(badgeName)) {
      user.gamification.badges.push(badgeName);
      await user.save();
    }
  } catch (error) {
    console.error("Error awarding badge:", error);
  }
};

export const GamificationService = {
  updateDailyStreak,
  addXp,
  awardBadge,
};
