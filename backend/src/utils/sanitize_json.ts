export const sanitizeJsonText = (text: string): string => {
  let sanitized = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const start = sanitized.indexOf('{');
  const end = sanitized.lastIndexOf('}');
  
  if (start !== -1 && end !== -1) {
    sanitized = sanitized.substring(start, end + 1);
  }
  return sanitized;
};