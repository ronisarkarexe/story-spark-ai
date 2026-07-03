export const validateTokenPayload = (decodedData: Record<string, unknown>): void => {
  if (!decodedData || typeof decodedData !== "object") {
    throw new Error("Token payload is not a valid object.");
  }
  const userId = decodedData.userId || decodedData._id || decodedData.sub;
  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    throw new Error("Token is missing a valid user identifier ('userId', '_id', or 'sub').");
  }
  if (typeof decodedData.email !== "string" || decodedData.email.trim() === "") {
    throw new Error("Token is missing a valid 'email' claim.");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(decodedData.email)) {
    throw new Error("Token 'email' claim is not a valid email address.");
  }
  if (typeof decodedData.role !== "string" || decodedData.role.trim() === "") {
    throw new Error("Token is missing a valid 'role' claim.");
  }
  const validRoles = ["admin", "super_admin", "user", "writer", "guest"];
  if (!validRoles.includes(decodedData.role)) {
    throw new Error(`Token 'role' claim must be one of: ${validRoles.join(", ")}`);
  }
  if (typeof decodedData.subscriptionType !== "string" || decodedData.subscriptionType.trim() === "") {
    throw new Error("Token is missing a valid 'subscriptionType' claim.");
  }
  const validSubscriptions = ["free", "pro", "premium"];
  if (!validSubscriptions.includes(decodedData.subscriptionType)) {
    throw new Error(`Token 'subscriptionType' claim must be one of: ${validSubscriptions.join(", ")}`);
  }
  if (typeof decodedData.exp !== "number" || isNaN(decodedData.exp)) {
    throw new Error("Token is missing a valid numeric 'exp' claim.");
  }
  const currentTime = Math.floor(Date.now() / 1000);
  if (decodedData.exp < currentTime) {
    throw new Error("Token has expired.");
  }
  if (typeof decodedData.iat !== "number" || isNaN(decodedData.iat)) {
    throw new Error("Token is missing a valid numeric 'iat' claim.");
  }
  if (decodedData.iat >= decodedData.exp) {
    throw new Error("Token 'iat' must be before 'exp'.");
  }
  if (decodedData.name !== undefined && typeof decodedData.name !== "string") {
    throw new Error("Token 'name' claim must be a string.");
  }
  if (decodedData.postsCount !== undefined && typeof decodedData.postsCount !== "number") {
    throw new Error("Token 'postsCount' claim must be a number.");
  }
};