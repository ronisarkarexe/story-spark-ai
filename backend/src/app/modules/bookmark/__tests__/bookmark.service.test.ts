import { Types } from "mongoose";
import { BookmarkService } from "../bookmark.service";

jest.mock("../../user/user.model", () => {
  const mockUser = {
    findOne: jest.fn(),
    _id: new Types.ObjectId("507f1f77bcf86cd799439011"),
  };
  return { User: mockUser };
});

jest.mock("../bookmark.model", () => {
  const mockBookmark = {
    findOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
    findOneAndDelete: jest.fn(),
    find: jest.fn(),
    aggregate: jest.fn(),
  };
  return { Bookmark: mockBookmark };
});

jest.mock("../../post/post.model", () => {
  const mockPost = {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };
  return { Post: mockPost };
});

jest.mock("../../post/post.utils", () => ({
  verifyPostAccess: jest.fn(),
}));

const mockedUser = require("../../user/user.model").User;
const mockedBookmark = require("../bookmark.model").Bookmark;
const mockedPost = require("../../post/post.model").Post;
const mockedVerifyPostAccess = require("../../post/post.utils").verifyPostAccess;

const userId = new Types.ObjectId("507f1f77bcf86cd799439011");
const storyId = new Types.ObjectId("507f1f77bcf86cd799439022");
const userEmail = "reader@example.com";
const tokenPayload = {
  email: userEmail,
  _id: userId.toString(),
  role: "user",
  name: "Reader",
  subscriptionType: "free",
  postsCount: 0,
};

const mockUserDoc = {
  _id: userId,
  email: userEmail,
  name: "Reader",
};

const mockPostDoc = {
  _id: storyId,
  title: "A Great Story",
  isDeleted: false,
  isPublished: true,
};

const mockBookmarkDoc = {
  _id: new Types.ObjectId(),
  userId: userId,
  storyId: storyId,
};

