/**
 * Validates a decoded JWT token payload and strictly checks its claims format and existence.
 * Throws a descriptive Error if validation fails.
 */
export const validateTokenPayload = (decodedData: unknown): void => {
  if (!decodedData || typeof decodedData !== "object") {
    throw new Error("Token payload is not a valid object.");
  }

  const payload = decodedData as Record<string, unknown>;

  // Support _id, userId, or sub for the user identifier claim
  const userId = payload.userId || payload._id || payload.sub;
  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    throw new Error("Token is missing a valid user identifier ('userId', '_id', or 'sub').");
  }

  // Validate email address claim
  if (typeof payload.email !== "string" || payload.email.trim() === "") {
    throw new Error("Token is missing a valid 'email' claim.");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email)) {
    throw new Error("Token 'email' claim is not a valid email address.");
  }

  // Validate role claim (must match backend database roles)
  if (typeof payload.role !== "string" || payload.role.trim() === "") {
    throw new Error("Token is missing a valid 'role' claim.");
  }
  const validRoles = ["admin", "super_admin", "user", "writer", "guest"];
  if (!validRoles.includes(payload.role)) {
    throw new Error(`Token 'role' claim must be one of: ${validRoles.join(", ")}`);
  }

  // Validate subscriptionType claim (must match backend database subscription types)
  if (typeof payload.subscriptionType !== "string" || payload.subscriptionType.trim() === "") {
    throw new Error("Token is missing a valid 'subscriptionType' claim.");
  }
  const validSubscriptions = ["free", "pro", "premium"];
  if (!validSubscriptions.includes(payload.subscriptionType)) {
    throw new Error(`Token 'subscriptionType' claim must be one of: ${validSubscriptions.join(", ")}`);
  }

  // Validate exp claim (must be a valid timestamp number in seconds)
  if (typeof payload.exp !== "number" || isNaN(payload.exp)) {
    throw new Error("Token is missing a valid numeric 'exp' claim.");
  }
  const currentTime = Math.floor(Date.now() / 1000);
  if (payload.exp < currentTime) {
    throw new Error("Token has expired.");
  }

  // Validate iat claim (must be a valid timestamp number in seconds)
  if (typeof payload.iat !== "number" || isNaN(payload.iat)) {
    throw new Error("Token is missing a valid numeric 'iat' claim.");
  }
  if (payload.iat >= payload.exp) {
    throw new Error("Token 'iat' must be before 'exp'.");
  }

  // Validate optional name claim type if present
  if (payload.name !== undefined && typeof payload.name !== "string") {
    throw new Error("Token 'name' claim must be a string.");
  }

  // Validate optional postsCount claim type if present
  if (payload.postsCount !== undefined && typeof payload.postsCount !== "number") {
    throw new Error("Token 'postsCount' claim must be a number.");
  }
};