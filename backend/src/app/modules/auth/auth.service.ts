import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { User } from "../user/user.model";
import { AuthModel } from "./auth.interface";
import { IUser } from "../user/user.interface";
import jwt from "jsonwebtoken";
import config from "../../../config";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Forcing signature to accept string | undefined safely with internal casting
const createToken = (
  payload: Record<string, unknown>,
  secret: string | undefined,
  expireTime: string | number | undefined
): string => {
  return jwt.sign(payload, (secret || "") as string, { expiresIn: (expireTime || "1d") as any });
};

const login = async (payload: AuthModel) => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password || "");
  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password incorrect");
  }

  const jwtPayload = { userId: user._id, email: user.email, role: user.role };
  
  const accessToken = createToken(
    jwtPayload,
    config.jwt.secret,
    config.jwt.expires_in
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in
  );

  return {
    accessToken,
    refreshToken,
  };
};

const register = async (payload: IUser) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exists with this email");
  }

  const newUser = await User.create(payload);
  const jwtPayload = { userId: newUser._id, email: newUser.email, role: newUser.role };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.secret,
    config.jwt.expires_in
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  let verifiedToken = null;
  try {
    const secret = (config.jwt.refresh_secret || "") as string;
    verifiedToken = jwt.verify(token, secret) as any;
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid Refresh Token");
  }

  const { email } = verifiedToken;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist anymore");
  }

  const jwtPayload = { userId: user._id, email: user.email, role: user.role };
  const accessToken = createToken(jwtPayload, config.jwt.secret, config.jwt.expires_in);
  const rotatedRefreshToken = createToken(jwtPayload, config.jwt.refresh_secret, config.jwt.refresh_expires_in);

  return {
    accessToken,
    refreshToken: rotatedRefreshToken,
  };
};

const logout = async (refreshToken: string) => {
  return { success: true };
};

const googleLogin = async (payload: any) => {
  const { email, name, avatar } = payload;
  let user = await User.findOne({ email });

  if (!user) {
    const generatedPassword = crypto.randomBytes(16).toString("hex");
    user = await User.create({
      email,
      name,
      avatar,
      password: generatedPassword,
      role: "user",
    });
  }

  const jwtPayload = { userId: user._id, email: user.email, role: user.role };
  const accessToken = createToken(jwtPayload, config.jwt.secret, config.jwt.expires_in);
  const refreshToken = createToken(jwtPayload, config.jwt.refresh_secret, config.jwt.refresh_expires_in);

  return { accessToken, refreshToken };
};

const changePassword = async (userPayload: any, data: any) => {
  const { oldPassword, newPassword } = data;
  const user = await User.findById(userPayload?.userId).select("+password");
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordMatched = await bcrypt.compare(oldPassword, user.password || "");
  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Current password does not match");
  }

  const saltRounds = config.bcrypt_salt_rounds ? Number(config.bcrypt_salt_rounds) : 10;
  (user as any).password = await bcrypt.hash(newPassword, saltRounds);
  await user.save();
  return null;
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { status: "notified" };
  }
  return { status: "success" };
};

const resetPassword = async (data: any) => {
  const { email, password } = data;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const saltRounds = config.bcrypt_salt_rounds ? Number(config.bcrypt_salt_rounds) : 10;
  (user as any).password = await bcrypt.hash(password, saltRounds);
  await user.save();

  const jwtPayload = { userId: user._id, email: user.email, role: user.role };
  const accessToken = createToken(jwtPayload, config.jwt.secret, config.jwt.expires_in);
  const refreshToken = createToken(jwtPayload, config.jwt.refresh_secret, config.jwt.refresh_expires_in);

  return { accessToken, refreshToken };
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