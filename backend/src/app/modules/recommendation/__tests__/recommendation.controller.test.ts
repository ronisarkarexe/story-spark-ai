
/**
 * recommendation.controller.test.ts
 * Unit tests for RecommendationController.getPersonalizedRecommendations
 */
import { Response, NextFunction } from "express";
import { Types } from "mongoose";
import { RecommendationController } from "../recommendation.controller";
import { RecommendationService } from "../recommendation.service";
import { getToken } from "../../../middleware/token";
=======
import httpStatus from "http-status";
import { Request, Response } from "express";
import { Types } from "mongoose";

jest.mock("../../../middleware/token", () => ({
  getToken: jest.fn(),
}));


jest.mock("../recommendation.service", () => ({
  RecommendationService: {
    getPersonalizedRecommendations: jest.fn(),
  },
}));


jest.mock("../../../middleware/token", () => ({
  getToken: jest.fn(),
}));

jest.mock("../../../../shared/send_response", () => jest.fn());

const mockGetToken = getToken as jest.Mock;
const mockSendResponse = require("../../../../shared/send_response") as jest.Mock;
const mockService = RecommendationService as {
  getPersonalizedRecommendations: jest.Mock;
};

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;

const mockNext = jest.fn();

const userId = new Types.ObjectId("507f1f77bcf86cd799439011");
const token = {
  _id: userId.toString(),
  email: "reader@example.com",
  role: "user",
};

const mockPosts = [
  { _id: new Types.ObjectId(), title: "Post 1", genre: "Fantasy" },
  { _id: new Types.ObjectId(), title: "Post 2", genre: "Sci-Fi" },
];

