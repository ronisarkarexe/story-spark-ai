import httpStatus from "http-status";
import { ITokenPayload } from "../../../../interfaces/token";
import { UserService } from "../user.service";
import { User } from "../user.model";

jest.mock("../user.model", () => ({
  User: {
    findOneAndUpdate: jest.fn(),
  },
}));

const mockedUser = User as unknown as {
  findOneAndUpdate: jest.Mock;
};

const token = {
  _id: "507f1f77bcf86cd799439011",
  email: "reader@example.com",
  role: "user",
} as ITokenPayload;

describe("UserService.updateReadingPreferences", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("persists onboarding preferences and marks onboarding complete", async () => {
    mockedUser.findOneAndUpdate.mockResolvedValue({
      hasCompletedOnboarding: true,
      readingPreferences: {
        genres: ["Fantasy", "Mystery"],
        preferredLength: "medium",
        moods: ["Funny", "Adventurous"],
      },
    });

    const result = await UserService.updateReadingPreferences(token, {
      genres: ["Fantasy", "Mystery"],
      preferredLength: "medium",
      moods: ["Funny", "Adventurous"],
    });

    expect(result.hasCompletedOnboarding).toBe(true);
    expect(mockedUser.findOneAndUpdate).toHaveBeenCalledWith(
      { email: token.email },
      expect.objectContaining({
        $set: expect.objectContaining({
          hasCompletedOnboarding: true,
          readingPreferences: expect.objectContaining({
            genres: ["Fantasy", "Mystery"],
            preferredLength: "medium",
            moods: ["Funny", "Adventurous"],
            onboardingCompleted: true,
          }),
        }),
      }),
      { new: true, runValidators: true }
    );
  });

  it("rejects invalid genres", async () => {
    await expect(
      UserService.updateReadingPreferences(token, {
        genres: ["Not A Real Genre"],
        preferredLength: "short",
        moods: ["Funny"],
      })
    ).rejects.toEqual(
      expect.objectContaining({
        statusCode: httpStatus.BAD_REQUEST,
      })
    );
  });

  it("marks onboarding complete when skipped", async () => {
    mockedUser.findOneAndUpdate.mockResolvedValue({
      hasCompletedOnboarding: true,
    });

    await UserService.updateReadingPreferences(token, { skip: true });

    expect(mockedUser.findOneAndUpdate).toHaveBeenCalledWith(
      { email: token.email },
      {
        $set: {
          hasCompletedOnboarding: true,
          "readingPreferences.onboardingCompleted": true,
          "readingPreferences.updatedAt": expect.any(Date),
        },
      },
      { new: true, runValidators: true }
    );
  });
});
