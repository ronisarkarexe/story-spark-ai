import { Types } from "mongoose";
import { Post } from "../post.model";

jest.mock("../../post/post.model", () => {
  const actual = jest.requireActual("../../post/post.model");
  return {
    ...actual,
    Post: {
      findById: jest.fn(),
    },
  };
});

const mockedPost = Post as unknown as {
  findById: jest.Mock;
};

describe("PostModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getEngagementStats", () => {
    it("returns null when post is not found", async () => {
      const postId = new Types.ObjectId();
      mockedPost.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await Post.getEngagementStats(postId);
      expect(result).toBeNull();
    });

    it("returns engagement stats when post exists", async () => {
      const postId = new Types.ObjectId();
      const fakeStats = {
        likesCount: 42,
        commentsCount: 7,
        bookmarksCount: 15,
        viewsCount: 300,
        averageRating: 4.5,
        totalRatings: 10,
      };
      mockedPost.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(fakeStats),
      });

      const result = await Post.getEngagementStats(postId);

      expect(mockedPost.findById).toHaveBeenCalledWith(
        postId,
        {
          likesCount: 1,
          commentsCount: 1,
          bookmarksCount: 1,
          viewsCount: 1,
          averageRating: 1,
          totalRatings: 1,
        }
      );
      expect(result).toEqual(fakeStats);
    });

    it("calls findById with lean to avoid full document hydration", async () => {
      const postId = new Types.ObjectId();
      mockedPost.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          likesCount: 0,
          commentsCount: 0,
          bookmarksCount: 0,
          viewsCount: 0,
          averageRating: 0,
          totalRatings: 0,
        }),
      });

      await Post.getEngagementStats(postId);
      expect(mockedPost.findById).toHaveBeenCalled();
    });
  });
});
