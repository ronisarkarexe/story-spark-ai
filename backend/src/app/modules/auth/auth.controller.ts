import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthModel } from "./auth.interface";
import { AuthService } from "./auth.service";
import config from "../../../config";
import sendResponse from "../../../shared/send_response";
import { IUser } from "../user/user.interface";
import catchAsync from "../../../shared/catch_async";

const login = catchAsync(async (req: Request, res: Response) => {
  const body: AuthModel = req.body;
  const result = await AuthService.login(body);
  const { accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.env === "production",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User login successfully!",
    data: { accessToken },
  });
});

const register = catchAsync(async (req: Request, res: Response) => {
  const body: IUser = req.body;
  const result = await AuthService.register(body);
  const { accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.env === "production",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Register successfully!",
    data: { accessToken },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const result = await AuthService.refreshToken(token as string);
  const { accessToken } = result;
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Got Access Token!",
    data: { accessToken },
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const result = await AuthService.googleLogin(body);
  const { accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.env === "production",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully with Google!",
    data: { accessToken },
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { oldPassword, newPassword } = req.body;

  await AuthService.changePassword(user, { oldPassword, newPassword });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully. All previous sessions have been invalidated.",
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await AuthService.forgotPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent to your email successfully!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, password, confirmPassword, verificationToken } = req.body;
  const result = await AuthService.resetPassword({
    email,
    password,
    confirmPassword,
    verificationToken,
  });
  const { accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.env === "production",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully!",
    data: { accessToken },
  });
});

export const AuthController = {
  login,
  register,
  refreshToken,
  googleLogin,
  changePassword,
  forgotPassword,
  resetPassword,
};
