/**
 * Validates whether a given string is a well-formed email address.
 * Returns true for valid email formats and false otherwise.
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};
