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

export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  role: string;
  status: string;
  subscriptionType: string;
  postsCount: number;

  followers: {
    _id: string;
    username: string;
    profilePicture: string;
  }[];

  following: {
    _id: string;
    username: string;
    profilePicture: string;
  }[];
  requestsThisMonth: number;
  lastRequestDate: string | null;
  posts: string[];
  isApplyForWriter: boolean;

  createdAt: string;
  updatedAt: string;
  profile: UserProfile;

  writingGoals?: {
    dailyWordCount: number;
    weeklyWordCount: number;
  };
}
