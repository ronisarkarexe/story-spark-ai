import { Request, Response } from "express";
import { RecommendationController } from "../recommendation.controller";
import { RecommendationService } from "../recommendation.service";
import { getToken } from "../../../middleware/token";

jest.mock("../recommendation.service");
jest.mock("../../../middleware/token");

const mockSendResponse = jest.fn();

jest.mock("../../../../shared/send_response", () => ({
    __esModule: true,
    default: (...args: unknown[]) => mockSendResponse(...args),
}));

const makeReq = (): Partial<Request> => ({
    headers: {
        authorization: "Bearer test-token",
    },
});

const makeRes = (): Partial<Response> => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
});

describe("RecommendationController.getPersonalizedRecommendations", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns recommendations successfully", async () => {

        // Mock recommendations returned by the service
        const recommendations = [
            { _id: "1", title: "Fantasy Story" },
        ];

        // Mock authenticated user token extraction
        (getToken as jest.Mock).mockResolvedValue({
            _id: "user-id",
            email: "user@test.com",
            role: "USER",
        });

        // Mock recommendation service response
        (
            RecommendationService.getPersonalizedRecommendations as jest.Mock
        ).mockResolvedValue(recommendations);

        const req = makeReq() as Request;
        const res = makeRes() as Response;
        const next = jest.fn();

        await RecommendationController.getPersonalizedRecommendations(
            req,
            res,
            next
        );

        // Verify token extraction was performed
        expect(getToken).toHaveBeenCalledWith(req);

        // Verify service was called with authenticated user token
        expect(
            RecommendationService.getPersonalizedRecommendations
        ).toHaveBeenCalledWith(
            expect.objectContaining({
                _id: "user-id",
            })
        );

        // Verify successful response payload
        expect(mockSendResponse).toHaveBeenCalledWith(
            res,
            expect.objectContaining({
                statusCode: 200,
                success: true,
                data: recommendations,
            })
        );
    });

    it("forwards service errors to next()", async () => {

        // Mock authenticated user
        (getToken as jest.Mock).mockResolvedValue({
            _id: "user-id",
            email: "user@test.com",
            role: "USER",
        });

        // Simulate service failure
        (
            RecommendationService.getPersonalizedRecommendations as jest.Mock
        ).mockRejectedValue(new Error("Failed"));

        const req = makeReq() as Request;
        const res = makeRes() as Response;
        const next = jest.fn();

        await RecommendationController.getPersonalizedRecommendations(
            req,
            res,
            next
        );

        // Verify catchAsync forwards errors to Express error handler
        expect(next).toHaveBeenCalled();
    });
    it("forwards token extraction errors to next()", async () => {
        (getToken as jest.Mock).mockRejectedValue(
            new Error("Invalid token")
        );

        const req = makeReq() as Request;
        const res = makeRes() as Response;
        const next = jest.fn();

        await RecommendationController.getPersonalizedRecommendations(
            req,
            res,
            next
        );

        expect(next).toHaveBeenCalled();
    });
});