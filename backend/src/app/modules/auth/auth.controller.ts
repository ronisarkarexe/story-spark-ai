import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthModel } from "./auth.interface";
import { AuthService } from "./auth.service";
import sendResponse from "../../../shared/send_response";
import { IUser } from "../user/user.interface";
import catchAsync from "../../../shared/catch_async";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "../../../utils/cookie.util";
import jwt from "jsonwebtoken";
import { TokenBlacklist } from "./tokenBlacklist.model";

const login = catchAsync(async (req: Request, res: Response) => {
  const body: AuthModel = req.body;
  const result = await AuthService.login(body);
  const { accessToken, refreshToken } = result;

  setRefreshTokenCookie(res, refreshToken);

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

  setRefreshTokenCookie(res, refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Register successfully!",
    data: { accessToken },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  const result = await AuthService.refreshToken(token as string);
  const { accessToken, refreshToken: rotatedRefreshToken } = result;

  // Rotation: replace the cookie with the freshly issued refresh token.
  setRefreshTokenCookie(res, rotatedRefreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Got Access Token!",
    data: { accessToken },
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let activeToken = "";
  if (authHeader) {
    activeToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader.trim();
  } else {
    activeToken = req.cookies?.accessToken || req.cookies?.token || "";
  }

  if (activeToken) {
    try {
      const decoded = jwt.decode(activeToken) as jwt.JwtPayload | null;
      const expiresAt = decoded && decoded.exp 
        ? new Date(decoded.exp * 1000) 
        : new Date(Date.now() + 24 * 60 * 60 * 1000); // fallback if no exp is present

      await TokenBlacklist.create({
        token: activeToken,
        expiresAt,
      });
    } catch (err) {
      console.error("Error blacklisting token on logout:", err);
    }
  }

  const refreshToken = req.cookies?.refreshToken as string | undefined;
  if (refreshToken) {
    await AuthService.logout(refreshToken);
  }
  clearRefreshTokenCookie(res);

  res.status(httpStatus.OK).json({
    message: "Logged out successfully. Session revoked securely."
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const result = await AuthService.googleLogin(body);
  const { accessToken, refreshToken } = result;

  setRefreshTokenCookie(res, refreshToken);

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
    data: null,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await AuthService.forgotPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "If an account exists for this email, an OTP has been sent.",
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

  setRefreshTokenCookie(res, refreshToken);

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
  logout,
  googleLogin,
  changePassword,
  forgotPassword,
  resetPassword,
};
