
import dotenv from "dotenv";
import path from "path";
import winston from "winston";

// Inline logger for config module since it can't import logger.util.ts (circular dep)
const configLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const parseList = (
  raw: string | undefined
): string[] | undefined => {
  const value = raw?.trim();

  if (!value) {
    return undefined;
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => Boolean(item));
};

const requiredEnv = (key: string): string => {
  const value = process.env[key]?.trim();

  if (value) {
    return value;
  }

  throw new Error(
    `${key} environment variable is required. See backend/.env.example for setup instructions.`
  );
};

export const assertAIProviderConfigured = (): void => {
  const openAIKey =
    process.env.OPEN_AI_KEY || process.env.OPENAI_API_KEY;

  const hasOpenAI = Boolean(openAIKey?.trim());
  const hasGemini = Boolean(
    process.env.GEMINI_API_KEY?.trim()
  );
  const hasAnthropic = Boolean(
    process.env.ANTHROPIC_API_KEY?.trim()
  );

  const noProviderConfigured =
    !hasOpenAI &&
    !hasGemini &&
    !hasAnthropic;

  if (noProviderConfigured) {
    throw new Error(
      "No AI provider API key configured. Set at least one of OPEN_AI_KEY, GEMINI_API_KEY, or ANTHROPIC_API_KEY in your environment. See backend/.env.example for setup instructions."
    );
  }

  if (!hasOpenAI) {
    configLogger.warn(
      "[Config] OPEN_AI_KEY not set — OpenAI provider unavailable."
    );
  }

  if (!hasGemini) {
    configLogger.warn(
      "[Config] GEMINI_API_KEY not set — Gemini provider unavailable."
    );
  }

  if (!hasAnthropic) {
    configLogger.warn(
      "[Config] ANTHROPIC_API_KEY not set — Anthropic provider unavailable."
    );
  }
};

const databaseUrl = (() => {
  const url = process.env.DATABASE_URL?.trim();

  return url || "mongodb://127.0.0.1:27017/story_spark_ai";
})();

const bcryptSaltRounds = (() => {
  const rawRounds = process.env.SALT_ROUNDS;
  const parsedRounds = rawRounds
    ? Number(rawRounds)
    : NaN;

  const isValid =
    Number.isInteger(parsedRounds) &&
    parsedRounds > 0;

  return isValid ? parsedRounds : 10;
})();

const frontendUrl =
  process.env.FRONTEND_URL ??
  "http://localhost:4001";

const port =
  process.env.PORT ??
  "5000";

const disableLogs =
  process.env.DISABLE_LOGS === "true" ||
  process.env.VERCEL === "1";

export default {
  env: process.env.NODE_ENV,

  frontend_url: frontendUrl,

  port,

  disable_logs: disableLogs,

  database_url: databaseUrl,

  cors_origins: parseList(
    process.env.CORS_ORIGINS
  ),

  dns_servers: parseList(
    process.env.DNS_SERVERS
  ),

  bcrypt_salt_rounds: bcryptSaltRounds,

  jwt: {
    secret: requiredEnv("JWT_SECRET"),

    refresh_secret: requiredEnv(
      "JWT_REFRESH_SECRET"
    ),

    expires_in: requiredEnv(
      "JWT_EXPIRES_IN"
    ),

    refresh_expires_in: requiredEnv(
      "JWT_REFRESH_EXPIRES_IN"
    ),
  },

  auth: {
    allow_cookie_auth:
      process.env.ALLOW_COOKIE_AUTH === "true",
  },

  default_admin_password:
    process.env.DEFAULT_ADMIN_PASSWORD,

  openai_key:
    process.env.OPEN_AI_KEY,

  image_generation_provider:
    process.env.IMAGE_GENERATION_PROVIDER,

  image_generation_api_key:
    process.env.IMAGE_GENERATION_API_KEY,

  unsplash_key_api:
    process.env.UNSPLASH_KEY_API,

  unsplash_secret_key_api:
    process.env.UNSPLASH_KEY_API_SECRET,

  gemini_api_key:
    process.env.GEMINI_API_KEY,

  gemini_image_model:
    process.env.GEMINI_IMAGE_MODEL ??
    "imagen-3.0-generate-002",

  anthropic_api_key:
    process.env.ANTHROPIC_API_KEY,

  verify_email:
    process.env.VERIFY_EMAIL,

  verify_password:
    process.env.VERIFY_PASSWORD,

  google_client_id:
    process.env.GOOGLE_CLIENT_ID,

  github: {
    token:
      process.env.GITHUB_TOKEN,

    repo:
      process.env.GITHUB_REPO ??
      "ronisarkarexe/story-spark-ai",
  },
};
