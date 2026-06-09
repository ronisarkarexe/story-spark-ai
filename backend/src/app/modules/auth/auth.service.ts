import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/api_error";
import config from "../../../config";
import { JwtHelpers } from "../../../utils/jwt.helper";
import { User } from "../user/user.model";
import { AuthModel } from "./auth.interface";
import { OTPModel } from "../verify_email/otp.model";
import { VerifyEmailService } from "../verify_email/verify_email.service";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { SUBSCRIPTION_TYPE } from "../../../enums/subscription_type";

type ResetPasswordPayload = {
  email: string;
  password: string;
  confirmPassword: string;
  verificationToken: string;
};

const buildJwtPayload = (user: any) => ({
  _id: user._id?.toString(),
  email: user.email,
  role: user.role,
  name: user.name || "",
  subscriptionType: user.subscriptionType || SUBSCRIPTION_TYPE.FREE,
  postsCount: user.postsCount || 0,
});

const createTokens = (user: any) => {
  const payload = buildJwtPayload(user);
  const accessToken = JwtHelpers.createToken(
    payload,
    config.jwt.secret,
    config.jwt.expires_in || "1h"
  );
  const refreshToken = JwtHelpers.createToken(
    { ...payload, tokenVersion: user.tokenVersion ?? 0 },
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in || "7d"
  );

  return { accessToken, refreshToken };
};

const login = async (body: AuthModel) => {
  const email = body.email.toLowerCase().trim();
  const user = await User.findOne({ email });

  if (!user || !user.password) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const validPassword = await bcrypt.compare(body.password, user.password);
  if (!validPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  return createTokens(user);
};

const register = async (body: AuthModel) => {
  const email = body.email.toLowerCase().trim();
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "Email already exists");
  }

  const user = await User.create({
    email,
    password: body.password,
    role: ENUM_USER_ROLE.USER,
    name: email.split("@")[0] || "user",
    subscriptionType: SUBSCRIPTION_TYPE.FREE,
  } as any);

  return createTokens(user);
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token is required");
  }

  let decoded: JwtPayload;
  try {
    decoded = JwtHelpers.verifyToken(token, config.jwt.refresh_secret);
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }

  const email = (decoded.email || "").toString();
  const tokenVersion = typeof decoded.tokenVersion === "number" ? decoded.tokenVersion : -1;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }

  if (tokenVersion !== user.tokenVersion) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token is no longer valid");
  }

  return createTokens(user);
};

const logout = async (token?: string) => {
  if (!token) {
    return;
  }

  try {
    const decoded = JwtHelpers.verifyToken(token, config.jwt.refresh_secret) as JwtPayload;
    const email = (decoded.email || "").toString();
    const user = await User.findOne({ email });
    if (!user) {
      return;
    }

    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    await user.save();
  } catch {
    // Ignore invalid logout tokens
  }
};

const googleLogin = async (payload: { email?: string; name?: string }) => {
  const email = payload.email?.toLowerCase().trim();
  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Google login payload must include an email");
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      password: "",
      role: ENUM_USER_ROLE.USER,
      name: payload.name || email.split("@")[0] || "google-user",
      subscriptionType: SUBSCRIPTION_TYPE.FREE,
    } as any);
  }

  return createTokens(user);
};

const changePassword = async (
  user: { email?: string; _id?: string },
  payload: { oldPassword: string; newPassword: string }
) => {
  const existingUser = user.email
    ? await User.findOne({ email: user.email })
    : user._id
    ? await User.findById(user._id)
    : null;

  if (!existingUser || !existingUser.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found or password cannot be changed");
  }

  const validPassword = await bcrypt.compare(payload.oldPassword, existingUser.password);
  if (!validPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
  }

  existingUser.password = payload.newPassword;
  existingUser.tokenVersion = (existingUser.tokenVersion ?? 0) + 1;
  await existingUser.save();
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  await VerifyEmailService.VerifyEmail({
    email: user.email,
    name: user.name || "User",
  });

  return {
    message: "Password reset instructions have been sent to the provided email address.",
  };
};

const resetPassword = async (payload: ResetPasswordPayload) => {
  const { email, password, confirmPassword, verificationToken } = payload;

  if (password.length < 8) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password must be at least 8 characters long");
  }

  if (password !== confirmPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Passwords do not match");
  }

  const verificationRecord = await OTPModel.findOne({ email: email.toLowerCase().trim() });
  if (
    !verificationRecord ||
    !verificationRecord.isVerified ||
    verificationRecord.verificationToken !== verificationToken
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired verification token. Please verify your email again."
    );
  }

  const expiry = verificationRecord.verificationTokenExpires;
  if (!expiry || expiry < new Date()) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Verification token has expired. Please verify your email again."
    );
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  user.password = password;
  user.tokenVersion = (user.tokenVersion ?? 0) + 1;
  await user.save();

  await OTPModel.deleteOne({ email: email.toLowerCase().trim() });

  return createTokens(user);
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
