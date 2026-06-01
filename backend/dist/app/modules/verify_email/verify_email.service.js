"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const config_1 = __importDefault(require("../../../config"));
const http_status_1 = __importDefault(require("http-status"));
const otp_model_1 = require("./otp.model");
const crypto_1 = __importDefault(require("crypto"));
const transporter = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: {
        user: config_1.default.verify_email,
        pass: config_1.default.verify_password,
    },
});
const VerifyEmail = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name } = payload;
        // Use a cryptographically secure RNG so OTPs cannot be predicted.
        const otp = crypto_1.default.randomInt(100000, 1000000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        // Delete any existing OTP for this email
        yield otp_model_1.OTPModel.deleteOne({ email });
        // Create new OTP record in MongoDB
        yield otp_model_1.OTPModel.create({
            email,
            otp,
            expiresAt,
            failedAttempts: 0,
            isVerified: false,
        });
        if (!config_1.default.verify_email || !config_1.default.verify_password) {
            console.log(`[DEVELOPMENT OTP] generated for ${email}: ${otp}`);
            return {
                expiresAt,
            };
        }
        const mailOptions = {
            from: config_1.default.verify_email,
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
                .map((digit, index, arr) => `
                <span style="display: inline-block; width: 40px; height: 40px; font-size: 24px; font-weight: bold; color: #007bff; border: 2px solid #007bff; border-radius: 5px; line-height: 40px; text-align: center; ${index !== arr.length - 1 ? "margin-right: 10px;" : ""}">
                ${digit}
                </span>
            `)
                .join("")}
            </div>
          <p style="color: #666;">This code will only be valid for the next 10 minutes. If the code does not work, please request a new one and ensure you enter it correctly.</p>
          <p style="margin-top: 20px; color: #666;">Thanks,<br>Story Spark AI Team</p>
        </main>
        <footer style="margin-top: 20px; font-size: 12px; color: #aaa;">
          <p>This email was sent from ${config_1.default.verify_email} for your one-time OTP verification.</p>
          <p>&copy; ${new Date().getFullYear()} Story Spark Ai. All Rights Reserved.</p>
        </footer>
      </section>
      </body>
      </html>
      `,
        };
        yield transporter.sendMail(mailOptions);
        return {
            expiresAt,
        };
    }
    catch (error) {
        if (error instanceof api_error_1.default) {
            throw error;
        }
        console.error("Mail Error:", error);
        throw new api_error_1.default(500, "Failed to send email");
    }
});
const VerifyOtp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = payload;
    // FIX #3: Input validation - check if otp is a non-empty string before calling .trim()
    if (typeof otp !== "string" || !otp) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "OTP must be a non-empty string");
    }
    const storedOtpRecord = yield otp_model_1.OTPModel.findOne({ email });
    if (!storedOtpRecord) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "OTP not found or expired. Please request a new one.");
    }
    // Check if OTP has expired
    if (new Date() > storedOtpRecord.expiresAt) {
        yield otp_model_1.OTPModel.deleteOne({ email });
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "OTP expired. Please request a new one.");
    }
    // FIX #2: Rate limiting - max 5 failed attempts
    if (storedOtpRecord.failedAttempts >= 5) {
        yield otp_model_1.OTPModel.deleteOne({ email });
        throw new api_error_1.default(http_status_1.default.TOO_MANY_REQUESTS, "Too many failed attempts. Please request a new OTP.");
    }
    // Verify OTP
    if (storedOtpRecord.otp !== otp.trim()) {
        // Increment failed attempts
        storedOtpRecord.failedAttempts += 1;
        yield storedOtpRecord.save();
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, `Invalid OTP. Please try again. (${5 - storedOtpRecord.failedAttempts} attempts remaining)`);
    }
    // FIX #4: Create verification token instead of returning only { verified: true }
    // This token binds the verification to a specific email and must be used in registration
    const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity
    storedOtpRecord.isVerified = true;
    storedOtpRecord.verificationToken = verificationToken;
    storedOtpRecord.verificationTokenExpires = verificationTokenExpires;
    yield storedOtpRecord.save();
    return {
        verified: true,
        verificationToken, // Client must include this in registration request
        expiresIn: 15 * 60, // 15 minutes in seconds
    };
});
exports.VerifyEmailService = {
    VerifyEmail,
    VerifyOtp,
};
