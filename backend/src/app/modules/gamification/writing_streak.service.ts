import { User } from "../user/user.model";
import { Post } from "../post/post.model";
import { AchievementUnlock } from "./achievement_unlock.model";
import { ACHIEVEMENT_DEFINITIONS } from "./achievements.constant";
import { GamificationService } from "./gamification.service";

const getUtcDateOnly = (date: Date) => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

const updateStreakAndUnlocks = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const now = new Date();
    const todayUtc = getUtcDateOnly(now);

    let currentStreak = user.writingStreak?.currentStreak ?? 0;
    let longestStreak = user.writingStreak?.longestStreak ?? 0;
    let totalWritingDays = user.writingStreak?.totalWritingDays ?? 0;
    const lastActive = user.writingStreak?.lastActiveDate;

    if (!lastActive) {
      currentStreak = 1;
      longestStreak = Math.max(longestStreak, 1);
      totalWritingDays = 1;
    } else {
      const lastActiveUtc = getUtcDateOnly(new Date(lastActive));
      const diffTime = todayUtc.getTime() - lastActiveUtc.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak += 1;
        longestStreak = Math.max(longestStreak, currentStreak);
        totalWritingDays += 1;
      } else if (diffDays > 1) {
        currentStreak = 1;
        totalWritingDays += 1;
      }
      // If diffDays === 0, it means user wrote multiple times today, so streak doesn't change.
    }

    user.writingStreak = {
      currentStreak,
      longestStreak,
      totalWritingDays,
      lastActiveDate: now,
    };

    await user.save();

    // Now evaluate achievements
    await checkAndAwardAchievements(userId);
  } catch (error) {
    console.error("Error updating writing streak:", error);
  }
};

const checkAndAwardAchievements = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Fetch user posts
    const posts = await Post.find({ author: userId, isDeleted: { $ne: true } });
    const postsCount = posts.length;

    // Calculate total word count
    const totalWords = posts.reduce((sum, p) => {
      const content = p.content || "";
      const words = content.trim().split(/\s+/).filter(Boolean).length;
      return sum + words;
    }, 0);

    const longestStreak = user.writingStreak?.longestStreak ?? 0;
    const totalWritingDays = user.writingStreak?.totalWritingDays ?? 0;

    // Get currently unlocked achievements
    const unlocks = await AchievementUnlock.find({ userId });
    const unlockedIds = new Set(unlocks.map((u) => u.achievementId));

    for (const def of ACHIEVEMENT_DEFINITIONS) {
      if (unlockedIds.has(def.id)) continue;

      let progress = 0;
      if (def.category === "streak") progress = longestStreak;
      else if (def.category === "story") progress = postsCount;
      else if (def.category === "word_count") progress = totalWords;
      else if (def.category === "productivity") progress = totalWritingDays;

      if (progress >= def.target) {
        // Unlock it!
        await AchievementUnlock.create({
          userId: user._id,
          achievementId: def.id,
          unlockedAt: new Date(),
        });

        // Award badge for general compatibility
        await GamificationService.awardBadge(String(user._id), def.title);
      }
    }
  } catch (error) {
    console.error("Error evaluating achievements:", error);
  }
};

const getStreak = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return null;

  let currentStreak = user.writingStreak?.currentStreak ?? 0;
  const longestStreak = user.writingStreak?.longestStreak ?? 0;
  const totalWritingDays = user.writingStreak?.totalWritingDays ?? 0;
  const lastActiveDate = user.writingStreak?.lastActiveDate;

  if (lastActiveDate && currentStreak > 0) {
    const now = new Date();
    const todayUtc = getUtcDateOnly(now);
    const lastActiveUtc = getUtcDateOnly(new Date(lastActiveDate));
    const diffTime = todayUtc.getTime() - lastActiveUtc.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      currentStreak = 0;
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalWritingDays,
    lastActiveDate,
  };
};

const getAchievements = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return [];

  // Fetch metrics
  const posts = await Post.find({ author: userId, isDeleted: { $ne: true } });
  const postsCount = posts.length;

  const totalWords = posts.reduce((sum, p) => {
    const content = p.content || "";
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return sum + words;
  }, 0);

  const longestStreak = user.writingStreak?.longestStreak ?? 0;
  const totalWritingDays = user.writingStreak?.totalWritingDays ?? 0;

  // Get unlocks
  const unlocks = await AchievementUnlock.find({ userId });
  const unlocksMap = new Map(unlocks.map((u) => [u.achievementId, u.unlockedAt]));

  // Return mapped achievements
  return ACHIEVEMENT_DEFINITIONS.map((def) => {
    const unlockedAt = unlocksMap.get(def.id);
    let progress = 0;
    if (def.category === "streak") progress = longestStreak;
    else if (def.category === "story") progress = postsCount;
    else if (def.category === "word_count") progress = totalWords;
    else if (def.category === "productivity") progress = totalWritingDays;

    return {
      id: def.id,
      title: def.title,
      description: def.description,
      icon: def.icon,
      unlockedAt,
      progress: Math.min(progress, def.target), // cap progress at target
      target: def.target,
    };
  });
};

export const WritingStreakService = {
  updateStreakAndUnlocks,
  getStreak,
  getAchievements,
  checkAndAwardAchievements,
};
