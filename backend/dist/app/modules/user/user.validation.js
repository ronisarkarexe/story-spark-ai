"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidator = void 0;
const zod_1 = require("zod");
const passwordSchema = zod_1.z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
const register = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required" }),
        name: zod_1.z
            .string({ required_error: "Name is required" })
            .min(3, "Name must be at least 3 characters long"),
        password: passwordSchema,
        confirmPassword: zod_1.z.string({ required_error: "Confirm password is required" }),
        verificationToken: zod_1.z
            .string({ required_error: "Verification token is required" })
            .min(1, "Verification token is required"),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }),
});
const login = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required" }),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
const forgotPassword = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required" }).email("Invalid email address"),
    }),
});
const resetPassword = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required" }).email("Invalid email address"),
        password: passwordSchema,
        confirmPassword: zod_1.z.string({ required_error: "Confirm password is required" }),
        verificationToken: zod_1.z.string({ required_error: "Verification token is required" }),
    }),
});
const updateUser = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z.string().trim().min(1, "Full Name cannot be empty.").optional(),
        profile: zod_1.z
            .object({
            avatar: zod_1.z.string().optional(),
            bio: zod_1.z.string().optional(),
            social: zod_1.z
                .object({
                facebook: zod_1.z.string().optional(),
                twitter: zod_1.z.string().optional(),
                linkedin: zod_1.z.string().optional(),
                instagram: zod_1.z.string().optional(),
            })
                .partial()
                .optional(),
        })
            .partial()
            .optional(),
    })
        .partial(),
});
exports.UserValidator = {
    register,
    login,
    forgotPassword,
    resetPassword,
    updateUser,
};
