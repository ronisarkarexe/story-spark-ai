"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtHalers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (payload, secret, expireTime) => {
    const options = { algorithm: "HS256", expiresIn: expireTime };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
const createResetToken = (payload, secret, expireTime) => {
    const options = {
        algorithm: "HS256",
        expiresIn: expireTime,
    };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
const verifyToken = (token, secret) => {
    // Pin the algorithm so a forged token cannot downgrade or switch the alg header.
    return jsonwebtoken_1.default.verify(token, secret, { algorithms: ["HS256"] });
};
exports.JwtHalers = {
    createToken,
    verifyToken,
    createResetToken,
};
