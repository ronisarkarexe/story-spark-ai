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
exports.unsubscribeByToken = exports.verifyNewsletter = exports.subscribeNewsletter = void 0;
const crypto_1 = __importDefault(require("crypto"));
const newsletter_model_1 = require("./newsletter.model");
const email_util_1 = require("../../../utils/email.util");
// Builds the absolute link that the recipient clicks to unsubscribe. The token
// is delivered only in the email, so it cannot be guessed or enumerated.
const buildUnsubscribeUrl = (baseUrl, token) => baseUrl ? `${baseUrl}/api/v1/newsletter/unsubscribe/${token}` : undefined;
const subscribeNewsletter = (email, name, source, userId, baseUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = yield newsletter_model_1.NewsletterSubscriber.findOne({ email: normalizedEmail });
    if (existing) {
        if (existing.status === "active") {
            return { message: "Already subscribed", subscriber: existing };
        }
        if (existing.status === "unsubscribed") {
            existing.status = "pending";
            existing.unsubscribedAt = undefined;
            existing.verificationToken = crypto_1.default.randomBytes(32).toString("hex");
            existing.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
            if (!existing.unsubscribeToken) {
                existing.unsubscribeToken = crypto_1.default.randomBytes(32).toString("hex");
            }
            yield existing.save();
            yield (0, email_util_1.sendVerificationEmail)(normalizedEmail, existing.verificationToken, buildUnsubscribeUrl(baseUrl, existing.unsubscribeToken));
            return { message: "Re-subscribed. Please verify your email.", subscriber: existing };
        }
    }
    // New subscriber
    const token = crypto_1.default.randomBytes(32).toString("hex");
    const unsubscribeToken = crypto_1.default.randomBytes(32).toString("hex");
    const subscriber = yield newsletter_model_1.NewsletterSubscriber.create({
        email: normalizedEmail,
        name,
        source,
        userId,
        status: "pending",
        isVerified: false,
        verificationToken: token,
        verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        unsubscribeToken,
    });
    yield (0, email_util_1.sendVerificationEmail)(normalizedEmail, token, buildUnsubscribeUrl(baseUrl, unsubscribeToken));
    return { message: "Subscribed! Please verify your email.", subscriber };
});
exports.subscribeNewsletter = subscribeNewsletter;
const verifyNewsletter = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriber = yield newsletter_model_1.NewsletterSubscriber.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: new Date() },
    });
    if (!subscriber)
        throw new Error("Invalid or expired verification token.");
    subscriber.status = "active";
    subscriber.isVerified = true;
    subscriber.subscribedAt = new Date();
    subscriber.verificationToken = undefined;
    subscriber.verificationTokenExpires = undefined;
    yield subscriber.save();
    return { message: "Email verified successfully.", subscriber };
});
exports.verifyNewsletter = verifyNewsletter;
const unsubscribeByToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriber = yield newsletter_model_1.NewsletterSubscriber.findOne({
        unsubscribeToken: token,
    });
    if (!subscriber)
        throw new Error("Invalid unsubscribe token.");
    if (subscriber.status !== "unsubscribed") {
        subscriber.status = "unsubscribed";
        subscriber.unsubscribedAt = new Date();
        yield subscriber.save();
    }
    return { message: "Unsubscribed successfully." };
});
exports.unsubscribeByToken = unsubscribeByToken;
