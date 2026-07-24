/**
 * empty-preferences.test.ts
 * Verifies that empty arrays for favoriteGenres and favoriteEmotions
 * are handled gracefully and do not cause incorrect $or queries.
 */
import { Types } from "mongoose";
import { Post } from "../../post/post.model";
import { User } from "../../user/user.model";
import { RecommendationService } from "../recommendation.service";
import { ITokenPayload } from "../../../../interfaces/token";

jest.mock("../../post/post.model", () => ({
  Post: { find: jest.fn() },
  PostSchema: { indexes: jest.fn().mockReturnValue([]) },
}));

jest.mock("../../user/user.model", () => ({
  User: { findById: jest.fn() },
}));

const mockedPost = Post as unknown as { find: jest.Mock };
const mockedUser = User as unknown as { findById: jest.Mock };
const userId = new Types.ObjectId("507f1f77bcf86cd799439011");

const token = { _id: userId.toString(), email: "test@example.com", role: "user" } as ITokenPayload;

const createUserQuery = (result: unknown) => {
  mockedUser.findById.mockReturnValue({
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(result),
  });
};

const createPostQuery = (results: unknown[]) => {
  mockedPost.find.mockReturnValue({
    populate: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(results),
  });
};

describe("RecommendationService — empty preference arrays", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("skips genre filter when favoriteGenres is an empty array", async () => {
    createUserQuery({
      readingPreferences: {
        favoriteGenres: [],
        favoriteEmotions: [{ name: "Joy", count: 5 }],
      },
      readingHistory: [],
    });
    createPostQuery([]);

    await RecommendationService.getPersonalizedRecommendations(token);

    // First Post.find call should have $or with only the emotion filter
    const firstCall = mockedPost.find.mock.calls[0];
    const queryArg = firstCall[0] as Record<string, unknown>;
    expect(queryArg.$or).toBeDefined();
    expect((queryArg.$or as unknown[])).toHaveLength(1);
    expect((queryArg.$or as unknown[])[0]).toEqual({ emotions: { $in: ["Joy"] } });
  });

  it("skips emotion filter when favoriteEmotions is an empty array", async () => {
    createUserQuery({
      readingPreferences: {
        favoriteGenres: [{ name: "Fantasy", count: 5 }],
        favoriteEmotions: [],
      },
      readingHistory: [],
    });
    createPostQuery([]);

    await RecommendationService.getPersonalizedRecommendations(token);

    const firstCall = mockedPost.find.mock.calls[0];
    const queryArg = firstCall[0] as Record<string, unknown>;
    expect(queryArg.$or).toBeDefined();
    expect((queryArg.$or as unknown[])).toHaveLength(1);
    expect((queryArg.$or as unknown[])[0]).toEqual({ genre: { $in: ["Fantasy"] } });
  });

  it("skips entire $or filter when both preference arrays are empty", async () => {
    createUserQuery({
      readingPreferences: {
        favoriteGenres: [],
        favoriteEmotions: [],
      },
      readingHistory: [],
    });
    createPostQuery([]);

    await RecommendationService.getPersonalizedRecommendations(token);

    const firstCall = mockedPost.find.mock.calls[0];
    const queryArg = firstCall[0] as Record<string, unknown>;
    expect(queryArg.$or).toBeUndefined();
  });
});
