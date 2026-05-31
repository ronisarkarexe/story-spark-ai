import { jwtDecode, JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  email?: string | undefined;
  userId?: string | undefined;
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

  if (!decoded || typeof decoded !== "object") {
    throw new Error("Token payload is not a valid object.");
  }

  // 1. Validate required userId claim
  if (typeof decoded.userId !== "string" || decoded.userId.trim() === "") {
    throw new Error("Token is missing a valid 'userId' claim.");
  }

  // 2. Validate required email claim
  if (typeof decoded.email !== "string" || decoded.email.trim() === "") {
    throw new Error("Token is missing a valid 'email' claim.");
  }

  // Simple robust email pattern validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(decoded.email)) {
    throw new Error("Token 'email' claim is not a valid email address.");
  }

  // 3. Validate required role claim
  if (typeof decoded.role !== "string" || decoded.role.trim() === "") {
    throw new Error("Token is missing a valid 'role' claim.");
  }

  const validRoles = ["user", "admin", "guest"];
  if (!validRoles.includes(decoded.role)) {
    throw new Error(`Token 'role' claim must be one of: ${validRoles.join(", ")}`);
  }

  // 4. Validate required subscriptionType claim
  if (typeof decoded.subscriptionType !== "string" || decoded.subscriptionType.trim() === "") {
    throw new Error("Token is missing a valid 'subscriptionType' claim.");
  }

  const validSubscriptions = ["free", "premium"];
  if (!validSubscriptions.includes(decoded.subscriptionType)) {
    throw new Error(`Token 'subscriptionType' claim must be one of: ${validSubscriptions.join(", ")}`);
  }

  // 5. Validate exp claim (must be a future timestamp in seconds)
  if (typeof decoded.exp !== "number") {
    throw new Error("Token is missing a valid numeric 'exp' claim.");
  }

  if (decoded.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error("Token has expired.");
  }

  // 6. Validate iat claim
  if (typeof decoded.iat !== "number") {
    throw new Error("Token is missing a valid numeric 'iat' claim.");
  }

  // 7. Validate optional name claim type if present
  if (decoded.name !== undefined && typeof decoded.name !== "string") {
    throw new Error("Token 'name' claim must be a string.");
  }

  // 8. Validate optional postsCount claim type if present
  if (decoded.postsCount !== undefined && typeof decoded.postsCount !== "number") {
    throw new Error("Token 'postsCount' claim must be a number.");
  }

  return decoded;
};

