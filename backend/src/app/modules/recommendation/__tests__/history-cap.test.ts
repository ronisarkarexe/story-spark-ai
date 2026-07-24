/**
 * history-cap.test.ts
 * Verifies that readingHistory is capped to EXCLUSION_LIMIT (100 entries)
 * before being passed to the MongoDB $nin query, preventing query planner
 * degradation for highly active users.
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

describe("RecommendationService — readingHistory EXCLUSION_LIMIT", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("caps readingHistory to 100 entries before passing to $nin", async () => {
    // readingHistory with exactly 100 entries — should NOT be capped
    const exactly100 = Array.from({ length: 100 }, (_, i) => new Types.ObjectId(`507f1f77bcf86cd79943910${String(i).padStart(2, "0")}`));
    createUserQuery({ readingPreferences: undefined, readingHistory: exactly100 });
    createPostQuery([]);

    await RecommendationService.getPersonalizedRecommendations(token);

    // Find the query call that has $nin
    const ninCall = mockedPost.find.mock.calls.find(
      (call) => call[0] && call[0]._id && call[0]._id.$nin
    );
    expect(ninCall).toBeDefined();
    expect((ninCall[0]._id.$nin as unknown[]).length).toBe(100);
  });

  it("caps readingHistory to the last 100 entries when over 100", async () => {
    // readingHistory with 150 entries — should be capped to last 100
    const overLimit = Array.from({ length: 150 }, (_, i) => new Types.ObjectId(`507f1f77bcf86cd79943911${String(i).padStart(2, "0")}`));
    createUserQuery({ readingPreferences: undefined, readingHistory: overLimit });
    createPostQuery([]);

    await RecommendationService.getPersonalizedRecommendations(token);

    const ninCall = mockedPost.find.mock.calls.find(
      (call) => call[0] && call[0]._id && call[0]._id.$nin
    );
    expect(ninCall).toBeDefined();
    expect((ninCall[0]._id.$nin as unknown[]).length).toBe(100);
  });
});
