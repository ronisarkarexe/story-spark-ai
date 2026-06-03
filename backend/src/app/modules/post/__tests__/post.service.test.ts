import { Post } from "../post.model";
import { PostService } from "../post.service";

jest.mock("../post.model", () => ({
  Post: {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    countDocuments: jest.fn(),
  },
}));

const mockedPost = Post as jest.Mocked<typeof Post>;

describe("PostService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getLatestPosts", () => {
    it("should filter by isDeleted: { $ne: true } and isPublished: true", async () => {
      const chain = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve([])),
        catch: jest.fn(),
      };
      mockedPost.find.mockReturnValue(chain as any);

      await PostService.getLatestPosts();

      expect(mockedPost.find).toHaveBeenCalledWith({
        isDeleted: { $ne: true },
        isPublished: true,
      });
    });
  });

  describe("getFeaturedPosts", () => {
    it("should filter by isDeleted: { $ne: true }, isFeaturedPost: true and isPublished: true", async () => {
      const chain = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve([])),
        catch: jest.fn(),
      };
      mockedPost.find.mockReturnValue(chain as any);

      await PostService.getFeaturedPosts();

      expect(mockedPost.find).toHaveBeenCalledWith({
        isFeaturedPost: true,
        isDeleted: { $ne: true },
        isPublished: true,
      });
    });
  });
});
