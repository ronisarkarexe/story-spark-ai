"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.unsubscribeByToken = exports.verify = exports.subscribe = void 0;
const newsletterService = __importStar(require("./newsletter.service"));
// Subscribe user to newsletter
const subscribe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, name, source } = req.body;
        if (!email || !email.includes("@")) {
            return res.status(400).json({ message: "Valid email is required." });
        }
        // Extract logged-in user id from JWT token if available
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Origin of the API request, used to build the unsubscribe link in the email.
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const result = yield newsletterService.subscribeNewsletter(email, name, source, userId, baseUrl);
        res.status(200).json(result);
    }
    catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: "This email is already subscribed.",
            });
        }
        res.status(400).json({
            message: err.message,
        });
    }
});
exports.subscribe = subscribe;
// Verify newsletter subscription token
const verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        const result = yield newsletterService.verifyNewsletter(token);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
});
exports.verify = verify;
// Unsubscribe via token from the email link. Safe, no email enumeration.
const unsubscribeByToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        const result = yield newsletterService.unsubscribeByToken(token);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.unsubscribeByToken = unsubscribeByToken;
