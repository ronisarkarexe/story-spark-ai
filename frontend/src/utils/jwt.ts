import { jwtDecode, JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  // Standard JWT claim `sub` is inherited from JwtPayload — not redeclared here
  email?: string;
  userId?: string;
  _id?: string;
  name?: string;
  postsCount?: number;
  role?: string;
  subscriptionType?: string;
}

/**
 * Checks if a string has the standard 3-part JWT format.
 */
export const isJwtTokenFormat = (token: string): boolean => {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  return parts.length === 3 && parts.every((part) => part.length > 0);
};

/**
 * Decodes a JWT token and strictly validates its payload structure and claims.
 * Throws an error if validation fails.
 */
export const decodeToken = (token: string): CustomJwtPayload => {
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


  // 1. Validate required userId or _id claim, then normalize to decoded.userId
  const idToUse = decoded.userId || decoded._id || decoded.sub;
  if (typeof idToUse !== "string" || idToUse.trim() === "") {
    throw new Error("Token is missing a valid 'userId', '_id', or 'sub' claim.");
  }
  decoded.userId = idToUse; // normalize: callers always find the user ID in decoded.userId

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

  const VALID_ROLES = ["user", "admin", "super_admin", "writer", "guest"] as const;
  if (!VALID_ROLES.includes(decoded.role as typeof VALID_ROLES[number])) {
    console.warn(`Unrecognised token role: "${decoded.role}". Allowed: ${VALID_ROLES.join(", ")}`);
    // Warn but do not throw — prevents valid tokens from being rejected if backend adds new roles.
  }

  // 4. Validate required subscriptionType claim
  if (typeof decoded.subscriptionType !== "string" || decoded.subscriptionType.trim() === "") {
    throw new Error("Token is missing a valid 'subscriptionType' claim.");
  }

  const VALID_SUBSCRIPTIONS = ["free", "pro", "premium"] as const;
  if (!VALID_SUBSCRIPTIONS.includes(decoded.subscriptionType as typeof VALID_SUBSCRIPTIONS[number])) {
    console.warn(`Unrecognised subscription type: "${decoded.subscriptionType}". Allowed: ${VALID_SUBSCRIPTIONS.join(", ")}`);
    // Warn but do not throw — prevents valid tokens from being rejected if backend adds new plans.
  }

  // 5. Validate exp claim (must be a future timestamp in seconds)
  if (typeof decoded.exp !== "number") {
    throw new Error("Token is missing a valid numeric 'exp' claim.");
  }

  const CLOCK_SKEW_TOLERANCE_SECONDS = 60;
  if (decoded.exp <= Math.floor(Date.now() / 1000) - CLOCK_SKEW_TOLERANCE_SECONDS) {
    throw new Error("Token has expired.");
  }

  // 6. Validate iat claim
  if (typeof decoded.iat !== "number") {
    throw new Error("Token is missing a valid numeric 'iat' claim.");
  }

  // 6b. Validate nbf (not before) claim if present — RFC 7519 §4.1.5
  if (decoded.nbf !== undefined) {
    if (typeof decoded.nbf !== "number") {
      throw new Error("Token 'nbf' claim must be a number.");
    }
    if (decoded.nbf > Math.floor(Date.now() / 1000) + CLOCK_SKEW_TOLERANCE_SECONDS) {
      throw new Error("Token is not yet valid (nbf claim is in the future).");
    }
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

