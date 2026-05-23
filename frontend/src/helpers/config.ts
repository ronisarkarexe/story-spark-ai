export const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_BASE_URL?.trim();
  if (!url && import.meta.env.DEV) {
    console.warn(
      "[Story Spark] VITE_BASE_URL is unset. Copy frontend/.env.example to frontend/.env and set the API URL."
    );
  }

  if (url) {
    return url.replace(/\/+$/, "");
  }

  return import.meta.env.DEV ? "http://localhost:5001/api/v1" : "";
};

export const hasConfiguredBaseUrl = () => Boolean(import.meta.env.VITE_BASE_URL?.trim());
