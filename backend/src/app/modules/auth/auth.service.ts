import { AUTH_KEY } from "../constants/storage-key";
import { AccessToken } from "../models/login";
import { decodedToken } from "../utils/jwt";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "../utils/local-storage";

const AUTH_CHANGE_EVENT = "story-spark-auth-change";

const emitAuthChange = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export type AuthUserInfo = {
  email: string;
  userId: string;
  name: string;
  postsCount: number;
  role: string;
  subscriptionType: string;
  exp: number;
  iat: number;
  avatar?: string;
};

// Raw shape of the decoded JWT payload — fields are optional because
// different token versions or providers may omit some of them
interface RawJwtPayload {
  email?: string;
  userId?: string;
  _id?: string;
  name?: string;
  postsCount?: number;
  role?: string;
  subscriptionType?: string;
  exp?: number;
  iat?: number;
  avatar?: string;
}

// Maps raw JWT payload to a typed AuthUserInfo object
// Uses optional chaining + fallbacks to safely handle any missing fields
const buildUserInfo = (decodedData: RawJwtPayload): AuthUserInfo => ({
  email: decodedData?.email || "",
  userId: decodedData?.userId || decodedData?._id || "",
  name: decodedData?.name || "",
  postsCount: decodedData?.postsCount || 0,
  role: decodedData?.role || "guest",
  subscriptionType: decodedData?.subscriptionType || "free",
  exp: decodedData?.exp || 0,
  iat: decodedData?.iat || 0,
  avatar: decodedData?.avatar || "",
});

export const getValidDecodedToken = () => {
  const authToken = getFromLocalStorage(AUTH_KEY);

  if (authToken) {
    try {
      const decodedData = decodedToken(authToken);

      if (!decodedData) {
        removeFromLocalStorage(AUTH_KEY);
        return null;
      }

      if (
        typeof decodedData.exp === "number" &&
        decodedData.exp <= Math.floor(Date.now() / 1000)
      ) {
        removeFromLocalStorage(AUTH_KEY);
        return null;
      }

      return buildUserInfo({
        email: decodedData.email ?? "",
        role: decodedData.role ?? "",
        userId: decodedData.userId ?? decodedData._id ?? "",
        name: decodedData.name ?? "",
        postsCount: decodedData.postsCount ?? 0,
        subscriptionType: decodedData.subscriptionType ?? "free",
        exp: decodedData.exp ?? 0,
        iat: decodedData.iat ?? 0,
      });
    } catch (error) {
      console.error("Invalid auth token:", error);
      removeFromLocalStorage(AUTH_KEY);
      return null;
    }
  }
  return null;
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
        status: "Active",
        subscriptionType: "free",
        profile: {
          avatar: (picture as string) || "",
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

export const getUserInfo = (): AuthUserInfo | null => {
  return getValidDecodedToken();
};

export const isLoggedIn = () => {
  return !!getValidDecodedToken();
};

export const removeUserInfo = () => {
  const result = removeFromLocalStorage(AUTH_KEY);
  emitAuthChange();
  return result;
};

export const getToken = () => getFromLocalStorage(AUTH_KEY);

export const authChangeEventName = AUTH_CHANGE_EVENT;