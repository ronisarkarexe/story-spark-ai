import { Post } from "../post.model";
import { User } from "../../user/user.model";
import { PostService } from "../post.service";
import { Bookmark } from "../../bookmark/bookmark.model";

jest.mock("../post.model", () => ({
  Post: {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    countDocuments: jest.fn(),
  },
}));

jest.mock("../../user/user.model", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock("../../bookmark/bookmark.model", () => ({
  Bookmark: {
    deleteMany: jest.fn().mockResolvedValue({}),
  },
}));

const mockedPost = Post as jest.Mocked<typeof Post>;
const mockedUser = User as jest.Mocked<typeof User>;

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

  describe("deletePost — authorization", () => {
    const postId = "post123";
    const authorId = { toString: () => "user1" };

    const makeUser = (id: string, role: string) => ({
      _id: { toString: () => id },
      role,
      postsCount: 1,
      save: jest.fn().mockResolvedValue(undefined),
    });

    const makePost = (authorStr: string) => ({
      author: { toString: () => authorStr },
      isPublished: true,
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      save: jest.fn().mockResolvedValue(undefined),
    });

    it("should allow the post author to delete their own post", async () => {
      const user = makeUser("user1", "user");
      const post = makePost("user1");
      mockedUser.findOne.mockResolvedValue(user as any);
      mockedPost.findOne.mockResolvedValue(post as any);

      await expect(PostService.deletePost(postId, { email: "a@a.com" } as any)).resolves.not.toThrow();
    });

    it("should allow admin to delete any post", async () => {
      const user = makeUser("admin1", "admin");
      const post = makePost("user1");
      mockedUser.findOne.mockResolvedValue(user as any);
      mockedPost.findOne.mockResolvedValue(post as any);

      await expect(PostService.deletePost(postId, { email: "admin@a.com" } as any)).resolves.not.toThrow();
    });

    it("should allow super_admin to delete any post", async () => {
      const user = makeUser("sa1", "super_admin");
      const post = makePost("user1");
      mockedUser.findOne.mockResolvedValue(user as any);
      mockedPost.findOne.mockResolvedValue(post as any);

      await expect(PostService.deletePost(postId, { email: "sa@a.com" } as any)).resolves.not.toThrow();
    });

    it("should forbid a non-author user from deleting another user's post", async () => {
      const user = makeUser("user2", "user");
      const post = makePost("user1");
      mockedUser.findOne.mockResolvedValue(user as any);
      mockedPost.findOne.mockResolvedValue(post as any);

      await expect(PostService.deletePost(postId, { email: "b@b.com" } as any)).rejects.toMatchObject({
        statusCode: 403,
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
