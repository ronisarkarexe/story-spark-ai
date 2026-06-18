import { UserController } from "../app/modules/user/user.controller";
import { Request, Response } from "express";
import { WritingStreakService } from "../app/modules/gamification/writing_streak.service";
import { User } from "../app/modules/user/user.model";
import sendResponse from "../shared/send_response";
import { getToken } from "../app/middleware/token";

// ─── Mocks ────────────────────────────────────────────────────────────────────
jest.mock("../app/middleware/token", () => ({
  getToken: jest.fn().mockResolvedValue({ email: "test@example.com", role: "user" }),
}));

jest.mock("../app/modules/user/user.model", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock("../app/modules/gamification/writing_streak.service", () => ({
  WritingStreakService: {
    getStreak: jest.fn(),
    getAchievements: jest.fn(),
    updateStreakAndUnlocks: jest.fn(),
  },
}));

jest.mock("../shared/send_response", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Gamification Endpoints Controllers", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      headers: { authorization: "Bearer fake-token" },
    };
    mockRes = {};
  });

  it("getWritingStreak should successfully query and return user writing streak data", async () => {
    const fakeUser = { _id: "user_abc", email: "test@example.com" };
    (User.findOne as jest.Mock).mockResolvedValueOnce(fakeUser);

    const mockStreak = {
      currentStreak: 2,
      longestStreak: 5,
      totalWritingDays: 12,
      lastActiveDate: new Date(),
    };
    (WritingStreakService.getStreak as jest.Mock).mockResolvedValueOnce(mockStreak);

    const mockNext = jest.fn();
    await UserController.getWritingStreak(mockReq as Request, mockRes as Response, mockNext);

    expect(getToken).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(WritingStreakService.getStreak).toHaveBeenCalledWith("user_abc");
    expect(sendResponse).toHaveBeenCalledWith(mockRes, {
      statusCode: 200,
      success: true,
      message: "Writing streak fetched successfully!",
      data: mockStreak,
    });
  });

  it("getAchievements should return user achievements mapped lists", async () => {
    const fakeUser = { _id: "user_abc", email: "test@example.com" };
    (User.findOne as jest.Mock).mockResolvedValueOnce(fakeUser);

    const mockAchievementsList = [
      { id: "streak_1", title: "First Day Writing", progress: 1, target: 1, unlockedAt: new Date() },
    ];
    (WritingStreakService.getAchievements as jest.Mock).mockResolvedValueOnce(mockAchievementsList);

    const mockNext = jest.fn();
    await UserController.getAchievements(mockReq as Request, mockRes as Response, mockNext);

    expect(sendResponse).toHaveBeenCalledWith(mockRes, {
      statusCode: 200,
      success: true,
      message: "Achievements fetched successfully!",
      data: { achievements: mockAchievementsList },
    });
  });
});
