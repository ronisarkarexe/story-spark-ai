/**
 * Validates a decoded JWT token payload and strictly checks its claims format and existence.
 * Throws a descriptive Error if validation fails.
 */
export const validateTokenPayload = (decodedData: unknown): void => {
  if (!decodedData || typeof decodedData !== "object") {
    throw new Error("Token payload is not a valid object.");
  }

  const data = decodedData as Record<string, unknown>;

  // Support _id, userId, or sub for the user identifier claim
  const userId = data.userId || data._id || data.sub;
  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    throw new Error("Token is missing a valid user identifier ('userId', '_id', or 'sub').");
  }

  // Validate email address claim
  if (typeof data.email !== "string" || data.email.trim() === "") {
    throw new Error("Token is missing a valid 'email' claim.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error("Token 'email' claim is not a valid email address.");
  }

  // Validate role claim (must match backend database roles)
  if (typeof data.role !== "string" || data.role.trim() === "") {
    throw new Error("Token is missing a valid 'role' claim.");
  }

  const validRoles = ["admin", "super_admin", "user", "writer", "guest"];
  if (!validRoles.includes(data.role)) {
    throw new Error(`Token 'role' claim must be one of: ${validRoles.join(", ")}`);
  }

  // Validate subscriptionType claim (must match backend database subscription types)
  if (typeof data.subscriptionType !== "string" || data.subscriptionType.trim() === "") {
    throw new Error("Token is missing a valid 'subscriptionType' claim.");
  }

  const validSubscriptions = ["free", "pro", "premium"];
  if (!validSubscriptions.includes(data.subscriptionType)) {
    throw new Error(`Token 'subscriptionType' claim must be one of: ${validSubscriptions.join(", ")}`);
  }

  // Validate exp claim (must be a valid timestamp number in seconds)
  if (typeof data.exp !== "number" || isNaN(data.exp)) {
    throw new Error("Token is missing a valid numeric 'exp' claim.");
  }

  // Validate iat claim (must be a valid timestamp number in seconds)
  if (typeof data.iat !== "number" || isNaN(data.iat)) {
    throw new Error("Token is missing a valid numeric 'iat' claim.");
  }

  // Validate optional name claim type if present
  if (data.name !== undefined && typeof data.name !== "string") {
    throw new Error("Token 'name' claim must be a string.");
  }

  // Validate optional postsCount claim type if present
  if (data.postsCount !== undefined && typeof data.postsCount !== "number") {
    throw new Error("Token 'postsCount' claim must be a number.");
  }
};
