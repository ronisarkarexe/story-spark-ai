export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
  discord?: string;
}

export interface UserProfile {
  social: SocialLinks;
  avatar?: string;
  bio?: string;
}

export interface WritingGoals {
  dailyWordCount: number;
  weeklyWordCount: number;
}

export interface UserConnection {
  _id: string;
  username: string;
  profilePicture: string;
}

export type UserRole = "user" | "writer" | "admin";

export type UserStatus = "active" | "inactive" | "banned";

export type SubscriptionType = "free" | "premium" | "pro";

export interface User {
  _id: string;
  email: string;
  name: string;

  role: UserRole;
  status: UserStatus;
  subscriptionType: SubscriptionType;

  postsCount: number;

  followers: UserConnection[];
  following: UserConnection[];

  requestsThisMonth: number;
  lastRequestDate: string | null;

  posts: string[];

  hasAppliedForWriter: boolean;

  createdAt: string;
  updatedAt: string;

  profile: UserProfile;

  writingGoals?: WritingGoals;
}
