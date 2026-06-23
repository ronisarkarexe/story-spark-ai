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
    name: z
      .string({ required_error: "Name is required" })
      .min(2, "Name must be at least 2 characters long"),
    password: passwordSchema,
    verificationToken: z
      .string({ required_error: "Verification token is required" })
      .min(1, "Verification token is required"),
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

const updateUser = z.object({
  body: z
    .object({
      name: z.string().trim().min(1, "Full Name cannot be empty.").max(100).optional(),
      profile: z
        .object({
          avatar: z.string().max(2000).optional(),
          bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional(),
          social: z
            .object({
              facebook: z.string().max(200).optional(),
              twitter: z.string().max(200).optional(),
              linkedin: z.string().max(200).optional(),
              instagram: z.string().max(200).optional(),
            })
            .partial()
            .strict()
            .optional(),
        })
        .partial()
        .strict()
        .optional(),
    })
    .partial()
    .strict(),
});

const changePassword = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "Old password is required" }),
    newPassword: passwordSchema,
  }),
});

const updateReadingPreferences = z.object({
  body: z
    .object({
      skip: z.boolean().optional(),
      genres: z
        .array(z.string())
        .min(1, "Select at least one genre")
        .max(10, "You can select up to 10 genres")
        .optional(),
      preferredLength: z.enum(["short", "medium", "long"]).optional(),
      moods: z
        .array(z.string())
        .min(1, "Select at least one mood")
        .max(10, "You can select up to 10 moods")
        .optional(),
    })
    .strict()
    .superRefine((body, ctx) => {
      if (body.skip) {
        return;
      }

      if (!body.genres?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select at least one genre",
          path: ["genres"],
        });
      }

      if (!body.preferredLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Preferred story length is required",
          path: ["preferredLength"],
        });
      }

      if (!body.moods?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select at least one mood",
          path: ["moods"],
        });
      }
    }),
});

export const UserValidator = {
  register,
  login,
  forgotPassword,
  resetPassword,
  updateUser,
  changePassword,
  updateReadingPreferences,
};
