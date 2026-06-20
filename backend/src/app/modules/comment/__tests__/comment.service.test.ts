import httpStatus from "http-status";
import { startSession, Types } from "mongoose";
import { CommentService } from "../comment.service";
import { Comment } from "../comment.model";
import { Post } from "../../post/post.model";
import { User } from "../../user/user.model";
import { ITokenPayload } from "../../../../interfaces/token";

jest.mock("mongoose", () => {
  const actual = jest.requireActual("mongoose");
  return {
    ...actual,
    startSession: jest.fn(),
  };
});

jest.mock("../comment.model", () => ({
  Comment: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock("../../post/post.model", () => ({
  Post: {
    findOne: jest.fn(),
    updateOne: jest.fn(),
  },
}));

jest.mock("../../user/user.model", () => ({
  User: {
    findById: jest.fn(),
    findOne: jest.fn(),
  },
}));

const mockedComment = Comment as jest.Mocked<typeof Comment>;
const mockedPost = Post as jest.Mocked<typeof Post>;
const mockedUser = User as jest.Mocked<typeof User>;
const mockedStartSession = startSession as jest.MockedFunction<
  typeof startSession
>;

const userId = new Types.ObjectId("507f1f77bcf86cd799439011");
const postId = new Types.ObjectId("507f1f77bcf86cd799439021");
const parentCommentId = new Types.ObjectId("507f1f77bcf86cd799439031");

const token = {
  _id: userId.toString(),
  email: "reader@example.com",
  role: "user",
} as ITokenPayload;

const session = {
  startTransaction: jest.fn(),
  commitTransaction: jest.fn().mockResolvedValue(undefined),
  abortTransaction: jest.fn().mockResolvedValue(undefined),
  endSession: jest.fn().mockResolvedValue(undefined),
};

const buildPost = (commentsCount = 0) => ({
  _id: postId,
  commentsCount,
  isPublished: true,
  author: userId,
});

describe("CommentService.createComment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedStartSession.mockResolvedValue(session as never);
    mockedUser.findById.mockResolvedValue({
      _id: userId,
      email: "reader@example.com",
    } as never);
    mockedPost.updateOne.mockResolvedValue({ modifiedCount: 1 } as never);
  });

  it("creates a reply when the parent comment belongs to the same post", async () => {
    const post = buildPost(2);
    const createdComment = {
      _id: new Types.ObjectId("507f1f77bcf86cd799439041"),
      postId,
      userId,
      parentCommentId,
      comment: "Same-post reply",
    };

    mockedPost.findOne.mockResolvedValue(post as never);
    mockedComment.findOne.mockResolvedValue({
      _id: parentCommentId,
      postId,
      parentCommentId: null,
    } as never);
    mockedComment.create.mockResolvedValue([createdComment] as never);

    const result = await CommentService.createComment(
      {
        postId: postId.toString(),
        parentCommentId: parentCommentId.toString(),
        comment: "Same-post reply",
      },
      token,
    );

    expect(result).toBe(createdComment);
    expect(mockedComment.findOne).toHaveBeenCalledWith({
      _id: parentCommentId.toString(),
      postId: postId.toString(),
    });
    expect(mockedComment.create).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          postId,
          userId,
          comment: "Same-post reply",
          parentCommentId,
        }),
      ],
      { session },
    );
    expect(mockedPost.updateOne).toHaveBeenCalledWith(
      {
        _id: postId,
        isDeleted: { $ne: true },
      },
      { $inc: { commentsCount: 1 } },
      { session },
    );
    expect(session.startTransaction).toHaveBeenCalledTimes(1);
    expect(session.commitTransaction).toHaveBeenCalledTimes(1);
    expect(session.abortTransaction).not.toHaveBeenCalled();
    expect(session.endSession).toHaveBeenCalledTimes(1);
  });

  it("aborts the transaction when the comment count cannot be updated", async () => {
    const post = buildPost(2);
    const createdComment = {
      _id: new Types.ObjectId("507f1f77bcf86cd799439041"),
      postId,
      userId,
      parentCommentId,
      comment: "Same-post reply",
    };

    mockedPost.findOne.mockResolvedValue(post as never);
    mockedComment.findOne.mockResolvedValue({
      _id: parentCommentId,
      postId,
      parentCommentId: null,
    } as never);
    mockedComment.create.mockResolvedValue([createdComment] as never);
    mockedPost.updateOne.mockResolvedValue({ modifiedCount: 0 } as never);

    await expect(
      CommentService.createComment(
        {
          postId: postId.toString(),
          parentCommentId: parentCommentId.toString(),
          comment: "Same-post reply",
        },
        token,
      ),
    ).rejects.toMatchObject({
      statusCode: httpStatus.NOT_FOUND,
      message: "Post not found!",
    });

    expect(session.commitTransaction).not.toHaveBeenCalled();
    expect(session.abortTransaction).toHaveBeenCalledTimes(1);
    expect(session.endSession).toHaveBeenCalledTimes(1);
  });

  it("rejects replies when the parent comment id is not valid", async () => {
    const post = buildPost(4);

    mockedPost.findOne.mockResolvedValue(post as never);

    await expect(
      CommentService.createComment(
        {
          postId: postId.toString(),
          parentCommentId: "invalid-parent-id",
          comment: "Invalid parent reply",
        },
        token,
      ),
    ).rejects.toMatchObject({
      statusCode: httpStatus.BAD_REQUEST,
      message: "Invalid parentCommentId",
    });

    expect(mockedComment.findOne).not.toHaveBeenCalled();
    expect(mockedComment.create).not.toHaveBeenCalled();
    expect(mockedPost.updateOne).not.toHaveBeenCalled();
    expect(mockedStartSession).not.toHaveBeenCalled();
  });

  it("rejects replies when the parent comment is not on the target post", async () => {
    const post = buildPost(4);

    mockedPost.findOne.mockResolvedValue(post as never);
    mockedComment.findOne.mockResolvedValue(null);

    await expect(
      CommentService.createComment(
        {
          postId: postId.toString(),
          parentCommentId: parentCommentId.toString(),
          comment: "Cross-post reply",
        },
        token,
      ),
    ).rejects.toMatchObject({
      statusCode: httpStatus.NOT_FOUND,
      message: "Parent comment not found for this post!",
    });

    expect(mockedComment.create).not.toHaveBeenCalled();
    expect(post.commentsCount).toBe(4);
    expect(mockedPost.updateOne).not.toHaveBeenCalled();
    expect(mockedStartSession).not.toHaveBeenCalled();
  });

  it("rejects replies to replies so nested replies do not become invisible", async () => {
    const post = buildPost(1);

    mockedPost.findOne.mockResolvedValue(post as never);
    mockedComment.findOne.mockResolvedValue({
      _id: parentCommentId,
      postId,
      parentCommentId: new Types.ObjectId("507f1f77bcf86cd799439032"),
    } as never);

    await expect(
      CommentService.createComment(
        {
          postId: postId.toString(),
          parentCommentId: parentCommentId.toString(),
          comment: "Nested reply",
        },
        token,
      ),
    ).rejects.toThrow("Replies can only be added to top-level comments!");

    expect(mockedComment.create).not.toHaveBeenCalled();
    expect(post.commentsCount).toBe(1);
    expect(mockedPost.updateOne).not.toHaveBeenCalled();
    expect(mockedStartSession).not.toHaveBeenCalled();
  });
});
