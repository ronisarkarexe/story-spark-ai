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
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const ai_model_request_limit_1 = require("../../../../interfaces/ai_model_request_limit");
const user_model_1 = require("../../user/user.model");
const guest_usage_model_1 = require("../guest_usage.model");
const quota_service_1 = require("../quota.service");
const user_1 = require("../../../../enums/user");
const subscription_type_1 = require("../../../../enums/subscription_type");
const user_status_1 = require("../../../../enums/user_status");
describe("quota integration (mongodb-memory-server)", () => {
    let mongoServer;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        yield mongoose_1.default.connect(mongoServer.getUri());
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield mongoServer.stop();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_model_1.User.deleteMany({});
        yield guest_usage_model_1.GuestUsage.deleteMany({});
    }));
    const createUser = (email, subscriptionType, requestsThisMonth) => __awaiter(void 0, void 0, void 0, function* () {
        return user_model_1.User.create({
            email,
            subscriptionType,
            requestsThisMonth,
            lastRequestDate: new Date(),
            role: user_1.ENUM_USER_ROLE.USER,
            status: user_status_1.USER_STATUS.ACTIVE,
        });
    });
    it("allows exactly one parallel reserve at the free-tier boundary", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = "boundary-free@test.com";
        yield createUser(email, subscription_type_1.SUBSCRIPTION_TYPE.FREE, ai_model_request_limit_1.REQUEST_LIMITS.free - 1);
        const attempts = 8;
        const results = yield Promise.allSettled(Array.from({ length: attempts }, () => (0, quota_service_1.reserveUserQuota)(email)));
        const succeeded = results.filter((r) => r.status === "fulfilled").length;
        const failed = results.filter((r) => r.status === "rejected").length;
        expect(succeeded).toBe(1);
        expect(failed).toBe(attempts - 1);
        const user = yield user_model_1.User.findOne({ email });
        expect(user === null || user === void 0 ? void 0 : user.requestsThisMonth).toBe(ai_model_request_limit_1.REQUEST_LIMITS.free);
    }));
    it("never exceeds pro tier limit under parallel load", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = "boundary-pro@test.com";
        yield createUser(email, subscription_type_1.SUBSCRIPTION_TYPE.PRO, ai_model_request_limit_1.REQUEST_LIMITS.pro - 1);
        const results = yield Promise.allSettled(Array.from({ length: 10 }, () => (0, quota_service_1.reserveUserQuota)(email)));
        expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
        const user = yield user_model_1.User.findOne({ email });
        expect(user === null || user === void 0 ? void 0 : user.requestsThisMonth).toBeLessThanOrEqual(ai_model_request_limit_1.REQUEST_LIMITS.pro);
        expect(user === null || user === void 0 ? void 0 : user.requestsThisMonth).toBe(ai_model_request_limit_1.REQUEST_LIMITS.pro);
    }));
    it("uses subscription tier from DB atomically when upgrading effective limit", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = "tier@test.com";
        yield createUser(email, subscription_type_1.SUBSCRIPTION_TYPE.PREMIUM, 0);
        yield (0, quota_service_1.reserveUserQuota)(email);
        const user = yield user_model_1.User.findOne({ email });
        expect(user === null || user === void 0 ? void 0 : user.requestsThisMonth).toBe(1);
        expect(user === null || user === void 0 ? void 0 : user.subscriptionType).toBe(subscription_type_1.SUBSCRIPTION_TYPE.PREMIUM);
    }));
    it("caps guest reserves at FREE_GUEST_LIMIT under parallel load", () => __awaiter(void 0, void 0, void 0, function* () {
        const guestId = "guest-boundary";
        yield guest_usage_model_1.GuestUsage.create({ guestId, requestCount: 0 });
        const results = yield Promise.allSettled(Array.from({ length: 8 }, () => (0, quota_service_1.reserveGuestQuota)(guestId)));
        const succeeded = results.filter((r) => r.status === "fulfilled").length;
        expect(succeeded).toBe(quota_service_1.FREE_GUEST_LIMIT);
        const usage = yield guest_usage_model_1.GuestUsage.findOne({ guestId });
        expect(usage === null || usage === void 0 ? void 0 : usage.requestCount).toBe(quota_service_1.FREE_GUEST_LIMIT);
    }));
});
