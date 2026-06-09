const bcrypt = require("bcryptjs");
import { Schema, model } from "mongoose";
import { IUser, UserModel } from "./user.interface";

import config from "../../../config";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { SUBSCRIPTION_TYPE } from "../../../enums/subscription_type";
import { USER_STATUS } from "../../../enums/user_status";

export const UserSchema: Schema<IUser> = new Schema<IUser, UserModel>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, maxlength: 100, minlength: 5 },
    password: { type: String, required: false, default: "" },
    role: {
      type: String,
      required: true,
      enum: [
        ENUM_USER_ROLE.ADMIN,
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.USER,
        ENUM_USER_ROLE.WRITER,
      ],
      default: ENUM_USER_ROLE.USER,
    },
    status: {
      type: String,
      enum: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE, USER_STATUS.BLOCKED],
      default: USER_STATUS.ACTIVE,
    },
    profile: {
      avatar: { type: String, default: "" },
      bio: { type: String, default: "" },
      social: {
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        instagram: { type: String, default: "" },
        github: { type: String, default: '' },
        discord: { type: String, default: '' },
      },
    },
    subscriptionType: {
      type: String,
      enum: [
        SUBSCRIPTION_TYPE.FREE,
        SUBSCRIPTION_TYPE.PRO,
        SUBSCRIPTION_TYPE.PREMIUM,
      ],
      default: SUBSCRIPTION_TYPE.FREE,
    },
    postsCount: { type: Number, default: 0 },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    requestsThisMonth: { type: Number, default: 0 },
    lastRequestDate: { type: Date, default: null },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    isApplyForWriter: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 },
    gamification: {
      xp: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      streak: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: null },
      badges: [{ type: String }],
    },
    writingStreak: {
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: null },
      totalWritingDays: { type: Number, default: 0 },
    },
    readingPreferences: {
      favoriteGenres: [
        {
          name: { type: String },
          count: { type: Number, default: 0 },
        },
      ],
      favoriteEmotions: [
        {
          name: { type: String },
          count: { type: Number, default: 0 },
        },
      ],
    },
    readingHistory: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    writingGoals: {
      dailyWordCount: { type: Number, default: 0 },
      weeklyWordCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  // Only hash password if it exists, is not empty, and has been modified (for password-based auth)
  // Skip for Google OAuth users who don't have passwords
  if (user.isModified("password") && user.password && user.password.trim() !== "") {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  next();
});

export const User = model<IUser, UserModel>("User", UserSchema);
