/**
 * reaction.service.test.ts
 * Unit tests for ReactionService.toggleReaction
 */
import { Types } from "mongoose";
import { ReactionService } from "../reaction.service";
import { Reaction } from "../reaction.model";
import { Post } from "../../post/post.model";
import { User } from "../../user/user.model";
import { verifyPostAccess } from "../../post/post.utils";

jest.mock("../reaction.model", () => ({
  Reaction: {
    findOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../../post/post.model", () => ({
  Post: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    updateOne: jest.fn(),
  },
}));

jest.mock("../../user/user.model", () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock("../../post/post.utils", () => ({
  verifyPostAccess: jest.fn(),
}));
const userQuery = (user: any) => ({
  select: () => ({ lean: () => Promise.resolve(user) }),
});



const userId = new Types.ObjectId("507f1f77bcf86cd799439011");
const postId = new Types.ObjectId("507f1f77bcf86cd799439022");
const reactionId = new Types.ObjectId("507f1f77bcf86cd799439033");

const mockUser = { _id: userId, email: "tester@example.com" };
const mockPost = {
  _id: postId,
  title: "Test Story",
  reactions: [],
  likesCount: 5,
  isDeleted: { $ne: true },
  visibility: "public",
  author: userId,
};
const mockReaction = {
  _id: reactionId,
  postId: postId,
  userId: userId,
  type: "like",
};

const token = {
  _id: userId.toString(),
  email: "tester@example.com",
  role: "user",
} as any;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ReactionService.toggleReaction", () => {
  describe("input validation", () => {
    it("throws BAD_REQUEST when postId is not a valid ObjectId", async () => {
      await expect(
        ReactionService.toggleReaction("not-valid-id", "like", token)
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Invalid post ID!",
      });
    });

    it("throws BAD_REQUEST when user is not found", async () => {
      (User.findOne as jest.Mock).mockReturnValue(userQuery(null));
      await expect(
        ReactionService.toggleReaction(postId.toString(), "like", token)
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "User not found!",
      });
    });

    it("throws BAD_REQUEST when post is not found", async () => {
      (User.findOne as jest.Mock).mockReturnValue(userQuery(mockUser));
      (Post.findOne as jest.Mock).mockResolvedValue(null);
      await expect(
        ReactionService.toggleReaction(postId.toString(), "like", token)
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Post not found!",
      });
    });
  });

  describe("adding a reaction", () => {
    it("creates a new reaction and increments likesCount when no existing reaction", async () => {
      (User.findOne as jest.Mock).mockReturnValue(userQuery(mockUser));
      (Post.findOne as jest.Mock).mockResolvedValue(mockPost);
      (Reaction.findOne as jest.Mock).mockResolvedValue(null);
      (Reaction.create as jest.Mock).mockResolvedValue(mockReaction);
      (Post.findOneAndUpdate as jest.Mock).mockResolvedValue({ likesCount: 6 });

      const result = await ReactionService.toggleReaction(
        postId.toString(),
        "like",
        token
      );

      expect(result.message).toBe("Reaction added");
      expect(result.likesCount).toBe(6);
      expect(Reaction.create).toHaveBeenCalledWith({
        postId: expect.any(Types.ObjectId),
        userId: userId,
        type: "like",
      });
    });

    it("creates a reaction with love type when specified", async () => {
      (User.findOne as jest.Mock).mockReturnValue(userQuery(mockUser));
      (Post.findOne as jest.Mock).mockResolvedValue(mockPost);
      (Reaction.findOne as jest.Mock).mockResolvedValue(null);
      (Reaction.create as jest.Mock).mockResolvedValue({ ...mockReaction, type: "love" });
      (Post.findOneAndUpdate as jest.Mock).mockResolvedValue({ likesCount: 7 });

      const result = await ReactionService.toggleReaction(
        postId.toString(),
        "love",
        token
      );

      expect(result.message).toBe("Reaction added");
      expect(Reaction.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: "love" })
      );
    });
  });

  describe("removing a reaction", () => {
    it("removes existing reaction and decrements likesCount", async () => {
      (User.findOne as jest.Mock).mockReturnValue(userQuery(mockUser));
      (Post.findOne as jest.Mock).mockResolvedValue(mockPost);
      (Reaction.findOne as jest.Mock).mockResolvedValue(mockReaction);
      (Reaction.findByIdAndDelete as jest.Mock).mockResolvedValue(mockReaction);
      (Post.findOneAndUpdate as jest.Mock).mockResolvedValue({ likesCount: 4 });

      const result = await ReactionService.toggleReaction(
        postId.toString(),
        "like",
        token
      );

      expect(result.message).toBe("Reaction removed");
      expect(result.likesCount).toBe(4);
      expect(Reaction.findByIdAndDelete).toHaveBeenCalledWith(reactionId);
    });

    it("caps likesCount at zero when decrement goes negative", async () => {
      (User.findOne as jest.Mock).mockReturnValue(userQuery(mockUser));
      (Post.findOne as jest.Mock).mockResolvedValue(mockPost);
      (Reaction.findOne as jest.Mock).mockResolvedValue(mockReaction);
      (Reaction.findByIdAndDelete as jest.Mock).mockResolvedValue(mockReaction);
      (Post.findOneAndUpdate as jest.Mock).mockResolvedValue({ likesCount: -1 });
      (Post.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 });

      const result = await ReactionService.toggleReaction(
        postId.toString(),
        "like",
        token
      );

      expect(result.likesCount).toBe(0);
      expect(Post.updateOne).toHaveBeenCalledWith(
        { _id: expect.anything() },
        { $set: { likesCount: 0 } }
      );
    });
  });
});
