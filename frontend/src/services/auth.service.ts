import { AUTH_KEY } from "../constants/storage-key";
import { AccessToken } from "../models/login";
import { decodedToken } from "../utils/jwt";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "../utils/local-storage";

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

const buildUserInfo = (decodedData: AuthUserInfo): AuthUserInfo => ({
  email: decodedData.email || "",
  userId: decodedData.userId || "",
  name: decodedData.name || "",
  postsCount: decodedData.postsCount || 0,
  role: decodedData.role || "guest",
  subscriptionType: decodedData.subscriptionType || "free",
  exp: decodedData.exp || 0,
  iat: decodedData.iat || 0,
});

const getValidDecodedToken = () => {
  const authToken = getFromLocalStorage(AUTH_KEY);

  if (authToken) {
    try {
      const decodedData = decodedToken(authToken);
          if (
      typeof decodedData.exp === "number" &&
      decodedData.exp <= Math.floor(Date.now() / 1000)
    ) {
      removeFromLocalStorage(AUTH_KEY);
      return null;
    }
      return buildUserInfo(decodedData as unknown as AuthUserInfo);
    } catch (error) {
      console.error("Invalid auth token:", error);
      removeFromLocalStorage(AUTH_KEY);
      return null;
    }
  }
  return null;
};

export const storeUserInfo = ({ accessToken }: AccessToken) => {
  return setToLocalStorage(AUTH_KEY, accessToken);
};

export const getUserInfo = (): AuthUserInfo | null => {
  return getValidDecodedToken();
};
export const isLoggedIn = () => {
  return !!getValidDecodedToken();
};

export const removeUserInfo = () => {
  return removeFromLocalStorage(AUTH_KEY);
};

export const getToken = () => getFromLocalStorage(AUTH_KEY);
