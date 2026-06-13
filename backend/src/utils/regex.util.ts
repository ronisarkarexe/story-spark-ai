/**
 * Escapes all regex metacharacters in a string so it can be safely
 * embedded in a MongoDB $regex query without unintended pattern matching.
 */
export const escapeRegex = (text: string): string =>
  text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
