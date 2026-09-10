/**
 * collection.service.test.ts
 * Unit tests for CollectionService
 */
import { Types } from "mongoose";
import { CollectionService } from "../collection.service";
import { Collection } from "../collection.model";
import { Post } from "../../post/post.model";
import { User } from "../../user/user.model";

jest.mock("../../user/user.model", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock("../../post/post.model", () => ({
  Post: {
    findOne: jest.fn(),
  },
}));

jest.mock("../collection.model", () => ({
  Collection: {
    countDocuments: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
  },
}));

const userId = new Types.ObjectId("507f1f77bcf86cd799439011");
const collectionId = new Types.ObjectId("507f1f77bcf86cd799439022");
const storyId = new Types.ObjectId("507f1f77bcf86cd799439033");

const mockUser = { _id: userId, email: "owner@example.com" };
const mockCollection = {
  _id: collectionId,
  ownerId: userId,
  title: "My Collection",
  storyIds: [],
  visibility: "public",
  isDeleted: false,
  save: jest.fn(),
};

const token = {
  _id: userId.toString(),
  email: "owner@example.com",
  role: "user",
} as any;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("CollectionService", () => {
  describe("createCollection", () => {
    it("creates a new collection when under the limit", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Collection.countDocuments as jest.Mock).mockResolvedValue(5);
      (Collection.create as jest.Mock).mockResolvedValue({ ...mockCollection });

      const result = await CollectionService.createCollection(
        { title: "New Collection" },
        token
      );

      expect(result.title).toBe("My Collection");
      expect(Collection.create).toHaveBeenCalled();
    });

    it("throws BAD_REQUEST when max collections reached", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Collection.countDocuments as jest.Mock).mockResolvedValue(50);

      await expect(
        CollectionService.createCollection({ title: "Too Many" }, token)
      ).rejects.toMatchObject({
        statusCode: 400,
        message: expect.stringContaining("at most 50"),
      });
    });

    it("throws BAD_REQUEST when user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        CollectionService.createCollection({ title: "Test" }, token)
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "User not found!",
      });
    });
  });

  describe("addStoryToCollection", () => {
    it("throws FORBIDDEN when user does not own the collection", async () => {
      const otherOwner = new Types.ObjectId();
      const otherCollection = {
        ...mockCollection,
        ownerId: otherOwner,
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Collection.findOne as jest.Mock).mockResolvedValue(otherCollection);

      await expect(
        CollectionService.addStoryToCollection(
          collectionId.toString(),
          storyId.toString(),
          token
        )
      ).rejects.toMatchObject({
        statusCode: 403,
      });
    });

    it("throws CONFLICT when story already in collection", async () => {
      const collectionWithStory = {
        ...mockCollection,
        storyIds: [storyId],
        save: jest.fn(),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Collection.findOne as jest.Mock).mockResolvedValue(collectionWithStory);
      (Post.findOne as jest.Mock).mockResolvedValue({ _id: storyId });

      await expect(
        CollectionService.addStoryToCollection(
          collectionId.toString(),
          storyId.toString(),
          token
        )
      ).rejects.toMatchObject({
        statusCode: 409,
      });
    });

    it("throws BAD_REQUEST when storyId is not a valid ObjectId", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Collection.findOne as jest.Mock).mockResolvedValue({ ...mockCollection });

      await expect(
        CollectionService.addStoryToCollection(
          collectionId.toString(),
          "not-valid",
          token
        )
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Invalid story ID.",
      });
    });
  });

  describe("deleteCollection", () => {
    it("soft-deletes the collection and returns success message", async () => {
      const deletableCollection = {
        ...mockCollection,
        save: jest.fn(),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Collection.findOne as jest.Mock).mockResolvedValue(deletableCollection);

      const result = await CollectionService.deleteCollection(
        collectionId.toString(),
        token
      );

      expect(result.message).toBe("Collection deleted.");
      expect(deletableCollection.isDeleted).toBe(true);
      expect(deletableCollection.save).toHaveBeenCalled();
    });

    it("throws FORBIDDEN when user does not own the collection", async () => {
      const otherOwner = new Types.ObjectId();
      const otherCollection = {
        ...mockCollection,
        ownerId: otherOwner,
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Collection.findOne as jest.Mock).mockResolvedValue(otherCollection);

      await expect(
        CollectionService.deleteCollection(collectionId.toString(), token)
      ).rejects.toMatchObject({
        statusCode: 403,
      });
    });

    it("throws NOT_FOUND when collection does not exist", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Collection.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        CollectionService.deleteCollection(collectionId.toString(), token)
      ).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });
});

