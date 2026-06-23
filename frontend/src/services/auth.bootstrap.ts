import axios from "axios";
import { getBaseUrl } from "../helpers/config";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "./auth.token";
import { decodedToken } from "../utils/jwt";

const isExpired = (token: string) => {
  try {
    const payload = decodedToken(token);
    return !!payload.exp && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const bootstrapAuthSession = async () => {
  const currentToken = getAccessToken();
  if (currentToken && !isExpired(currentToken)) {
    return currentToken;
  }

  try {
    const response = await axios.post(
      `${getBaseUrl()}/auth/refresh-token`,
      {},
      { withCredentials: true }
    );

    const refreshedToken = response.data?.data?.accessToken ?? null;
    if (refreshedToken) {
      setAccessToken(refreshedToken);
      return refreshedToken;
    }
  } catch {
    clearAccessToken();
    return null;
  }

  clearAccessToken();
  return null;
};
