import { AUTH_KEY } from "../constants/storage-key";
import { AccessToken } from "../models/login";
import { decodedToken } from "../utils/jwt";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "../utils/local-storage";

const AUTH_STATE_EVENT = "storyspark:auth-state-change";

const emitAuthStateChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_STATE_EVENT));
  }
};

export const storeUserInfo = ({ accessToken }: AccessToken) => {
  const value = setToLocalStorage(AUTH_KEY, accessToken);
  emitAuthStateChange();
  return value;
};

export const getAccessToken = () => {
  const authToken = getFromLocalStorage(AUTH_KEY);
  return typeof authToken === "string" ? authToken : "";
};

export const isTokenExpired = (token?: string) => {
  if (!token) {
    return true;
  }

  try {
    const decodedData = decodedToken(token);
    if (!decodedData.exp) {
      return true;
    }

    return decodedData.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const getUserInfo = () => {
  const authToken = getAccessToken();
  if (!authToken || isTokenExpired(authToken)) {
    return null;
  }

  try {
    const decodedData = decodedToken(authToken);
    return {
      email: decodedData.email || "",
      userId: decodedData.userId || decodedData._id || "",
      name: decodedData.name || "",
      postsCount: decodedData.postsCount || 0,
      role: decodedData.role || "guest",
      subscriptionType: decodedData.subscriptionType || "free",
      exp: decodedData.exp || 0,
      iat: decodedData.iat || 0,
    };
  } catch {
    return null;
  }
};

export const isLoggedIn = () => {
  return !!getUserInfo();
};

export const removeUserInfo = () => {
  const value = removeFromLocalStorage(AUTH_KEY);
  emitAuthStateChange();
  return value;
};

export const ensureValidSession = () => {
  const authToken = getAccessToken();
  if (!authToken) {
    return null;
  }

  if (isTokenExpired(authToken)) {
    removeUserInfo();
    return null;
  }

  return authToken;
};

export const subscribeToAuthChanges = (listener: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === AUTH_KEY) {
      listener();
    }
  };

  window.addEventListener(AUTH_STATE_EVENT, listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(AUTH_STATE_EVENT, listener);
    window.removeEventListener("storage", handleStorage);
  };
};

export const token = getAccessToken();
