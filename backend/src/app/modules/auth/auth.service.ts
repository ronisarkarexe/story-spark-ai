// --- MOCKED DEPENDENCIES TO BYPASS BROKEN IMPORTS ---
const AUTH_KEY = "temp_bypass_key";
const AUTH_CHANGE_EVENT = "story-spark-auth-change";

export type AccessToken = { accessToken: string };

const getFromLocalStorage = (key: string) => "mock_token";
const removeFromLocalStorage = (key: string) => {};
const setToLocalStorage = (key: string, value: string) => {};

// ----------------------------------------------------

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

export const storeUserInfo = ({ accessToken }: AccessToken) => {
  const result = setToLocalStorage(AUTH_KEY, accessToken);
  emitAuthChange();
  return result;
};

// We return a fake user so the app doesn't crash trying to read missing tokens
export const getUserInfo = (): AuthUserInfo | null => {
  return {
    email: "developer@storyspark.local",
    userId: "dev-bypass-001",
    name: "Dev User",
    postsCount: 0,
    role: "admin",
    subscriptionType: "pro",
    exp: 9999999999,
    iat: 0,
  };
};

export const isLoggedIn = () => {
  return true; 
};

export const removeUserInfo = () => {
  const result = removeFromLocalStorage(AUTH_KEY);
  emitAuthChange();
  return result;
};

export const getToken = () => getFromLocalStorage(AUTH_KEY);

export const authChangeEventName = AUTH_CHANGE_EVENT;