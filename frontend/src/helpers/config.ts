export const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_BASE_URL;
  if (!url && import.meta.env.DEV) {
    console.warn(
      "[Story Spark] VITE_BASE_URL is unset. Copy frontend/.env.example to frontend/.env and set the API URL."
    );
  }
  return url ?? "";
};
