/*
 * Formats a byte value into a human-readable string with appropriate unit.
 * Handles Bytes, KB, MB, GB, and TB.
 *
 * @param bytes - The number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns A formatted string like "1.5 KB" or "3.2 MB"
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) {
    return "0 Bytes";
  }

  if (bytes < 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};