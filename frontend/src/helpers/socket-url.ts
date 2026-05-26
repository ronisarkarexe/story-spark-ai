const DEFAULT_SOCKET_URL = "https://notification-socket-io.onrender.com";

const stripApiSuffix = (url: string) => url.replace(/\/api\/v1\/?$/, "");

/** Vercel serverless exports only REST handlers — Socket.IO cannot run there. */
const isVercelServerlessHost = (url: string) =>
  /(^https?:\/\/)?[^/]*vercel\.app/i.test(url);

export const resolveSocketUrl = (): string => {
  const apiOrigin = import.meta.env.VITE_BASE_URL
    ? stripApiSuffix(import.meta.env.VITE_BASE_URL)
    : "";
  const configured = import.meta.env.VITE_SOCKET_URL?.trim();

  if (configured) {
    if (isVercelServerlessHost(configured)) {
      return DEFAULT_SOCKET_URL;
    }
    return configured.replace(/\/$/, "");
  }

  if (apiOrigin && !isVercelServerlessHost(apiOrigin)) {
    return apiOrigin;
  }

  return DEFAULT_SOCKET_URL;
};