describe("BookmarkService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUser.findOne.mockResolvedValue(mockUserDoc);
  });

  describe("toggleBookmark", () => {
    it("should add a bookmark when none exists", async () => {
      mockedPost.findOne.mockResolvedValue(mockPostDoc);
      mockedBookmark.findOne.mockResolvedValue(null);
      mockedBookmark.create.mockResolvedValue(mockBookmarkDoc);
      mockedPost.findByIdAndUpdate.mockResolvedValue({});

      const result = await BookmarkService.toggleBookmark(
        storyId.toString(),
        tokenPayload
      );

      expect(result.isBookmarked).toBe(true);
      expect(result.message).toBe("Story bookmarked!");
      expect(mockedBookmark.create).toHaveBeenCalledWith({
        userId: userId,
        storyId: storyId,
      });
    });

    it("should remove a bookmark when one already exists", async () => {
      mockedPost.findOne.mockResolvedValue(mockPostDoc);
      mockedBookmark.findOne.mockResolvedValue(mockBookmarkDoc);
      mockedBookmark.findByIdAndDelete.mockResolvedValue({});
      mockedPost.findByIdAndUpdate.mockResolvedValue({});

      const result = await BookmarkService.toggleBookmark(
        storyId.toString(),
        tokenPayload
      );

      expect(result.isBookmarked).toBe(false);
      expect(result.message).toBe("Bookmark removed");
      expect(mockedBookmark.findByIdAndDelete).toHaveBeenCalledWith(
        mockBookmarkDoc._id
      );
    });

    it("should throw BAD_REQUEST when user is not found", async () => {
      mockedUser.findOne.mockResolvedValue(null);

      await expect(
        BookmarkService.toggleBookmark(storyId.toString(), tokenPayload)
      ).rejects.toThrow("User not found!");
    });

    it("should throw BAD_REQUEST when story is not found", async () => {
      mockedPost.findOne.mockResolvedValue(null);

      await expect(
        BookmarkService.toggleBookmark(storyId.toString(), tokenPayload)
      ).rejects.toThrow("Story not found!");
    });

    it("should call verifyPostAccess before checking bookmark status", async () => {
      mockedPost.findOne.mockResolvedValue(mockPostDoc);
      mockedBookmark.findOne.mockResolvedValue(null);
      mockedBookmark.create.mockResolvedValue(mockBookmarkDoc);
      mockedPost.findByIdAndUpdate.mockResolvedValue({});

      await BookmarkService.toggleBookmark(storyId.toString(), tokenPayload);

      expect(mockedVerifyPostAccess).toHaveBeenCalledWith(mockPostDoc, mockUserDoc);
    });

    it("should handle duplicate key error gracefully when creating bookmark", async () => {
      mockedPost.findOne.mockResolvedValue(mockPostDoc);
      mockedBookmark.findOne.mockResolvedValue(null);
      const duplicateError = Object.assign(new Error("Duplicate"), { code: 11000 });
      mockedBookmark.create.mockRejectedValue(duplicateError);

      const result = await BookmarkService.toggleBookmark(
        storyId.toString(),
        tokenPayload
      );

      expect(result.isBookmarked).toBe(true);
      expect(result.message).toBe("Story already bookmarked!");
    });
  });

  describe("checkBookmarkStatus", () => {
    it("should return isBookmarked=true when bookmark exists", async () => {
      mockedPost.findOne.mockResolvedValue(mockPostDoc);
      mockedBookmark.findOne.mockResolvedValue(mockBookmarkDoc);

      const result = await BookmarkService.checkBookmarkStatus(
        storyId.toString(),
        tokenPayload
      );

      expect(result.isBookmarked).toBe(true);
    });

    it("should return isBookmarked=false when bookmark does not exist", async () => {
      mockedPost.findOne.mockResolvedValue(mockPostDoc);
      mockedBookmark.findOne.mockResolvedValue(null);

      const result = await BookmarkService.checkBookmarkStatus(
        storyId.toString(),
        tokenPayload
      );

      expect(result.isBookmarked).toBe(false);
    });

    it("should throw BAD_REQUEST when user is not found", async () => {
      mockedUser.findOne.mockResolvedValue(null);

      await expect(
        BookmarkService.checkBookmarkStatus(storyId.toString(), tokenPayload)
      ).rejects.toThrow("User not found!");
    });

    it("should throw BAD_REQUEST when story is not found", async () => {
      mockedPost.findOne.mockResolvedValue(null);

      await expect(
        BookmarkService.checkBookmarkStatus(storyId.toString(), tokenPayload)
      ).rejects.toThrow("Story not found!");
    });
  });

  describe("deleteBookmark", () => {
    it("should delete bookmark and decrement bookmarksCount", async () => {
      mockedPost.findOne.mockResolvedValue(mockPostDoc);
      mockedBookmark.findOneAndDelete.mockResolvedValue(mockBookmarkDoc);
      mockedPost.findByIdAndUpdate.mockResolvedValue({});

      const result = await BookmarkService.deleteBookmark(
        storyId.toString(),
        tokenPayload
      );

      expect(result.message).toBe("Bookmark removed");
      expect(mockedBookmark.findOneAndDelete).toHaveBeenCalledWith({
        userId: userId,
        storyId: new Types.ObjectId(storyId.toString()),
      });
      expect(mockedPost.findByIdAndUpdate).toHaveBeenCalled();
      const lastCall = mockedPost.findByIdAndUpdate.mock.calls[0];
      expect(lastCall[1]).toEqual({ $inc: { bookmarksCount: -1 } });
    });

    it("should return removed without updating count when bookmark did not exist", async () => {
      mockedPost.findOne.mockResolvedValue(mockPostDoc);
      mockedBookmark.findOneAndDelete.mockResolvedValue(null);

      const result = await BookmarkService.deleteBookmark(
        storyId.toString(),
        tokenPayload
      );

      expect(result.message).toBe("Bookmark removed");
      expect(mockedPost.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("should throw BAD_REQUEST when user is not found", async () => {
      mockedUser.findOne.mockResolvedValue(null);

      await expect(
        BookmarkService.deleteBookmark(storyId.toString(), tokenPayload)
      ).rejects.toThrow("User not found!");
    });

    it("should throw BAD_REQUEST when story is not found", async () => {
      mockedPost.findOne.mockResolvedValue(null);

      await expect(
        BookmarkService.deleteBookmark(storyId.toString(), tokenPayload)
      ).rejects.toThrow("Story not found!");
    });
  });
});
