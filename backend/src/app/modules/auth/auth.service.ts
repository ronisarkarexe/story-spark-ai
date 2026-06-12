import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { v4 as uuidv4 } from "uuid";
import { OAuth2Client } from "google-auth-library";
import { User } from "../user/user.model";
import { RefreshSession } from "./refresh_session.model";
import { OTPModel } from "../verify_email/otp.model";
import { JwtHelpers } from "../../../utils/jwt.helper";
import ApiError from "../../../errors/api_error";
import config from "../../../config";
import { AuthModel } from "./auth.interface";
import { IUser } from "../user/user.interface";
import { sendVerificationEmail } from "../../../utils/email.util";

const googleClient = new OAuth2Client(config.google_client_id);

// ─── Token Helpers ────────────────────────────────────────────────────────────

const generateTokens = async (user: any) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
    postsCount: user.postsCount,
    subscriptionType: user.subscriptionType,
    avatar: user.profile?.avatar || "",
  };

  const accessToken = JwtHelpers.createToken(
    payload,
    config.jwt.secret,
    config.jwt.expires_in || "15m"
  );

  const jti = uuidv4();
  const refreshExpiresMs = 7 * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + refreshExpiresMs);

  const refreshToken = JwtHelpers.createToken(
    { userId: user._id, jti },
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in || "7d"
  );

  await RefreshSession.create({
    jti,
    userId: user._id,
    used: false,
    revoked: false,
    expiresAt,
  });

  return { accessToken, refreshToken };
};

// ─── Login ────────────────────────────────────────────────────────────────────

const login = async (payload: AuthModel) => {
  const { email, password } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password.");
  }

  if (!user.password) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "This account uses Google login. Please sign in with Google."
    );
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password.");
  }

  if (user.status === "blocked") {
    throw new ApiError(httpStatus.FORBIDDEN, "Your account has been blocked.");
  }

  return generateTokens(user);
};

// ─── Register ─────────────────────────────────────────────────────────────────

const register = async (payload: IUser) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "Email is already registered.");
  }

  const user = await User.create(payload);
  return generateTokens(user);
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

const refreshToken = async (token: string) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token is required.");
  }

  let decoded: any;
  try {
    decoded = JwtHelpers.verifyToken(token, config.jwt.refresh_secret);
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired refresh token.");
  }

  const session = await RefreshSession.findOne({ jti: decoded.jti });
  if (!session || session.revoked) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Session has been revoked.");
  }

  if (session.used) {
    await RefreshSession.updateMany(
      { userId: session.userId },
      { revoked: true }
    );
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Token reuse detected. All sessions revoked."
    );
  }

  session.used = true;
  await session.save();

  const user = await User.findById(session.userId);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not found.");
  }

  return generateTokens(user);
};

// ─── Logout ───────────────────────────────────────────────────────────────────

const logout = async (token: string) => {
  if (!token) return;

  try {
    const decoded: any = JwtHelpers.verifyToken(token, config.jwt.refresh_secret);
    await RefreshSession.updateOne({ jti: decoded.jti }, { revoked: true });
  } catch {
    // Token already invalid — nothing to revoke
  }
};

// ─── Google Login ─────────────────────────────────────────────────────────────

const googleLogin = async (payload: { token: string }) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: payload.token,
    audience: config.google_client_id as string,
  });

  const googlePayload = ticket.getPayload();
  if (!googlePayload || !googlePayload.email) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Google token.");
  }

  const { email, name, picture } = googlePayload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      name: name || email.split("@")[0],
      role: "user",
      status: "active",
      subscriptionType: "free",
      postsCount: 0,
      followers: [],
      following: [],
      posts: [],
      isApplyForWriter: false,
      profile: {
        avatar: picture || "",
        bio: "",
        social: {
          facebook: "",
          twitter: "",
          linkedin: "",
          instagram: "",
          github: "",
          discord: "",
        },
      },
      writingGoals: { dailyWordCount: 0, weeklyWordCount: 0 },
    });
  }

  return generateTokens(user);
};

// ─── Change Password ──────────────────────────────────────────────────────────

const changePassword = async (
  authUser: any,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await User.findById(authUser.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (!user.password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password change is not available for Google accounts."
    );
  }

  const isMatch = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Old password is incorrect.");
  }

  user.password = payload.newPassword;
  await user.save();

  await RefreshSession.updateMany({ userId: user._id }, { revoked: true });
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) return null;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await OTPModel.findOneAndDelete({ email });
  await OTPModel.create({ email, otp, expiresAt });

  await sendVerificationEmail(email, otp);

  return null;
};

// ─── Reset Password ───────────────────────────────────────────────────────────

const resetPassword = async (payload: {
  email: string;
  password: string;
  confirmPassword: string;
  verificationToken: string;
}) => {
  const { email, password, confirmPassword, verificationToken } = payload;

  if (password !== confirmPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Passwords do not match.");
  }

  const otpRecord = await OTPModel.findOne({ email });
  if (!otpRecord) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP record not found.");
  }

  if (
    !otpRecord.verificationToken ||
    otpRecord.verificationToken !== verificationToken ||
    !otpRecord.isVerified
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired verification token."
    );
  }

  if (
    otpRecord.verificationTokenExpires &&
    otpRecord.verificationTokenExpires < new Date()
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Verification token has expired."
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  user.password = password;
  await user.save();

  await OTPModel.findOneAndDelete({ email });
  await RefreshSession.updateMany({ userId: user._id }, { revoked: true });

  return generateTokens(user);
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