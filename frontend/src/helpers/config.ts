const BASE_URL = import.meta.env.VITE_BASE_URL as string | undefined;

if (!BASE_URL) {
  console.error(
    "[api.config] VITE_BASE_URL is not defined.\n" +
    "Copy .env.example to frontend/.env and set VITE_BASE_URL=http://localhost:5000"
  );
}

export const API_BASE = (BASE_URL ?? "").replace(/\/$/, "");

export const API_V1 = `${API_BASE}/api/v1`;

export const getBaseUrl = () => API_BASE;
