import { Schema, model } from "mongoose";

export interface ITokenBlacklist {
  token: string;
  createdAt?: Date;
}

const tokenBlacklistSchema = new Schema<ITokenBlacklist>(
  {
    token: { type: String, required: true, unique: true, index: true },
    createdAt: { type: Date, default: Date.now, expires: '1d' },
  }
);

export const TokenBlacklist = model<ITokenBlacklist>(
  "TokenBlacklist",
  tokenBlacklistSchema
);

export default TokenBlacklist;
