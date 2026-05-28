import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const parseCorsOrigins = (
  raw: string | undefined
): string[] | undefined => {
  if (!raw?.trim()) return undefined;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || "5000",
  database_url: process.env.DATABASE_URL?.trim() || undefined,
  cors_origins: parseCorsOrigins(process.env.CORS_ORIGINS),
  bcrypt_salt_rounds: process.env.SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  default_admin_password: process.env.DEFAULT_ADMIN_PASSWORD,
  openai_key: process.env.OPEN_AI_KEY,
  unsplash_key_api: process.env.UNSPLASH_KEY_API,
  unsplash_secret_key_api: process.env.UNSPLASH_KEY_API_SECRET,
  gemini_api_key: process.env.GEMINI_API_KEY,
  verify_email: process.env.VERIFY_EMAIL,
  verify_password: process.env.VERIFY_PASSWORD,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
};
