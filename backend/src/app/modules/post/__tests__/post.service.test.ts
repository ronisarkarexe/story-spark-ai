import { Post } from "../post.model";
import { User } from "../../user/user.model";
import { PostService } from "../post.service";
import { Bookmark } from "../../bookmark/bookmark.model";
import { escapeRegex } from "../../../../utils/regex.util";

jest.mock("../post.model", () => ({
  Post: {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn(),
    updateMany: jest.fn(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    countDocuments: jest.fn(),
  },
}));

jest.mock("../../user/user.model", () => ({
  User: {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock("../../bookmark/bookmark.model", () => ({
  Bookmark: {
    deleteMany: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock("../../comment/comment.model", () => ({
  Comment: {
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

  describe("bulkDeletePosts", () => {
    it("should throw error if user is not found", async () => {
      mockedUser.findOne.mockResolvedValue(null as any);
      await expect(
        PostService.bulkDeletePosts(["507f1f77bcf86cd799439011"], { email: "a@a.com" } as any)
      ).rejects.toThrow("User not found!");
    });

    it("should throw error if more than 50 IDs are provided", async () => {
      mockedUser.findOne.mockResolvedValue({ _id: "admin123" } as any);
      const ids = Array(51).fill("507f1f77bcf86cd799439011");
      await expect(
        PostService.bulkDeletePosts(ids, { email: "admin@a.com" } as any)
      ).rejects.toThrow("Maximum 50 story IDs allowed.");
    });

    it("should successfully soft-delete valid posts and return deleted count & failed IDs", async () => {
      const adminUser = { _id: "adminId123" };
      mockedUser.findOne.mockResolvedValue(adminUser as any);

      const existingPosts = [
        { _id: "507f1f77bcf86cd799439011", author: "author1", isPublished: true },
        { _id: "507f1f77bcf86cd799439012", author: "author2", isPublished: false },
      ];

      mockedPost.find.mockResolvedValue(existingPosts as any);
      mockedPost.updateMany = jest.fn().mockResolvedValue({} as any);

      const ids = [
        "507f1f77bcf86cd799439011",
        "507f1f77bcf86cd799439012",
        "507f1f77bcf86cd799439013",
        "invalid-id",
      ];

      const result = await PostService.bulkDeletePosts(ids, { email: "admin@a.com" } as any);

      expect(result).toEqual({
        deleted: 2,
        failed: ["invalid-id", "507f1f77bcf86cd799439013"],
      });
    });
  });
});


describe("escapeRegex", () => {
  it("escapes all regex metacharacters", () => {
    expect(escapeRegex(".*+?^${}()|[]\\")).toBe("\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\");
  });

  it("leaves plain alphanumeric strings unchanged", () => {
    expect(escapeRegex("hello world")).toBe("hello world");
  });

  it("escapes a hyphen", () => {
    expect(escapeRegex("sci-fi")).toBe("sci\\-fi");
  });

  it("produces a string safe to use in a RegExp without throwing", () => {
    const dangerous = ".*+?^${}()|[]\\";
    expect(() => new RegExp(escapeRegex(dangerous))).not.toThrow();
  });

  it("escaped pattern matches literal text and not as a wildcard", () => {
    const input = "a.b";
    const escaped = escapeRegex(input);
    const re = new RegExp(escaped);
    expect(re.test("a.b")).toBe(true);
    expect(re.test("axb")).toBe(false);
  });
});
