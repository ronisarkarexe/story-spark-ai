import { Schema, model } from "mongoose";

export interface ITokenBlacklist {
  token: string;
  createdAt?: Date;
}

const tokenBlacklistSchema = new Schema<ITokenBlacklist>(
  {
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
  }
);

// Index for O(1) token lookup on every authenticated request
tokenBlacklistSchema.index({ token: 1 }, { unique: true });

// TTL index — automatically removes blacklisted tokens after 7 days
tokenBlacklistSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 86400 * 7 }
);

export const TokenBlacklist = model<ITokenBlacklist>(
  "TokenBlacklist",
  tokenBlacklistSchema
);

export default TokenBlacklist;
