import crypto from "crypto";
import { NewsletterSubscriber } from "./newsletter.model";
import { sendVerificationEmail } from "../../../utils/email.util";

// Builds the absolute link that the recipient clicks to unsubscribe. The token
// is delivered only in the email, so it cannot be guessed or enumerated.
const buildUnsubscribeUrl = (baseUrl: string | undefined, token: string) =>
  baseUrl ? `${baseUrl}/api/v1/newsletter/unsubscribe/${token}` : undefined;

export const subscribeNewsletter = async (
  email: string,
  name?: string,
  source?: string,
  userId?: string,
  baseUrl?: string
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
      if (!existing.unsubscribeToken) {
        existing.unsubscribeToken = crypto.randomBytes(32).toString("hex");
      }
      await existing.save();

      await sendVerificationEmail(
        normalizedEmail,
        existing.verificationToken,
        buildUnsubscribeUrl(baseUrl, existing.unsubscribeToken)
      );

      return { message: "Re-subscribed. Please verify your email.", subscriber: existing };
    }
  }

  // New subscriber
  const token = crypto.randomBytes(32).toString("hex");
  const unsubscribeToken = crypto.randomBytes(32).toString("hex");
  const subscriber = await NewsletterSubscriber.create({
    email: normalizedEmail,
    name,
    source,
    userId,
    status: "pending",
    isVerified: false,
    verificationToken: token,
    verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    unsubscribeToken,
  });

  await sendVerificationEmail(
    normalizedEmail,
    token,
    buildUnsubscribeUrl(baseUrl, unsubscribeToken)
  );

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

export const unsubscribeByToken = async (token: string) => {
  const subscriber = await NewsletterSubscriber.findOne({
    unsubscribeToken: token,
  });
  if (!subscriber) throw new Error("Invalid unsubscribe token.");
  if (subscriber.status !== "unsubscribed") {
    subscriber.status = "unsubscribed";
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();
  }
  return { message: "Unsubscribed successfully." };
};