import { jwtDecode, JwtPayload } from "jwt-decode";
import { validateTokenPayload } from "./auth-validator";

export interface CustomJwtPayload extends JwtPayload {
  email?: string | undefined;
  userId?: string | undefined;
  _id?: string | undefined;
  sub?: string | undefined;
  name?: string | undefined;
  postsCount?: number | undefined;
  role?: string | undefined;
  subscriptionType?: string | undefined;
}

/**
 * Checks if a string has the standard 3-part JWT format.
 */
export const isJwtTokenFormat = (token: string): boolean => {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  return parts.length === 3;
};

/**
 * Decodes a JWT token and strictly validates its payload structure and claims.
 * Throws an error if validation fails.
 */
export const decodedToken = (token: string): CustomJwtPayload => {
  if (!isJwtTokenFormat(token)) {
    throw new Error("Token format is invalid. A JWT must consist of three dot-separated segments.");
  }

  let decoded: CustomJwtPayload;
  try {
    decoded = jwtDecode<CustomJwtPayload>(token);
  } catch (error) {
    throw new Error(`Failed to decode JWT token: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Validate claims structure at runtime
  validateTokenPayload(decoded);

  return decoded;
};
