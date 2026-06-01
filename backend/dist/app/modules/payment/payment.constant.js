"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePlan = exports.PLAN_PRICING = void 0;
const subscription_type_1 = require("../../../enums/subscription_type");
// Server side source of truth for paid plan prices. Amounts are in paise (INR).
exports.PLAN_PRICING = {
    pro: {
        subscriptionType: subscription_type_1.SUBSCRIPTION_TYPE.PRO,
        amount: 149900,
        currency: "INR",
    },
    premium: {
        subscriptionType: subscription_type_1.SUBSCRIPTION_TYPE.PREMIUM,
        amount: 399900,
        currency: "INR",
    },
};
const PLAN_ALIASES = {
    pro: "pro",
    premium: "premium",
    enterprise: "premium",
};
// Maps any accepted client plan label to a known paid plan key, or null.
const normalizePlan = (raw) => {
    var _a;
    if (typeof raw !== "string")
        return null;
    return (_a = PLAN_ALIASES[raw.trim().toLowerCase()]) !== null && _a !== void 0 ? _a : null;
};
exports.normalizePlan = normalizePlan;
