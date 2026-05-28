import nodemailer from "nodemailer";
import { IEmailBody } from "./verify_email.interface";
import { IVerifyOtpBody } from "./verify_email.interface";
import ApiError from "../../../errors/api_error";
import config from "../../../config";
import httpStatus from "http-status";
import { OTPModel } from "./otp.model";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.verify_email,
    pass: config.verify_password,
  },
});

const VerifyEmail = async (payload: IEmailBody) => {
  try {
    const { email, name } = payload;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    // Delete any existing OTP for this email
    await OTPModel.deleteOne({ email });
    
    // Create new OTP record in MongoDB
    await OTPModel.create({
      email,
      otp,
      expiresAt,
      failedAttempts: 0,
      isVerified: false,
    });
    
    const mailOptions = {
      from: config.verify_email,
      to: email,
      subject: "OTP Verify Email Address",
      html: `
        <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="background-color: #f9f9f9; font-family: Arial, sans-serif; padding: 20px; text-align: start;">
      <section style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
        <header>
          <a href="/">
            <h1 style="font-size: 22px;">Story Spark AI</h1>
          </a>
        </header>
        <main style="margin-top: 20px;">
          <h2 style="color: #333;">Hi ${name},</h2>
          <p style="color: #666;">This is your verification code:</p>
          <div style="display: flex; justify-content: center; margin: 20px 0;">
            ${otp
              .split("")
              .map(
                (digit, index, arr) => `
                <span style="display: inline-block; width: 40px; height: 40px; font-size: 24px; font-weight: bold; color: #007bff; border: 2px solid #007bff; border-radius: 5px; line-height: 40px; text-align: center; ${
                  index !== arr.length - 1 ? "margin-right: 10px;" : ""
                }">
                ${digit}
                </span>
            `
              )
              .join("")}
            </div>
          <p style="color: #666;">This code will only be valid for the next 10 minutes. If the code does not work, please request a new one and ensure you enter it correctly.</p>
          <p style="margin-top: 20px; color: #666;">Thanks,<br>Story Spark AI Team</p>
        </main>
        <footer style="margin-top: 20px; font-size: 12px; color: #aaa;">
          <p>This email was sent from ${
            config.verify_email
          } for your one-time OTP verification.</p>
          <p>&copy; ${new Date().getFullYear()} Story Spark Ai. All Rights Reserved.</p>
        </footer>
      </section>
      </body>
      </html>
      `,
    };
    
    if (!config.verify_email || !config.verify_password) {
      console.log(`\n=========================================\n[DEV MODE] OTP for ${email} is: ${otp}\n=========================================\n`);
    } else {
      await transporter.sendMail(mailOptions);
    }

    return {
      expiresAt,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to send email");
  }
};

const VerifyOtp = async (payload: IVerifyOtpBody) => {
  const { email, otp } = payload;
  
  // FIX #3: Input validation - check if otp is a non-empty string before calling .trim()
  if (typeof otp !== "string" || !otp) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "OTP must be a non-empty string"
    );
  }
  
  const storedOtpRecord = await OTPModel.findOne({ email });

  if (!storedOtpRecord) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "OTP not found or expired. Please request a new one."
    );
  }

  // Check if OTP has expired
  if (new Date() > storedOtpRecord.expiresAt) {
    await OTPModel.deleteOne({ email });
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "OTP expired. Please request a new one."
    );
  }

  // FIX #2: Rate limiting - max 5 failed attempts
  if (storedOtpRecord.failedAttempts >= 5) {
    await OTPModel.deleteOne({ email });
    throw new ApiError(
      httpStatus.TOO_MANY_REQUESTS,
      "Too many failed attempts. Please request a new OTP."
    );
  }

  // Verify OTP
  if (storedOtpRecord.otp !== otp.trim()) {
    // Increment failed attempts
    storedOtpRecord.failedAttempts += 1;
    await storedOtpRecord.save();
    
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid OTP. Please try again. (${5 - storedOtpRecord.failedAttempts} attempts remaining)`
    );
  }

  // FIX #4: Create verification token instead of returning only { verified: true }
  // This token binds the verification to a specific email and must be used in registration
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity
  
  storedOtpRecord.isVerified = true;
  storedOtpRecord.verificationToken = verificationToken;
  storedOtpRecord.verificationTokenExpires = verificationTokenExpires;
  await storedOtpRecord.save();

  return { 
    verified: true,
    verificationToken, // Client must include this in registration request
    expiresIn: 15 * 60, // 15 minutes in seconds
  };
};

export const VerifyEmailService = {
  VerifyEmail,
  VerifyOtp,
};
