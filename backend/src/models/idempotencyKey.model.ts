// backend/src/models/idempotencyKey.model.ts
import mongoose, { Schema, Document } from "mongoose";

export type IdempotencyStatus = "in_progress" | "completed";

export interface IIdempotencyKey extends Document {
  key: string;            // `${userId}:${Idempotency-Key header}`
  status: IdempotencyStatus;
  statusCode?: number;
  responseBody?: string;  // JSON.stringify(response) once completed
  createdAt: Date;
}

const IdempotencyKeySchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
    statusCode: { type: Number },
    responseBody: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

// Auto-expire after 24h so a stuck/abandoned key doesn't block retries forever
IdempotencyKeySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

export const IdempotencyKey = mongoose.model<IIdempotencyKey>(
  "IdempotencyKey",
  IdempotencyKeySchema
);