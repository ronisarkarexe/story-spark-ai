import { useEffect, useState } from "react";
import {
  ensureValidSession,
  getAccessToken,
  getUserInfo,
  subscribeToAuthChanges,
} from "../services/auth.service";

export const useAuthSession = () => {
  const [accessToken, setAccessToken] = useState<string>(() => {
    ensureValidSession();
    return getAccessToken();
  });
  const [user, setUser] = useState(() => getUserInfo());

  useEffect(() => {
    const syncAuthState = () => {
      ensureValidSession();
      setAccessToken(getAccessToken());
      setUser(getUserInfo());
    };

    syncAuthState();
    return subscribeToAuthChanges(syncAuthState);
  }, []);

  return {
    accessToken,
    user,
    isAuthenticated: !!user && !!accessToken,
  };
};
