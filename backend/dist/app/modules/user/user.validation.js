"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidator = void 0;
const zod_1 = require("zod");
const socialProfile = zod_1.z
    .object({
    facebook: zod_1.z.string().optional(),
    twitter: zod_1.z.string().optional(),
    linkedin: zod_1.z.string().optional(),
    instagram: zod_1.z.string().optional(),
})
    .strict();
const profile = zod_1.z
    .object({
    avatar: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    social: socialProfile.optional(),
})
    .strict();
const register = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required" }),
        name: zod_1.z.string({ required_error: "Name is required" }),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
const login = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required" }),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
const updateProfile = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z.string().min(5).max(100).optional(),
        profile: profile.optional(),
    })
        .strict(),
});
exports.UserValidator = {
    register,
    login,
    updateProfile,
};
