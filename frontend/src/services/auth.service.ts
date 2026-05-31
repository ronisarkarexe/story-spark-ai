
export const getMemoryToken = () => memoryToken;

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
  const authToken = getMemoryToken();

  if (authToken) {
    try {
      const decodedData = decodedToken(authToken) as AuthUserInfo;
          if (
      typeof decodedData.exp === "number" &&
      decodedData.exp <= Math.floor(Date.now() / 1000)
    ) {
      setMemoryToken(null);
      return null;
    }
      return buildUserInfo(decodedData);
    } catch (error) {
      console.error("Invalid auth token:", error);
      setMemoryToken(null);
      return null;
    }
  }
  return null;
};

export const storeUserInfo = ({ accessToken }: AccessToken) => {
  setMemoryToken(accessToken);
  emitAuthChange();
};

export const getUserInfo = (): AuthUserInfo | null => {
  return getValidDecodedToken();
};
export const isLoggedIn = () => {
  return !!getValidDecodedToken();
};

export const removeUserInfo = () => {
  setMemoryToken(null);
  emitAuthChange();
};

export const getToken = () => getMemoryToken();

export const authChangeEventName = AUTH_CHANGE_EVENT;
