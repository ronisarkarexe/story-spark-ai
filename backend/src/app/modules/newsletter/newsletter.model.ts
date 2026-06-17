import mongoose, { Schema, Types } from "mongoose";

export type NewsletterStatus = "pending" | "active" | "unsubscribed";

export interface INewsletterSubscriber {
  email: string;
  name?: string;
  userId?: Types.ObjectId;
  status: NewsletterStatus;
  source?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  unsubscribeToken?: string;
  subscribedAt?: Date;
  unsubscribedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "active", "unsubscribed"],
      default: "pending",
    },
    source: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    unsubscribeToken: {
      type: String,
      index: true,
    },
    subscribedAt: {
      type: Date,
    },
    unsubscribedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Safe registration — prevents "Cannot overwrite model" error on hot reload
const NewsletterSubscriber =
  (mongoose.models.NewsletterSubscriber as mongoose.Model<INewsletterSubscriber>) ||
  mongoose.model<INewsletterSubscriber>("NewsletterSubscriber", NewsletterSubscriberSchema);

export { NewsletterSubscriber };