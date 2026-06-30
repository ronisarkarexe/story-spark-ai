// VITE_BASE_URL is the full API base, e.g. http://localhost:5001/api/v1
const BASE_URL = import.meta.env.VITE_BASE_URL as string | undefined;

if (!BASE_URL) {
  console.error(
    "[api.config] VITE_BASE_URL is not defined.\n" +
    "Copy .env.example to frontend/.env and set VITE_BASE_URL=http://localhost:5001/api/v1"
  );
}

export const API_BASE = (BASE_URL ?? "").replace(/\/$/, "");

// getBaseUrl returns the full API base URL (used by RTK Query axiosBaseQuery)
export const getBaseUrl = () => API_BASE;
