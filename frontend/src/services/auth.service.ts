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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildUserInfo = (decodedData: any): AuthUserInfo => ({
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

const getValidDecodedToken = () => {
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

      return buildUserInfo(decodedData);
    } catch (error) {
      console.error("Invalid auth token:", error);
      removeFromLocalStorage(AUTH_KEY);
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

export const authChangeEventName = AUTH_CHANGE_EVENT;
