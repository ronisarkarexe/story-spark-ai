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
