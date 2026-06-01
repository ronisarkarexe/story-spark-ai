export interface ITokenPayload {
  _id: string;
  email: string;
  userId?: string;
  role: string;
  name: string;
  subscriptionType: string;
  postsCount: number;
}
