const BASE_URL = import.meta.env.VITE_BASE_URL as string | undefined;

if (!BASE_URL) {
  console.error(
    "[api.config] VITE_BASE_URL is not defined.\n" +
    "Copy .env.example to frontend/.env and set VITE_BASE_URL=http://localhost:5000"
  );
}

export const API_BASE = (BASE_URL ?? "").replace(/\/$/, ""); 

export const API_V1 = `${API_BASE}/api/v1`;

export const getBaseUrl = (): string => {
  if (BASE_URL) {
    return BASE_URL;
  }

  const isProduction = import.meta.env.PROD;
  return isProduction
    ? "https://story-spark-ai.vercel.app"
    : "http://localhost:5000";
};
