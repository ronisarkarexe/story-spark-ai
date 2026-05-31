import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserInfo,
  removeUserInfo,
  storeUserInfo,
} from "../services/auth.service";
import { AUTH_KEY } from "../constants/storage-key";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  postsCount?: number;
  subscriptionType?: string;
}

interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem(AUTH_KEY),
  );
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    removeUserInfo(); // handles localStorage removal via AUTH_KEY
    navigate("/login");
  }, [navigate]);

  const login = async (token: string) => {
    setAccessToken(token);
    storeUserInfo({ accessToken: token }); // single source of truth for token storage

    const userInfo = getUserInfo();
    if (userInfo) {
      setUser({
        id: userInfo.userId,
        name: userInfo.name,
        email: userInfo.email,
        role: userInfo.role,
        postsCount: userInfo.postsCount,
        subscriptionType: userInfo.subscriptionType,
      });
    }
  };

  useEffect(() => {
    if (!accessToken) return;

    try {
      const userInfo = getUserInfo();

      if (!userInfo || !userInfo.userId) {
        logout();
        return;
      }

      if (userInfo.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      setUser({
        id: userInfo.userId,
        name: userInfo.name,
        email: userInfo.email,
        role: userInfo.role,
        postsCount: userInfo.postsCount,
        subscriptionType: userInfo.subscriptionType,
      });
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
    }
  }, [accessToken, logout]);

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
