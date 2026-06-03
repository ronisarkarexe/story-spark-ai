import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import jwt, { Secret } from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { AuthModel } from "./auth.interface";
import { User } from "../user/user.model";
import { JwtHelpers } from "../../../utils/jwt.helper";
import logger from "../../../utils/logger.util";
import config from "../../../config";
import ApiError from "../../../errors/api_error";
import { IUser } from "../user/user.interface";
import { OTPModel } from "../verify_email/otp.model";
import { RefreshSession } from "./refresh_session.model";
import { VerifyEmailService } from "../verify_email/verify_email.service";
import { GamificationService } from "../gamification/gamification.service";
import { USER_STATUS } from "../../../enums/user_status";
import { SUBSCRIPTION_TYPE } from "../../../enums/subscription_type";
const googleClient = new OAuth2Client(config.google_client_id);

const validateUserStatus = (status?: string) => {
  if (status === USER_STATUS.BLOCKED) {
    throw new ApiError(httpStatus.FORBIDDEN, "Your account has been blocked.");
  }
  if (status === USER_STATUS.INACTIVE) {
    throw new ApiError(httpStatus.FORBIDDEN, "Your account is inactive.");
  }
};

// Token claims; tokenVersion enables global session revocation.
const buildClaims = (user: any) => ({
  _id: user._id,
  email: user.email,
  role: user.role,
  subscriptionType: user.subscriptionType,
  name: user.name,
  postsCount: user.postsCount,
  tokenVersion: user.tokenVersion ?? 0,
});

const issueAccessToken = (user: any, expiresIn?: string): string =>
  JwtHelpers.createToken(
    buildClaims(user),
    config.jwt.secret as Secret,
    expiresIn ?? (config.jwt.expires_in as string)
  );

// Issues a refresh token with a unique jti and records its session for rotation.
const issueRefreshToken = async (user: any): Promise<string> => {
  const jti = crypto.randomBytes(16).toString("hex");
  const token = JwtHelpers.createToken(
    { ...buildClaims(user), jti },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  const decoded = jwt.decode(token) as { exp?: number } | null;
  const expiresAt = decoded?.exp
    ? new Date(decoded.exp * 1000)
    : new Date(Date.now() + 120 * 24 * 60 * 60 * 1000);
  await RefreshSession.create({ jti, userId: user._id, expiresAt });
  return token;
};

const login = async (payload: AuthModel & { rememberMe?: boolean }) => {
  const { email: userEmail, password, rememberMe } = payload;
  const isExistUser = await User.findOne({ email: userEmail });
  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  validateUserStatus(isExistUser.status);

  // Check if user has password (Google users might not)
  if (!isExistUser.password) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please use Google login for this account!");
  }

  const match = await bcrypt.compare(password, isExistUser.password);
  if (!match) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is not valid!");
  }

  const accessToken = issueAccessToken(isExistUser, rememberMe ? "30d" : "15m");
  const refreshToken = await issueRefreshToken(isExistUser);

  GamificationService.updateDailyStreak(String(isExistUser._id)).catch(console.error);

  return {
    accessToken,
    refreshToken,
  };
};

const register = async (payload: IUser & { verificationToken?: string; confirmPassword?: string }) => {
  const { email: userEmail, verificationToken } = payload;
  
  if (!verificationToken) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Email verification required. Please verify your email with OTP before registering."
    );
  }

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

  const accessToken = issueAccessToken(result);
  const refreshToken = await issueRefreshToken(result);

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "No refresh token provided");
  }

  let verifiedToken = null;
  try {
    verifiedToken = JwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token");
  }

  const { email: userEmail } = verifiedToken;
  const jti = (verifiedToken as any).jti as string | undefined;
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

  if (!jti) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }

  const session = await RefreshSession.findOne({ jti });
  if (!session || session.revoked) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired refresh token"
    );
  }

  // Reuse of an already-used token signals theft: revoke the family and bump tokenVersion.
  if (session.used) {
    await RefreshSession.updateMany({ userId: user._id }, { revoked: true });
    await User.updateOne({ _id: user._id }, { $inc: { tokenVersion: 1 } });
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Refresh token reuse detected. Please sign in again."
    );
  }

  // Atomically claim the token so only one concurrent request can rotate it.
  const claimed = await RefreshSession.findOneAndUpdate(
    { jti, used: false, revoked: false },
    { used: true },
    { new: true }
  );
  if (!claimed) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired refresh token"
    );
  }

  const accessToken = issueAccessToken(user);
  const newRefreshToken = await issueRefreshToken(user);
  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const logout = async (token?: string) => {
  if (!token) return;
  try {
    const verified = JwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
    const jti = (verified as any).jti as string | undefined;
    const userId = (verified as any)._id as string | undefined;

    // Revoke the refresh token session.
    if (jti) {
      await RefreshSession.updateOne({ jti }, { revoked: true });
    }

    // Bump tokenVersion so every outstanding access token for this user is
    // immediately rejected by auth.middleware.ts, even before its natural expiry.
    if (userId) {
      await User.updateOne({ _id: userId }, { $inc: { tokenVersion: 1 } });
    }
  } catch (error) {
    // Ignore invalid tokens on logout; the cookie is cleared either way.
  }
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

    if (!payload_data.email_verified) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Google email is not verified");
    }

    const { email, name: googleName, picture } = payload_data;
    let user = await User.findOne({ email });

    if (!user) {
      const newUser: Partial<IUser> = {
        email: email as string,
        name: (googleName || email || "Google User").slice(0, 100),
        status: USER_STATUS.ACTIVE,
        subscriptionType: SUBSCRIPTION_TYPE.FREE,
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

    validateUserStatus(user.status);

    const accessToken = issueAccessToken(user);
    const refreshTokenData = await issueRefreshToken(user);

    GamificationService.updateDailyStreak(String(user._id)).catch(console.error);

    return {
      accessToken,
      refreshToken: refreshTokenData,
    };
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Google login error: ${errorMessage}`);
    
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

  // Same response for real and unknown emails to prevent account enumeration.
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const user = await User.findOne({ email });
  if (user) {
    // Fire and forget so response timing does not vary with account existence.
    VerifyEmailService.VerifyEmail({
      email: user.email,
      name: user.name || "User",
    }).catch((err) => {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(`forgotPassword OTP send failed for ${user.email}: ${message}`);
    });
  }

  return { expiresAt };
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

  // Bump tokenVersion and revoke sessions so the reset invalidates old logins.
  user.password = password;
  user.tokenVersion = (user.tokenVersion ?? 0) + 1;
  await user.save();
  await RefreshSession.updateMany({ userId: user._id }, { revoked: true });

  // Clean up OTP record
  await OTPModel.deleteOne({ email });

  // Generate JWT tokens for auto-login with the new tokenVersion.
  const accessToken = issueAccessToken(user);
  const refreshToken = await issueRefreshToken(user);

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  login,
  register,
  refreshToken,
  logout,
  googleLogin,
  changePassword,
  forgotPassword,
  resetPassword,
};