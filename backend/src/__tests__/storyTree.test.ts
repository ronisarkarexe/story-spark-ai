import { Request, Response } from "express";

// Mock dependencies
jest.mock("../app/modules/post/post.model", () => ({
  Post: {
    findById: jest.fn(),
    find: jest.fn(),
  },
}));

jest.mock("../app/modules/post/post.utils", () => ({
  verifyPostAccess: jest.fn(),
}));

jest.mock("../shared/send_response", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { StoryBranchingController } from "../controllers/storyBranchingController";
import { Post } from "../app/modules/post/post.model";
import { verifyPostAccess } from "../app/modules/post/post.utils";
import sendResponse from "../shared/send_response";
import httpStatus from "http-status";

const mockFindById = Post.findById as jest.Mock;
const mockFind = Post.find as jest.Mock;
const mockVerifyPostAccess = verifyPostAccess as jest.Mock;
const mockSendResponse = sendResponse as jest.Mock;

describe("StoryBranchingController.getStoryTree", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      params: {
        rootStoryId: "507f1f77bcf86cd799439011",
      },
      user: {
        _id: "user123",
        email: "user@example.com",
        role: "user",
      },
    };
    mockRes = {};
  });

  it("should return 400 if rootStoryId is not a valid ObjectId", async () => {
    mockReq.params!.rootStoryId = "invalid-id";

    await StoryBranchingController.getStoryTree(mockReq as Request, mockRes as Response);

    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid rootStoryId provided",
      data: null,
    });
  });

  it("should return 404 if root story does not exist", async () => {
    mockFindById.mockResolvedValueOnce(null);

    await StoryBranchingController.getStoryTree(mockReq as Request, mockRes as Response);

    expect(mockFindById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Root story not found",
      data: null,
    });
  });

  it("should return 403 if user is not authorized to access root story", async () => {
    const mockRootStory = {
      _id: "507f1f77bcf86cd799439011",
      title: "Root Story",
      isPublished: false,
      author: "other_user",
    };

    mockFindById.mockResolvedValueOnce(mockRootStory);
    mockVerifyPostAccess.mockImplementationOnce(() => {
      throw {
        statusCode: httpStatus.FORBIDDEN,
        message: "Access to this draft is forbidden.",
      };
    });

    await StoryBranchingController.getStoryTree(mockReq as Request, mockRes as Response);

    expect(mockVerifyPostAccess).toHaveBeenCalledWith(mockRootStory, mockReq.user);
    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, {
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      message: "Access to this draft is forbidden.",
      data: null,
    });
  });

  it("should successfully retrieve and format nodes for story lineage tree", async () => {
    const mockRootStory = {
      _id: "507f1f77bcf86cd799439011",
      title: "Root Story",
      isPublished: true,
      author: "user123",
    };

    const mockChildStories = [
      {
        _id: "507f1f77bcf86cd799439011",
        title: "Root Story",
        parentStoryId: null,
        branchDepth: 0,
        createdAt: "2026-06-21T00:00:00.000Z",
      },
      {
        _id: "507f1f77bcf86cd799439012",
        title: "Derived Variation A",
        parentStoryId: "507f1f77bcf86cd799439011",
        branchDepth: 1,
        createdAt: "2026-06-21T01:00:00.000Z",
      },
    ];

    mockFindById.mockResolvedValueOnce(mockRootStory);
    mockVerifyPostAccess.mockImplementationOnce(() => { });

    const mockQuery = {
      populate: jest.fn().mockResolvedValueOnce(mockChildStories),
    };
    mockFind.mockReturnValueOnce(mockQuery);

    await StoryBranchingController.getStoryTree(mockReq as Request, mockRes as Response);

    expect(mockFind).toHaveBeenCalledWith({
      rootStoryId: expect.any(Object), // Types.ObjectId
      isDeleted: { $ne: true },
    });
    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Story tree retrieved successfully",
      data: {
        nodes: [
          {
            id: "507f1f77bcf86cd799439011",
            title: "Root Story",
            parentStoryId: null,
            branchDepth: 0,
            createdAt: "2026-06-21T00:00:00.000Z",
          },
          {
            id: "507f1f77bcf86cd799439012",
            title: "Derived Variation A",
            parentStoryId: "507f1f77bcf86cd799439011",
            branchDepth: 1,
            createdAt: "2026-06-21T01:00:00.000Z",
          },
        ],
      },
    });
  });
});
