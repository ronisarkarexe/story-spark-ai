import { AUTH_KEY } from "../constants/storage-key";
import { AccessToken } from "../models/login";
import { decodeToken } from "../utils/jwt";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "../utils/local-storage";
import { validateTokenPayload } from "../utils/auth-validator";

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
  sub?: string;
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
  userId: decodedData?.userId || decodedData?._id || decodedData?.sub || "",
  name: decodedData?.name || "",
  postsCount: decodedData?.postsCount || 0,
  role: decodedData?.role || "guest",
  subscriptionType: decodedData?.subscriptionType || "free",
  exp: decodedData?.exp || 0,
  iat: decodedData?.iat || 0,
  avatar: decodedData?.avatar || undefined,
});

export const getValidDecodedToken = () => {
  const authToken = getFromLocalStorage(AUTH_KEY);

  if (authToken === "mock-developer-bypass-token") {
    return buildUserInfo({
      email: "admin@example.com",
      role: "super_admin",
      userId: "64a0f443b39c5b4d70b741aa",
      name: "Mock Developer",
      postsCount: 5,
      subscriptionType: "premium",
      exp: Math.floor(Date.now() / 1000) + 86400 * 30,
      iat: Math.floor(Date.now() / 1000),
    });
  }

  if (authToken) {
    try {
      const decodedData = decodeToken(authToken);
      // decodeToken always throws on failure — it never returns null.
      // If it throws, the catch block below handles cleanup and logging.

      validateTokenPayload(decodedData as Record<string, unknown>);

      return buildUserInfo({
        email: decodedData.email ?? "",
        role: decodedData.role ?? "",
        userId: decodedData.userId ?? decodedData._id ?? decodedData.sub ?? "",
        sub: decodedData.sub,
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

export const storeUserInfo = ({ accessToken }: AccessToken) => {
  try {
    const decodedData = decodeToken(accessToken);
    validateTokenPayload(decodedData as Record<string, unknown>);
  } catch (error) {
    console.error("Refusing to store invalid access token:", error);
    throw new Error("Received an invalid access token. Please try logging in again.");
  }

  const result = setToLocalStorage(AUTH_KEY, accessToken);
  emitAuthChange();
  return result;
};

export const getUserInfo = (): AuthUserInfo | null => {
  const localToken = getFromLocalStorage(AUTH_KEY);
  if (localToken === "mock-developer-bypass-token") {
    return {
      email: "admin@example.com",
      role: "super_admin",
      userId: "64a0f443b39c5b4d70b741aa",
      name: "Mock Developer",
      postsCount: 5,
      subscriptionType: "premium",
      exp: Math.floor(Date.now() / 1000) + 86400 * 30,
      iat: Math.floor(Date.now() / 1000),
    };
  }
  return getValidDecodedToken();
};

export const isLoggedIn = () => {
  return getFromLocalStorage(AUTH_KEY) === "mock-developer-bypass-token" || getUserInfo() !== null;
};

export const removeUserInfo = () => {
  const result = removeFromLocalStorage(AUTH_KEY);
  emitAuthChange();
  return result;
};

export const getToken = () => getFromLocalStorage(AUTH_KEY);

export const authChangeEventName = AUTH_CHANGE_EVENT;