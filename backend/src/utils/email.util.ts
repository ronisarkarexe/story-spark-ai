import nodemailer from "nodemailer";
import config from "../config";

export const sendVerificationEmail = async (to: string, token: string) => {
  if (!config.verify_email || !config.verify_password) {
    console.warn("Email configuration missing. Verification email not sent.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.verify_email,
      pass: config.verify_password,
    },
  });

  const frontendUrl = config.cors_origins?.[0] || "http://localhost:4001";
  const verifyLink = `${frontendUrl}/verify-newsletter?token=${token}`;

  const mailOptions = {
    from: `"Story Spark AI" <${config.verify_email}>`,
    to,
    subject: "Verify your Newsletter Subscription",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Welcome to the Story Spark AI Newsletter!</h2>
        <p>Thank you for subscribing. Please verify your email address to confirm your subscription by clicking the button below:</p>
        <p style="margin: 30px 0;">
          <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
        </p>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p><a href="${verifyLink}" style="color: #6366f1;">${verifyLink}</a></p>
        <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
        <p style="color: #888; font-size: 12px;">Best regards,<br/>The Story Spark AI Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error);
    // Don't throw an error here, so we don't break the subscription flow if email fails.
    // The user record will still be created and they can request another verification if needed.
  }
};

export const sendContactEmail = async (data: {
  fullname?: string;
  email?: string;
  feedbackType: "bug-report" | "feature-request" | "general-feedback";
  subject: string;
  message: string;
}) => {
  if (!config.verify_email || !config.verify_password) {
    console.warn("Email configuration missing. Contact email not sent.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.verify_email,
      pass: config.verify_password,
    },
  });

  const feedbackTypeLabel =
    data.feedbackType === "bug-report"
      ? "Bug report"
      : data.feedbackType === "feature-request"
        ? "Feature request"
        : "General feedback";

  const displayName = data.fullname?.trim() || "Anonymous user";
  const displayEmail = data.email?.trim() || "Not provided";

  const mailOptions = {
    from: `"Story Spark AI Support" <${config.verify_email}>`,
    replyTo: data.email?.trim() || undefined,
    to: config.verify_email,
    subject: `Support Form [${feedbackTypeLabel}]: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>New Support / Feedback Submission</h2>
        <p><strong>Type:</strong> ${feedbackTypeLabel}</p>
        <p><strong>Name:</strong> ${displayName}</p>
        <p><strong>Email:</strong> ${displayEmail}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${data.message}</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="color: #888; font-size: 12px;">This email was sent from the Story Spark AI support form.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending contact email:", error);
    throw new Error("Failed to send email. Please try again later.");
  }
};
