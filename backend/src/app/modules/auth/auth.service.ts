import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { AuthModel } from "./auth.interface";
import { User } from "../user/user.model";
import { JwtHalers } from "../../../utils/jwt.helper";
import logger from "../../../utils/logger.util";
import config from "../../../config";
import ApiError from "../../../errors/api_error";
import { IUser } from "../user/user.interface";
import { OTPModel } from "../verify_email/otp.model";
import { VerifyEmailService } from "../verify_email/verify_email.service";
import { GamificationService } from "../gamification/gamification.service";

const googleClient = new OAuth2Client(config.google_client_id);

const login = async (payload: AuthModel) => {
  const { email: userEmail, password } = payload;
  const isExistUser = await User.findOne({ email: userEmail });
  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }
  
  // Check if user has password (Google users might not)
  if (!isExistUser.password) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please use Google login for this account!");
  }
  
  const match = await bcrypt.compare(password, isExistUser.password);
  if (!match) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is not valid!");
  }
  const { _id, email, role, subscriptionType, name, postsCount, tokenVersion } =
    isExistUser;
  const accessToken = JwtHalers.createToken(
    { _id, email, role, subscriptionType, name, postsCount, tokenVersion },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = JwtHalers.createToken(
    { _id, email, role, subscriptionType, name, postsCount, tokenVersion },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  GamificationService.updateDailyStreak(String(_id)).catch(console.error);

  return {
    accessToken,
    refreshToken,
  };
};

const register = async (payload: IUser & { verificationToken?: string; confirmPassword?: string }) => {
  const { email: userEmail, verificationToken } = payload;
  
  // FIX #4: Verify that email was verified via OTP before allowing registration
  if (!verificationToken) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Email verification required. Please verify your email with OTP before registering."
    );
  }

  // Check if verification token is valid
  const otpRecord = await OTPModel.findOne({
    email: userEmail,
    isVerified: true,
    verificationToken,
  });

  if (!otpRecord) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired verification token. Please verify your email again."
    );
  }

  // Check if verification token has expired
  if (
    !otpRecord.verificationTokenExpires ||
    new Date() > otpRecord.verificationTokenExpires
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Verification token has expired. Please verify your email again."
    );
  }

  const isExistUser = await User.findOne({ email: userEmail });
  if (isExistUser) {
    throw new ApiError(httpStatus.CONFLICT, "User already exists!");
  }
  
  const { verificationToken: _, ...userPayload } = payload;
  const result = await User.create(userPayload);
  
  // Clean up OTP record after successful registration
  await OTPModel.deleteOne({ email: userEmail });
  
  const { _id, email, role, subscriptionType, name, postsCount, tokenVersion } =
    result;
  const accessToken = JwtHalers.createToken(
    { _id, email, role, subscriptionType, name, postsCount, tokenVersion },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = JwtHalers.createToken(
    { _id, email, role, subscriptionType, name, postsCount, tokenVersion },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = JwtHalers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token");
  }

  const { email: userEmail } = verifiedToken;
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (user.tokenVersion !== (verifiedToken as any).tokenVersion) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired refresh token"
    );
  }

  const { _id, email, role, subscriptionType, name, postsCount, tokenVersion } =
    user;
  const newAccessToken = JwtHalers.createToken(
    { _id, email, role, subscriptionType, name, postsCount, tokenVersion },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  return {
    accessToken: newAccessToken,
  };
};

const googleLogin = async (payload: { token: string }) => {
  try {
    if (!config.google_client_id) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Google OAuth not configured"
      );
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: payload.token,
      audience: config.google_client_id,
    });

    const payload_data = ticket.getPayload();
    if (!payload_data || !payload_data.email) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Google token");
    }

    const { email, name: googleName, picture } = payload_data;
    let user = await User.findOne({ email });

    // If user doesn't exist, create a new user
    if (!user) {
      const newUser: Partial<IUser> = {
        email: email as string,
        name: (googleName || email || "Google User").slice(0, 100),
        profile: {
          avatar: (picture as string) || "",
          bio: "",
          social: {
            facebook: "",
            twitter: "",
            linkedin: "",
            instagram: "",
          },
        },
      };

      user = await User.create(newUser);
    }

    const { _id, role, subscriptionType, postsCount, name, tokenVersion } =
      user;
    const accessToken = JwtHalers.createToken(
      { _id, email, role, subscriptionType, name, postsCount, tokenVersion },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
    const refreshTokenData = JwtHalers.createToken(
      { _id, email, role, subscriptionType, name, postsCount, tokenVersion },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string
    );

    GamificationService.updateDailyStreak(String(_id)).catch(console.error);

    return {
      accessToken,
      refreshToken: refreshTokenData,
    };
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Google login error: ${errorMessage}`);
    
    // If it's already an ApiError, re-throw it
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      error.message || "Google login failed"
    );
  }
};

const changePassword = async (userPayload: any, payload: any) => {
  const { oldPassword, newPassword } = payload;
  const user = await User.findById(userPayload._id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User does not have a password set"
    );
  }

  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
  }

  user.password = newPassword;

  if (user.tokenVersion !== undefined) {
    user.tokenVersion += 1;
  } else {
    user.tokenVersion = 1;
  }

  await user.save();
};

const forgotPassword = async (email: string) => {
  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is required!");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }
  
  // Send OTP using VerifyEmailService
  const result = await VerifyEmailService.VerifyEmail({
    email: user.email,
    name: user.name || "User",
  });
  
  return result;
};

const resetPassword = async (payload: {
  email: string;
  password: string;
  confirmPassword: string;
  verificationToken: string;
}) => {
  const { email, password, confirmPassword, verificationToken } = payload;
  if (!email || !password || !confirmPassword || !verificationToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, "All fields are required!");
  }
  if (password !== confirmPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Passwords do not match!");
  }
  
  // Validate password strength using Zod schema's rules manually to return user-friendly errors
  const getPasswordError = (pwd: string) => {
    if (pwd.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
    if (!/[^A-Za-z0-9]/.test(pwd)) return "Password must contain at least one special character";
    return "";
  };
  const passwordError = getPasswordError(password);
  if (passwordError) {
    throw new ApiError(httpStatus.BAD_REQUEST, passwordError);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Verify token against OTPModel
  const otpRecord = await OTPModel.findOne({
    email,
    isVerified: true,
    verificationToken,
  });

  if (!otpRecord) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired verification token. Please verify your email again."
    );
  }

  if (
    !otpRecord.verificationTokenExpires ||
    new Date() > otpRecord.verificationTokenExpires
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Verification token has expired. Please verify your email again."
    );
  }

  // Update user password. Pre-save hook hashes it.
  user.password = password;
  await user.save();

  // Clean up OTP record
  await OTPModel.deleteOne({ email });

  // Generate JWT tokens for auto-login
  const { _id, role, subscriptionType, name, postsCount } = user;
  const accessToken = JwtHalers.createToken(
    { _id, email: user.email, role, subscriptionType, name, postsCount },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = JwtHalers.createToken(
    { _id, email: user.email, role, subscriptionType, name, postsCount },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  login,
  register,
  refreshToken,
  googleLogin,
  changePassword,
  forgotPassword,
  resetPassword,
};
