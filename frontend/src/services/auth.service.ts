import { AUTH_KEY } from "../constants/storage-key";
import { AccessToken } from "../models/login";
import { decodedToken } from "../utils/jwt";
import { validateTokenPayload } from "../utils/auth-validator";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "../utils/local-storage";

export const authChangeEventName = "story-spark-auth-change";

const emitAuthChange = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(authChangeEventName));
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

const buildUserInfo = (decodedData: any): AuthUserInfo => {
  const userId = decodedData.userId || decodedData._id || decodedData.sub || "";
  return {
    email: decodedData.email,
    userId,
    name: decodedData.name || "",
    postsCount: decodedData.postsCount || 0,
    role: decodedData.role,
    subscriptionType: decodedData.subscriptionType,
    exp: decodedData.exp,
    iat: decodedData.iat,
  };
};

export const getValidDecodedToken = (): AuthUserInfo | null => {
  const authToken = getFromLocalStorage(AUTH_KEY);

  if (authToken) {
    try {
      const decodedData = decodedToken(authToken);
      
      if (!decodedData) {
        removeFromLocalStorage(AUTH_KEY);
        emitAuthChange();
        return null;
      }

      // Perform runtime validation
      validateTokenPayload(decodedData);

      // Verify expiration
      if (decodedData.exp <= Math.floor(Date.now() / 1000)) {
        removeFromLocalStorage(AUTH_KEY);
        emitAuthChange();
        return null;
      }
      
      return buildUserInfo(decodedData);
    } catch (error) {
      console.error("Invalid auth token:", error);
      removeFromLocalStorage(AUTH_KEY);
      emitAuthChange();
      return null;
    }
  }
  return null;
};

export const storeUserInfo = ({ accessToken }: AccessToken) => {
  const result = setToLocalStorage(AUTH_KEY, accessToken);
  emitAuthChange();
  return result;
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
