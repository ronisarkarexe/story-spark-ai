const localhostPattern = /^http:\/\/localhost:\d+$/;
const vercelPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

export const isAllowedOrigin = (
  origin: string | undefined,
  configuredOrigins: string[] = []
) => {
  if (!origin) {
    return true;
  }

  if (configuredOrigins.includes(origin)) {
    return true;
  }

  return localhostPattern.test(origin) || vercelPattern.test(origin);
};
