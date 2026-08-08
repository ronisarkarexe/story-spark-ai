import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  failedAttempts: number;
  isVerified: boolean;
  verificationToken: string | null;
  verificationTokenExpires: Date | null;
}

const otpSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // TTL deletes the whole document. After OTP verify, service extends this
      // to verificationTokenExpires so register/reset still finds the token.
      index: { expireAfterSeconds: 0 },
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate OTPs for same email
otpSchema.index({ email: 1, expiresAt: 1 });

export const OTPModel = mongoose.model<IOTP>("OTP", otpSchema);
