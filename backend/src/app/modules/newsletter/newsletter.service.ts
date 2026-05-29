import crypto from "crypto";
import { NewsletterSubscriber } from "./newsletter.model";
import { sendVerificationEmail } from "../../../utils/email.util";

export const subscribeNewsletter = async (
  email: string,
  name?: string,
  source?: string,
  userId?: string
) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await NewsletterSubscriber.findOne({ email: normalizedEmail });

  if (existing) {
    if (existing.status === "active") {
      return { message: "Already subscribed", subscriber: existing };
    }
    if (existing.status === "unsubscribed") {
      existing.status = "pending";
      existing.unsubscribedAt = undefined;
      existing.verificationToken = crypto.randomBytes(32).toString("hex");
      existing.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await existing.save();

      // Send verification email
      await sendVerificationEmail(normalizedEmail, existing.verificationToken);

      return { message: "Re-subscribed. Please verify your email.", subscriber: existing };
    }
  }

  // New subscriber
  const token = crypto.randomBytes(32).toString("hex");
  const subscriber = await NewsletterSubscriber.create({
    email: normalizedEmail,
    name,
    source,
    userId,
    status: "pending",
    isVerified: false,
    verificationToken: token,
    verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  // Send verification email
  await sendVerificationEmail(normalizedEmail, token);

  return { message: "Subscribed! Please verify your email.", subscriber };
};

export const verifyNewsletter = async (token: string) => {
  const subscriber = await NewsletterSubscriber.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: new Date() },
  });

  if (!subscriber) throw new Error("Invalid or expired verification token.");

  subscriber.status = "active";
  subscriber.isVerified = true;
  subscriber.subscribedAt = new Date();
  subscriber.verificationToken = undefined;
  subscriber.verificationTokenExpires = undefined;
  await subscriber.save();

  return { message: "Email verified successfully.", subscriber };
};

export const generateUnsubscribeToken = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const subscriber = await NewsletterSubscriber.findOne({ email: normalizedEmail });
  if (!subscriber) throw new Error("Subscriber not found.");
  if (subscriber.status === "unsubscribed") {
    return { message: "Already unsubscribed." };
  }
  const token = crypto.randomBytes(32).toString("hex");
  subscriber.verificationToken = token;
  subscriber.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await subscriber.save();
  return { token };
};

export const unsubscribeNewsletter = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const subscriber = await NewsletterSubscriber.findOne({ email: normalizedEmail });

  if (!subscriber) throw new Error("Subscriber not found.");

  subscriber.status = "unsubscribed";
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();

  return { message: "Unsubscribed successfully." };
};

export const unsubscribeByToken = async (token: string) => {
  const subscriber = await NewsletterSubscriber.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: new Date() },
  });
  if (!subscriber) throw new Error("Invalid or expired unsubscribe token.");
  subscriber.status = "unsubscribed";
  subscriber.unsubscribedAt = new Date();
  subscriber.verificationToken = undefined;
  subscriber.verificationTokenExpires = undefined;
  await subscriber.save();
  return { message: "Unsubscribed successfully." };
};