describe("RecommendationController.getPersonalizedRecommendations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNext.mockClear();
    mockGetToken.mockReturnValue(token);
    mockService.getPersonalizedRecommendations.mockResolvedValue(mockPosts);
  });

  it("extracts token from request using getToken", async () => {
    const mockReq = { headers: { authorization: "Bearer fake-token" } } as unknown as ReturnType<NextFunction> extends (req: infer R, ...args: any[]) => any ? R : never;

    await RecommendationController.getPersonalizedRecommendations(
      mockReq as any,
      mockRes,
      mockNext,
    );

    expect(mockGetToken).toHaveBeenCalledWith(mockReq);
    expect(mockGetToken).toHaveBeenCalledTimes(1);
  });

  it("calls getPersonalizedRecommendations service with the token payload", async () => {
    const mockReq = { headers: {} } as any;

    await RecommendationController.getPersonalizedRecommendations(
      mockReq,
      mockRes,
      mockNext,
    );

    expect(mockService.getPersonalizedRecommendations).toHaveBeenCalledWith(token);
    expect(mockService.getPersonalizedRecommendations).toHaveBeenCalledTimes(1);
  });

  it("returns 200 with recommendations array on success", async () => {
    const mockReq = { headers: {} } as any;

    await RecommendationController.getPersonalizedRecommendations(
      mockReq,
      mockRes,
      mockNext,
    );

    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, {
      statusCode: 200,
      success: true,
      message: expect.any(String),
      data: mockPosts,
    });
  });

  it("sends correct response shape via sendResponse", async () => {
    const mockReq = { headers: {} } as any;

    await RecommendationController.getPersonalizedRecommendations(
      mockReq,
      mockRes,
      mockNext,
    );

    const callArgs = mockSendResponse.mock.calls[0];
    expect(callArgs[0]).toBe(mockRes);
    expect(callArgs[1].statusCode).toBe(200);
    expect(callArgs[1].success).toBe(true);
    expect(callArgs[1].data).toEqual(mockPosts);
    expect(typeof callArgs[1].message).toBe("string");
  });

  it("returns empty array when no recommendations exist", async () => {
    const mockReq = { headers: {} } as any;
    mockService.getPersonalizedRecommendations.mockResolvedValue([]);

    await RecommendationController.getPersonalizedRecommendations(
      mockReq,
      mockRes,
      mockNext,
    );

    expect(mockSendResponse).toHaveBeenCalledWith(mockRes, {
      statusCode: 200,
      success: true,
      message: expect.any(String),
      data: [],
    });
  });

  it("passes error to next when getToken throws", async () => {
    const mockReq = { headers: {} } as any;
    const unauthorizedError = new Error("Unauthorized") as any;
    unauthorizedError.statusCode = 401;
    mockGetToken.mockImplementationOnce(() => {
      throw unauthorizedError;
    });

    await RecommendationController.getPersonalizedRecommendations(
      mockReq,
      mockRes,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalledWith(unauthorizedError);
    expect(mockService.getPersonalizedRecommendations).not.toHaveBeenCalled();
  });

  it("does not call next when service resolves successfully", async () => {
    const mockReq = { headers: {} } as any;

    await RecommendationController.getPersonalizedRecommendations(
      mockReq,
      mockRes,
      mockNext,
    );

    expect(mockNext).not.toHaveBeenCalled();

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getToken } = require("../../../middleware/token");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockedService: any = require("../recommendation.service").RecommendationService;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { RecommendationController } = require("../recommendation.controller");

function buildMocks() {
  const req = {
    headers: { authorization: "Bearer test-token" },
  } as unknown as Request;
  const jsonMock = jest.fn();
  const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
  const res = {
    status: statusMock,
    json: jsonMock,
  } as unknown as Response;
  const next = jest.fn();
  return { req, res, next, statusMock, jsonMock };
}

describe("RecommendationController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPersonalizedRecommendations", () => {
    const fakeToken = {
      _id: new Types.ObjectId().toString(),
      email: "user@example.com",
      role: "user",
      subscriptionType: "free",
    };

    const fakeRecommendations = [
      {
        _id: new Types.ObjectId().toString(),
        title: "Test Story",
        imageURL: "https://example.com/img.jpg",
        author: { name: "Author" },
        likesCount: 10,
        viewsCount: 100,
      },
    ];

    it("extracts token and returns 200 with recommendations", async () => {
      const { req, res, next, jsonMock, statusMock } = buildMocks();
      (getToken as jest.Mock).mockResolvedValue(fakeToken);
      mockedService.getPersonalizedRecommendations.mockResolvedValue(
        fakeRecommendations
      );

      await RecommendationController.getPersonalizedRecommendations(
        req,
        res,
        next as unknown as any
      );

      expect(getToken).toHaveBeenCalledWith(req);
      expect(mockedService.getPersonalizedRecommendations).toHaveBeenCalledWith(
        fakeToken
      );
      expect(statusMock).toHaveBeenCalledWith(httpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        statusCode: httpStatus.OK,
        message: "Personalized recommendations fetched successfully!",
        data: fakeRecommendations,
      });
    });

    it("passes error to next when getToken throws", async () => {
      const { req, res, next } = buildMocks();
      const tokenError = new Error("Invalid token");
      (getToken as jest.Mock).mockRejectedValue(tokenError);

      await RecommendationController.getPersonalizedRecommendations(
        req,
        res,
        next as unknown as any
      );

      expect(next).toHaveBeenCalledWith(tokenError);
    });

    it("passes error to next when service throws", async () => {
      const { req, res, next } = buildMocks();
      (getToken as jest.Mock).mockResolvedValue(fakeToken);
      const serviceError = new Error("Service unavailable");
      mockedService.getPersonalizedRecommendations.mockRejectedValue(
        serviceError
      );

      await RecommendationController.getPersonalizedRecommendations(
        req,
        res,
        next as unknown as any
      );

      expect(next).toHaveBeenCalledWith(serviceError);
    });

    it("returns empty array when no recommendations found", async () => {
      const { req, res, next, jsonMock, statusMock } = buildMocks();
      (getToken as jest.Mock).mockResolvedValue(fakeToken);
      mockedService.getPersonalizedRecommendations.mockResolvedValue([]);

      await RecommendationController.getPersonalizedRecommendations(
        req,
        res,
        next as unknown as any
      );

      expect(statusMock).toHaveBeenCalledWith(httpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        statusCode: httpStatus.OK,
        message: "Personalized recommendations fetched successfully!",
        data: [],
      });
    });

  });
});
