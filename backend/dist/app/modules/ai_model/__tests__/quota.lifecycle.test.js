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
Object.defineProperty(exports, "__esModule", { value: true });
const quota_service_1 = require("../quota.service");
const quota_lifecycle_1 = require("../quota.lifecycle");
jest.mock("../quota.service", () => (Object.assign(Object.assign({}, jest.requireActual("../quota.service")), { refundUserQuota: jest.fn() })));
const mockedRefund = quota_service_1.refundUserQuota;
describe("QuotaRefundGuard", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedRefund.mockResolvedValue(undefined);
    });
    it("refunds at most once when refundOnce is called multiple times", () => __awaiter(void 0, void 0, void 0, function* () {
        const guard = (0, quota_lifecycle_1.createUserQuotaGuard)("user@example.com");
        yield guard.refundOnce();
        yield guard.refundOnce();
        expect(mockedRefund).toHaveBeenCalledTimes(1);
    }));
});
describe("runWithQuotaCleanup", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedRefund.mockResolvedValue(undefined);
    });
    it("does not refund when operation succeeds", () => __awaiter(void 0, void 0, void 0, function* () {
        const guard = (0, quota_lifecycle_1.createUserQuotaGuard)("user@example.com");
        const result = yield (0, quota_lifecycle_1.runWithQuotaCleanup)(guard, () => __awaiter(void 0, void 0, void 0, function* () { return "ok"; }));
        expect(result).toBe("ok");
        expect(mockedRefund).not.toHaveBeenCalled();
    }));
    it("refunds once when operation throws", () => __awaiter(void 0, void 0, void 0, function* () {
        const guard = (0, quota_lifecycle_1.createUserQuotaGuard)("user@example.com");
        yield expect((0, quota_lifecycle_1.runWithQuotaCleanup)(guard, () => __awaiter(void 0, void 0, void 0, function* () {
            throw new Error("token failure");
        }))).rejects.toThrow("token failure");
        expect(mockedRefund).toHaveBeenCalledTimes(1);
    }));
});
