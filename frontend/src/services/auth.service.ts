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

type AuthUserInfo = {
  email: string;
  userId: string;
  name: string;
  postsCount: number;
  role: string;
  subscriptionType: string;
  exp: number;
  iat: number;
};

/**
 * Validates that all required JWT fields exist and have correct types
 * @throws Error if validation fails
 */
const validateTokenPayload = (decodedData: any): void => {
  const requiredFields = ["email", "role", "exp", "iat"];
  const missing: string[] = [];

  // Check for required fields
  requiredFields.forEach((field) => {
    if (!decodedData[field]) {
      missing.push(field);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Invalid token payload: missing required fields [${missing.join(", ")}]`
    );
  }

  // Validate that userId exists in either standard JWT formats
  const userId = decodedData._id || decodedData.userId || decodedData.sub;
  if (!userId) {
    throw new Error(
      "Invalid token payload: no user ID found (missing _id, userId, or sub)"
    );
  }

  // Validate timestamp fields are numbers
  if (typeof decodedData.exp !== "number") {
    throw new Error("Invalid token: exp must be a number");
  }
  if (typeof decodedData.iat !== "number") {
    throw new Error("Invalid token: iat must be a number");
  }

  // Validate role is a string
  if (typeof decodedData.role !== "string") {
    throw new Error("Invalid token: role must be a string");
  }
};

/**
 * Builds user info from validated token data
 * @throws Error if token data is invalid
 */
const buildUserInfo = (decodedData: any): AuthUserInfo => {
  validateTokenPayload(decodedData);

  // Use standard JWT format: _id, userId, or sub for user ID
  const userId = String(decodedData._id || decodedData.userId || decodedData.sub);

  return {
    email: String(decodedData.email),
    userId,
    name: decodedData.name || "Unknown User",
    postsCount: Number(decodedData.postsCount) || 0,
    role: String(decodedData.role),
    subscriptionType: decodedData.subscriptionType || "free",
    exp: Number(decodedData.exp),
    iat: Number(decodedData.iat),
  };
};

/**
 * Retrieves and validates the decoded token from storage
 * @returns {AuthUserInfo | null} Valid user info or null if invalid
 */
const getValidDecodedToken = (): AuthUserInfo | null => {
  const authToken = getFromLocalStorage(AUTH_KEY);

  if (!authToken) {
    return null;
  }

  try {
    const decodedData = decodedToken(authToken);

    // Check token expiration
    if (
      typeof decodedData.exp === "number" &&
      decodedData.exp <= Math.floor(Date.now() / 1000)
    ) {
      console.warn("Token has expired");
      removeFromLocalStorage(AUTH_KEY);
      return null;
    }

    // Validate and build user info
    const userInfo = buildUserInfo(decodedData);
    return userInfo;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error("Invalid auth token:", errorMessage);
    removeFromLocalStorage(AUTH_KEY);
    return null;
  }
};

export const storeUserInfo = ({ accessToken }: AccessToken) => {
  const result = setToLocalStorage(AUTH_KEY, accessToken);
  emitAuthChange();
  return result;
};

export const getUserInfo = (): AuthUserInfo | null => {
  return getValidDecodedToken();
};

export const isLoggedIn = (): boolean => {
  return !!getValidDecodedToken();
};

export const removeUserInfo = () => {
  const result = removeFromLocalStorage(AUTH_KEY);
  emitAuthChange();
  return result;
};

export const getToken = () => getFromLocalStorage(AUTH_KEY);

export const getToken = () => getFromLocalStorage(AUTH_KEY);

export const authChangeEventName = AUTH_CHANGE_EVENT;
