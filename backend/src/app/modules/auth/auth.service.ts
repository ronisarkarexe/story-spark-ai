import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { AuthModel } from "./auth.interface";
import { User } from "../user/user.model";
import { JwtHalers } from "../../../utils/jwt.helper";
import config from "../../../config";
import ApiError from "../../../errors/api_error";
import { IUser } from "../user/user.interface";
import { OTPModel } from "../verify_email/otp.model";

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
  const { _id, email, role, subscriptionType, name, postsCount } = isExistUser;
  const accessToken = JwtHalers.createToken(
    { _id, email, role, subscriptionType, name, postsCount },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = JwtHalers.createToken(
    { _id, email, role, subscriptionType, name, postsCount },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

const register = async (payload: IUser & { verificationToken?: string }) => {
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
  
  const result = await User.create(payload);
  
  // Clean up OTP record after successful registration
  await OTPModel.deleteOne({ email: userEmail });
  
  const { _id, email, role, subscriptionType, name, postsCount } = result;
  const accessToken = JwtHalers.createToken(
    { _id, email, role, subscriptionType, name, postsCount },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = JwtHalers.createToken(
    { _id, email, role, subscriptionType, name, postsCount },
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
  const { _id, email, role, subscriptionType, name, postsCount } = user;
  const newAccessToken = JwtHalers.createToken(
    { _id, email, role, subscriptionType, name, postsCount },
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

    const { _id, role, subscriptionType, postsCount, name } = user;
    const accessToken = JwtHalers.createToken(
      { _id, email, role, subscriptionType, name, postsCount },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
    const refreshTokenData = JwtHalers.createToken(
      { _id, email, role, subscriptionType, name, postsCount },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string
    );

    return {
      accessToken,
      refreshToken: refreshTokenData,
    };
  } catch (error: any) {
    console.log("Google login error:", error);
    
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

export const AuthService = {
  login,
  register,
  refreshToken,
  googleLogin,
};
