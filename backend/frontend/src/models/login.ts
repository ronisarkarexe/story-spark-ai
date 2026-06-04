export interface Login {
  email: string;
  password: string;
}

export interface AccessToken {
  accessToken: string;
}

export interface LoginUser {
  exp: number;
  iat: number;
  email: string;
  userId?: string;
  role: string;
  name: string;
  subscriptionType: string;
  postsCount: number;
}
