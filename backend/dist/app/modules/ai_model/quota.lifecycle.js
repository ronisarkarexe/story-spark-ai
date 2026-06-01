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
exports.assertSuccessfulGeneration = exports.runWithQuotaCleanup = exports.createGuestQuotaGuard = exports.createUserQuotaGuard = exports.QuotaRefundGuard = void 0;
const http_status_1 = __importDefault(require("http-status"));
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const quota_service_1 = require("./quota.service");
/**
 * Ensures quota is refunded at most once per request (controller finally + service paths).
 */
class QuotaRefundGuard {
    constructor(refund) {
        this.refund = refund;
        this.refunded = false;
    }
    refundOnce() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.refunded) {
                return;
            }
            this.refunded = true;
            try {
                yield this.refund();
            }
            catch (error) {
                this.refunded = false;
                throw error;
            }
        });
    }
    get hasRefunded() {
        return this.refunded;
    }
}
exports.QuotaRefundGuard = QuotaRefundGuard;
const createUserQuotaGuard = (email) => new QuotaRefundGuard(() => (0, quota_service_1.refundUserQuota)(email));
exports.createUserQuotaGuard = createUserQuotaGuard;
const createGuestQuotaGuard = (guestId) => new QuotaRefundGuard(() => (0, quota_service_1.refundGuestQuota)(guestId));
exports.createGuestQuotaGuard = createGuestQuotaGuard;
/**
 * Runs an operation and refunds reserved quota in `finally` when it does not complete successfully.
 */
const runWithQuotaCleanup = (guard, operation) => __awaiter(void 0, void 0, void 0, function* () {
    let succeeded = false;
    try {
        const result = yield operation();
        succeeded = true;
        return result;
    }
    finally {
        if (!succeeded) {
            yield guard.refundOnce();
        }
    }
});
exports.runWithQuotaCleanup = runWithQuotaCleanup;
const assertSuccessfulGeneration = (result, message) => {
    if (!Array.isArray(result) || result.length === 0) {
        throw new api_error_1.default(http_status_1.default.BAD_GATEWAY, message);
    }
};
exports.assertSuccessfulGeneration = assertSuccessfulGeneration;
