import { Schema, model, Types } from "mongoose";

// One record per issued refresh token. Rotation marks the old record used and
// creates a new one, so a refresh token presented after it was rotated (used)
// signals theft and triggers revocation of the whole family.
export interface IRefreshSession {
  jti: string;
  userId: Types.ObjectId;
  used: boolean;
  revoked: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const refreshSessionSchema = new Schema<IRefreshSession>(
  {
    jti: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    used: { type: Boolean, default: false },
    revoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// TTL index: Mongo removes a session once it expires, so used and revoked
// records are cleaned up automatically.
refreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshSession = model<IRefreshSession>(
  "RefreshSession",
  refreshSessionSchema
);
