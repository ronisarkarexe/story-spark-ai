import { Model, Types } from "mongoose";
import { SubscriptionType } from "../../../enums/subscription_type";
export interface IWritingGoals {
  dailyWordCount: number;
  weeklyWordCount: number;
}
export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: string;
  status: string;
  subscriptionType: SubscriptionType;
  postsCount: number;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  profile: {
    avatar: string;
    bio: string;
    social: {
      facebook: string;
      twitter: string;
      linkedin: string;
      instagram: string;
    };
  };
  requestsThisMonth: number;
  lastRequestDate: Date;
  posts: Types.ObjectId[];
  isApplyForWriter: boolean;
  tokenVersion?: number;
  gamification: {
    xp: number;
    level: number;
    streak: number;
    lastActiveDate: Date | null;
    badges: string[];
  };
  writingStreak: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: Date | null;
    totalWritingDays: number;
  };
  readingPreferences?: {
    favoriteGenres: { name: string; count: number }[];
    favoriteEmotions: { name: string; count: number }[];
  };
  readingHistory?: Types.ObjectId[];
  writingGoals: IWritingGoals;
}

export type UserModel = Model<IUser, object>;
