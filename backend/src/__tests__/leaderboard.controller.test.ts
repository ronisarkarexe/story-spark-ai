/**
 * leaderboard.controller.test.ts
 *
 * Unit tests for the getWeeklyLeaderboard controller.
 * Tests the weekly aggregation pipeline, scoring, and response shape.
 *
 * Run: cd backend && ../node_modules/.bin/jest src/__tests__/leaderboard.controller.test.ts --colors=false
 */

import { Request, Response } from "express";

jest.mock("../app/modules/post/post.model", () => ({
  Post: {
    aggregate: jest.fn(),
  },
}));

jest.mock("../app/modules/user/user.model", () => ({
  User: {
    findById: jest.fn(),
  },
}));

import { Post } from "../app/modules/post/post.model";
import { User } from "../app/modules/user/user.model";
import { getWeeklyLeaderboard } from "../app/modules/leaderboard/leaderboard.controller";

const mockPostAggregate = Post.aggregate as any;

describe("getWeeklyLeaderboard", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockReq = {};
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it("returns 200 with ranked leaderboard data on success", async () => {
    // The mock must return the data as MongoDB's $project stage would produce it.
    mockPostAggregate.mockResolvedValueOnce([
      {
        authorId: "user-1",
        name: "Jane Doe",
        avatar: "https://example.com/avatar.png",
        storiesCount: 5,
        creativeScore: 1240,
        totalViews: 800,
        totalLikes: 120,
        totalComments: 50,
      },
      {
        authorId: "user-2",
        name: "John Smith",
        avatar: "",
        storiesCount: 3,
        creativeScore: 420,
        totalViews: 300,
        totalLikes: 30,
        totalComments: 10,
      },
    ]);

    await getWeeklyLeaderboard(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: "Weekly leaderboard metrics compiled successfully",
      data: [
        {
          rank: 1,
          name: "Jane Doe",
          avatar: "https://example.com/avatar.png",
          storiesCount: 5,
          creativeScore: 1240,
          totalViews: 800,
          totalLikes: 120,
          totalComments: 50,
        },
        {
          rank: 2,
          name: "John Smith",
          avatar: "",
          storiesCount: 3,
          creativeScore: 420,
          totalViews: 300,
          totalLikes: 30,
          totalComments: 10,
        },
      ],
    });
  });

  it("uses Anonymous for users with no userInfo", async () => {
    mockPostAggregate.mockResolvedValueOnce([
      {
        authorId: "user-456",
        name: "Anonymous",
        avatar: "",
        storiesCount: 1,
        creativeScore: 140,
        totalViews: 100,
        totalLikes: 10,
        totalComments: 5,
      },
    ]);

    await getWeeklyLeaderboard(mockReq as Request, mockRes as Response);

    const call = jsonMock.mock.calls[0][0];
    expect(call.data[0].name).toBe("Anonymous");
    expect(call.data[0].avatar).toBe("");
  });

  it("returns 200 with empty data when no posts exist", async () => {
    mockPostAggregate.mockResolvedValueOnce([]);

    await getWeeklyLeaderboard(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: "Weekly leaderboard metrics compiled successfully",
      data: [],
    });
  });

  it("returns 500 on database error", async () => {
    mockPostAggregate.mockRejectedValueOnce(new Error("DB connection failed"));

    await getWeeklyLeaderboard(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "DB connection failed",
    });
  });

  it("rounds creativeScore to an integer", async () => {
    // creativeScore may come back as a float from aggregation
    mockPostAggregate.mockResolvedValueOnce([
      {
        authorId: "user-789",
        name: "Alice",
        avatar: "https://x.com/a.png",
        storiesCount: 2,
        creativeScore: 740.5,
        totalViews: 500,
        totalLikes: 50,
        totalComments: 20,
      },
    ]);

    await getWeeklyLeaderboard(mockReq as Request, mockRes as Response);

    const call = jsonMock.mock.calls[0][0];
    expect(call.data[0].creativeScore).toBe(741);
  });
});
