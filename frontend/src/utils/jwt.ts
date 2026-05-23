import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  _id?: string | undefined;
  email?: string | undefined;
  userId?: string | undefined;
  name?: string | undefined;
  postsCount?: number | undefined;
  role?: string | undefined;
  subscriptionType?: string | undefined;
}

export const decodedToken = (token: string) => {
  return jwtDecode<CustomJwtPayload>(token);
};
