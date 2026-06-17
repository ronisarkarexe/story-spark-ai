import { WritingStreakService } from "../app/modules/gamification/writing_streak.service";
import { User } from "../app/modules/user/user.model";
import { Post } from "../app/modules/post/post.model";
import { AchievementUnlock } from "../app/modules/gamification/achievement_unlock.model";
import { GamificationService } from "../app/modules/gamification/gamification.service";

// ─── Mocks ────────────────────────────────────────────────────────────────────
jest.mock("../app/modules/user/user.model", () => ({
  User: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

jest.mock("../app/modules/post/post.model", () => ({
  Post: {
    find: jest.fn(),
  },
}));

jest.mock("../app/modules/gamification/achievement_unlock.model", () => ({
  AchievementUnlock: {
    find: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../app/modules/gamification/gamification.service", () => ({
  GamificationService: {
    awardBadge: jest.fn().mockResolvedValue(true),
  },
}));

describe("WritingStreakService Unit Tests", () => {
  const userId = "user_123456";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getStreak", () => {
    it("should return null if user does not exist", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);
      const result = await WritingStreakService.getStreak(userId);
      expect(result).toBeNull();
    });

    it("should return the streak as is if user was active today", async () => {
      const today = new Date();
      const userMock = {
        _id: userId,
        writingStreak: {
          currentStreak: 3,
          longestStreak: 5,
          totalWritingDays: 10,
          lastActiveDate: today,
        },
      };
      (User.findById as jest.Mock).mockResolvedValue(userMock);

      const result = await WritingStreakService.getStreak(userId);
      expect(result).toEqual({
        currentStreak: 3,
        longestStreak: 5,
        totalWritingDays: 10,
        lastActiveDate: today,
      });
    });

    it("should dynamically reset currentStreak to 0 if the user missed a writing day", async () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const userMock = {
        _id: userId,
        writingStreak: {
          currentStreak: 3,
          longestStreak: 5,
          totalWritingDays: 10,
          lastActiveDate: threeDaysAgo,
        },
      };
      (User.findById as jest.Mock).mockResolvedValue(userMock);

      const result = await WritingStreakService.getStreak(userId);
      expect(result?.currentStreak).toBe(0);
    });
  });

  describe("checkAndAwardAchievements", () => {
    it("should award achievements based on story milestones, word counts, and productivity days", async () => {
      const userMock = {
        _id: userId,
        writingStreak: {
          currentStreak: 3,
          longestStreak: 7,
          totalWritingDays: 10,
          lastActiveDate: new Date(),
        },
        save: jest.fn().mockResolvedValue(true),
      };
      (User.findById as jest.Mock).mockResolvedValue(userMock);

      // 10 stories, each having 150 words -> 1500 total words
      (Post.find as jest.Mock).mockResolvedValue(
        Array(10).fill({
          content: "word ".repeat(150),
        })
      );

      // User already unlocked "First Story"
      (AchievementUnlock.find as jest.Mock).mockResolvedValue([
        { achievementId: "story_1" },
      ]);

      await WritingStreakService.checkAndAwardAchievements(userId);

      // Verify that AchievementUnlock.create was called for new milestone unlocks
      // New unlocks expected: streak_1, streak_3, streak_7, story_10, words_1000, productivity_7
      expect(AchievementUnlock.create).toHaveBeenCalled();
      expect(GamificationService.awardBadge).toHaveBeenCalledWith(userId, "10 Stories");
      expect(GamificationService.awardBadge).toHaveBeenCalledWith(userId, "7-Day Streak");
      expect(GamificationService.awardBadge).toHaveBeenCalledWith(userId, "1,000 Words");
      expect(GamificationService.awardBadge).toHaveBeenCalledWith(userId, "7 Active Days");
    });
  });
});
