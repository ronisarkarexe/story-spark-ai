export const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_BASE_URL;
  if (!url) {
    if (import.meta.env.DEV) {
      console.warn(
        "[Story Spark] VITE_BASE_URL is unset. Defaulting to http://localhost:5000/api/v1."
      );
      return "http://localhost:5000/api/v1";
    }
    return "https://apistorysparkai.vercel.app/api/v1";
  }
  return url;
};
