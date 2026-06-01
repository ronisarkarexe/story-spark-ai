"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const api_error_1 = __importDefault(require("../../../../errors/api_error"));
const ai_model_request_limit_1 = require("../../../../interfaces/ai_model_request_limit");
const user_model_1 = require("../../user/user.model");
const guest_usage_model_1 = require("../guest_usage.model");
const quota_service_1 = require("../quota.service");
jest.mock("../../user/user.model", () => ({
    User: {
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        exists: jest.fn(),
    },
}));
jest.mock("../guest_usage.model", () => ({
    GuestUsage: {
        findOneAndUpdate: jest.fn(),
    },
}));
const mockedUser = user_model_1.User;
const mockedGuestUsage = guest_usage_model_1.GuestUsage;
describe("quota.service helpers", () => {
    it("computes effective request count with month rollover", () => {
        const firstDay = (0, quota_service_1.getFirstDayOfMonth)(new Date(2026, 4, 15));
        const lastMonth = new Date(2026, 3, 20);
        expect((0, quota_service_1.effectiveRequestCount)(5, lastMonth, firstDay)).toBe(0);
        expect((0, quota_service_1.effectiveRequestCount)(5, new Date(2026, 4, 10), firstDay)).toBe(5);
        expect((0, quota_service_1.effectiveRequestCount)(2, null, firstDay)).toBe(0);
    });
    it("treats only non-empty story arrays as successful generation", () => {
        expect((0, quota_service_1.isSuccessfulGeneration)([{ title: "A" }])).toBe(true);
        expect((0, quota_service_1.isSuccessfulGeneration)([])).toBe(false);
        expect((0, quota_service_1.isSuccessfulGeneration)(null)).toBe(false);
        expect((0, quota_service_1.isSuccessfulGeneration)(undefined)).toBe(false);
    });
    it("embeds tier limits in subscriptionLimitExpression", () => {
        expect((0, quota_service_1.subscriptionLimitExpression)()).toMatchObject({
            $switch: expect.objectContaining({
                default: ai_model_request_limit_1.REQUEST_LIMITS.free,
            }),
        });
    });
});
describe("reserveUserQuota", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("throws when user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedUser.findOneAndUpdate.mockResolvedValue(null);
        mockedUser.exists.mockResolvedValue(null);
        yield expect((0, quota_service_1.reserveUserQuota)("missing@example.com")).rejects.toMatchObject({
            statusCode: http_status_1.default.BAD_REQUEST,
        });
        expect(mockedUser.findOne).not.toHaveBeenCalled();
    }));
    it("throws conflict when atomic reservation fails", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedUser.findOneAndUpdate.mockResolvedValue(null);
        mockedUser.exists.mockResolvedValue({ _id: "507f1f77bcf86cd799439011" });
        yield expect((0, quota_service_1.reserveUserQuota)("user@example.com")).rejects.toMatchObject({
            statusCode: http_status_1.default.CONFLICT,
        });
    }));
    it("reserves quota in a single findOneAndUpdate without pre-reading subscription", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        mockedUser.findOneAndUpdate.mockResolvedValue({
            email: "user@example.com",
            requestsThisMonth: 3,
            subscriptionType: "pro",
        });
        yield expect((0, quota_service_1.reserveUserQuota)("user@example.com")).resolves.toBeUndefined();
        expect(mockedUser.findOneAndUpdate).toHaveBeenCalledTimes(1);
        expect(mockedUser.findOne).not.toHaveBeenCalled();
        const filter = (_a = mockedUser.findOneAndUpdate.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
        expect(filter.$expr.$lt[1]).toEqual((0, quota_service_1.subscriptionLimitExpression)());
    }));
});
describe("refundUserQuota", () => {
    it("decrements usage without going negative", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedUser.findOneAndUpdate.mockResolvedValue({
            requestsThisMonth: 0,
        });
        yield (0, quota_service_1.refundUserQuota)("user@example.com");
        expect(mockedUser.findOneAndUpdate).toHaveBeenCalledWith({ email: "user@example.com", requestsThisMonth: { $gt: 0 } }, expect.any(Array));
    }));
});
describe("guest quota", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("rejects when guest limit is exceeded", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedGuestUsage.findOneAndUpdate.mockResolvedValue(null);
        yield expect((0, quota_service_1.reserveGuestQuota)("guest-1")).rejects.toBeInstanceOf(api_error_1.default);
    }));
    it("refunds guest quota on rollback", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedGuestUsage.findOneAndUpdate.mockResolvedValue({
            requestCount: 1,
        });
        yield (0, quota_service_1.refundGuestQuota)("guest-1");
        expect(mockedGuestUsage.findOneAndUpdate).toHaveBeenCalledWith({ guestId: "guest-1", requestCount: { $gt: 0 } }, expect.any(Array));
    }));
});
describe("concurrency semantics", () => {
    it("uses conditional findOneAndUpdate with tier limit from document", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedUser.findOneAndUpdate.mockResolvedValue({ requestsThisMonth: 7 });
        yield (0, quota_service_1.reserveUserQuota)("user@example.com");
        const updateCall = mockedUser.findOneAndUpdate.mock.calls[0];
        expect(updateCall[0]).toHaveProperty("$expr");
        expect(Array.isArray(updateCall[1])).toBe(true);
    }));
});
