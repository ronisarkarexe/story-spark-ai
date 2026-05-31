import { z } from "zod";

const socialProfile = z
  .object({
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    instagram: z.string().optional(),
  })
  .strict();

const profile = z
  .object({
    avatar: z.string().optional(),
    bio: z.string().optional(),
    social: socialProfile.optional(),
  })
  .strict();

const register = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }),
    name: z.string({ required_error: "Name is required" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const login = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const updateProfile = z.object({
  body: z
    .object({
      name: z.string().min(5).max(100).optional(),
      profile: profile.optional(),
    })
    .strict(),
});

export const UserValidator = {
  register,
  login,
  updateProfile,
};
