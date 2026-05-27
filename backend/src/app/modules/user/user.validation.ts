import { z } from "zod";

const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const register = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }),
    name: z.string({ required_error: "Name is required" }),
    password: passwordSchema,
  }),
});

const login = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const forgotPassword = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
  }),
});

const resetPassword = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string({ required_error: "Confirm password is required" }),
    verificationToken: z.string({ required_error: "Verification token is required" }),
  }),
});

export const UserValidator = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
