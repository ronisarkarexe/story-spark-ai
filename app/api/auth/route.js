import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Redis } from "@upstash/redis";
import { checkRateLimit } from "@/lib/rateLimit";

// Service-role client is only used for signup so it can create users regardless
// of RLS policies. It is never used for login — that goes through the anon client
// so that Supabase's own per-user RLS applies from the first request.
function getValidUrl(value) {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed || trimmed.startsWith("Your ")) return null;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:" ? trimmed : null;
  } catch {
    return null;
  }
}

function getValidKey(value) {
  if (!value) return null;
  const trimmed = String(value).trim();
  return trimmed && !trimmed.startsWith("Your ") ? trimmed : null;
}

const supabaseUrl = getValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = getValidKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const supabaseServiceKey = getValidKey(process.env.SUPABASE_SERVICE_KEY);

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

const AUTH_RATE_LIMIT_PREFIX = "auth";

const LOGIN_FAILURE_WINDOW_SECONDS = 15 * 60; // 15 minutes
const LOGIN_FAILURE_THRESHOLD = 5; // lock after 5 failed attempts
const LOGIN_LOCK_SECONDS = 15 * 60; // 15 minutes lockout

// In-memory fallback for local dev (single instance). Not suitable for serverless scaling.
const memoryLockouts = new Map(); // email -> until timestamp
const memoryFailures = new Map(); // email -> { count, resetAt }

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function getClientIp(headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function lockKey(email) {
  return `${AUTH_RATE_LIMIT_PREFIX}:lock:${email}`;
}

function failKey(email) {
  return `${AUTH_RATE_LIMIT_PREFIX}:fail:${email}`;
}

async function isEmailLocked(email) {
  if (!email) return false;

  if (redis) {
    const value = await redis.get(lockKey(email));
    return Boolean(value);
  }

  const until = memoryLockouts.get(email);
  if (!until) return false;
  if (until <= Date.now()) {
    memoryLockouts.delete(email);
    return false;
  }
  return true;
}

async function recordLoginFailure(email) {
  if (!email) return { locked: false, remaining: LOGIN_FAILURE_THRESHOLD };

  if (redis) {
    const attempts = await redis.incr(failKey(email));
    // Ensure the failure counter expires.
    if (attempts === 1) {
      await redis.expire(failKey(email), LOGIN_FAILURE_WINDOW_SECONDS);
    }
    const remaining = Math.max(0, LOGIN_FAILURE_THRESHOLD - attempts);
    if (attempts >= LOGIN_FAILURE_THRESHOLD) {
      await redis.set(lockKey(email), "1", { ex: LOGIN_LOCK_SECONDS });
      await redis.del(failKey(email));
      return { locked: true, remaining: 0 };
    }
    return { locked: false, remaining };
  }

  const now = Date.now();
  const bucket = memoryFailures.get(email);
  if (!bucket || bucket.resetAt <= now) {
    memoryFailures.set(email, { count: 1, resetAt: now + LOGIN_FAILURE_WINDOW_SECONDS * 1000 });
    return { locked: false, remaining: LOGIN_FAILURE_THRESHOLD - 1 };
  }
  bucket.count += 1;
  const remaining = Math.max(0, LOGIN_FAILURE_THRESHOLD - bucket.count);
  if (bucket.count >= LOGIN_FAILURE_THRESHOLD) {
    memoryFailures.delete(email);
    memoryLockouts.set(email, now + LOGIN_LOCK_SECONDS * 1000);
    return { locked: true, remaining: 0 };
  }
  return { locked: false, remaining };
}

async function clearLoginFailures(email) {
  if (!email) return;
  if (redis) {
    await redis.del(failKey(email));
    await redis.del(lockKey(email));
    return;
  }
  memoryFailures.delete(email);
  memoryLockouts.delete(email);
}

function genericAuthError() {
  // Prevent account enumeration by not reflecting upstream messages.
  return "Invalid email or password.";
}

async function verifyTurnstile(captchaToken) {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    return { ok: false, message: "Server misconfigured: TURNSTILE_SECRET_KEY is not set" };
  }

  let res;
  try {
    res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: captchaToken,
        }),
      },
    );
  } catch {
    return { ok: false, message: "Captcha verification request failed" };
  }

  const data = await res.json();
  if (!data.success) {
    return { ok: false, message: "Captcha verification failed" };
  }
  return { ok: true };
}

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { email, password, captchaToken, action, name } = body || {};

    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!captchaToken) {
      return new Response(
        JSON.stringify({ success: false, message: "Captcha token missing" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const captcha = await verifyTurnstile(String(captchaToken));
    if (!captcha.ok) {
      return new Response(
        JSON.stringify({ success: false, message: captcha.message }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const ip = getClientIp(req.headers);
    const normalizedEmail = normalizeEmail(email);
    const actionName = action === "signup" ? "signup" : "login";

    // Rate limit auth globally by IP and also by email to resist distributed attacks.
    // In production this is enforced via Upstash Redis across instances; locally
    // it falls back to an in-memory limiter.
    const [ipLimit, emailLimit] = await Promise.all([
      checkRateLimit(`${AUTH_RATE_LIMIT_PREFIX}:${actionName}:ip:${ip}`),
      checkRateLimit(`${AUTH_RATE_LIMIT_PREFIX}:${actionName}:email:${normalizedEmail}`),
    ]);

    if (!ipLimit.allowed || !emailLimit.allowed) {
      return new Response(
        JSON.stringify({ success: false, message: "Too many attempts. Please wait and try again." }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }

    if (action === "signup") {
      if (!supabaseAdmin) {
        return new Response(
          JSON.stringify({ success: false, message: "Auth server is not configured." }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }

      const { error } = await supabaseAdmin.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name },
        },
      });

      if (error) {
        return new Response(
          JSON.stringify({ success: false, message: error.message }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Signup successful. Verification email sent.",
          trigger: true,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    if (action === "login") {
      // Temporary lockout after repeated failures for this email (defense in depth).
      if (await isEmailLocked(normalizedEmail)) {
        return new Response(
          JSON.stringify({ success: false, message: "Too many failed login attempts. Please try again later." }),
          { status: 429, headers: { "Content-Type": "application/json" } },
        );
      }

      if (!supabaseUrl || !supabaseAnonKey) {
        return new Response(
          JSON.stringify({ success: false, message: "Auth server is not configured." }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }

      const cookieStore = await cookies();

      // createServerClient writes the session into cookies automatically when
      // signInWithPassword resolves. Tokens are never placed in the response body.
      const client = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            },
          },
        },
      );

      const { error } = await client.auth.signInWithPassword({ email, password });

      if (error) {
        const { locked } = await recordLoginFailure(normalizedEmail);
        return new Response(
          JSON.stringify({
            success: false,
            message: locked
              ? "Too many failed login attempts. Please try again later."
              : genericAuthError(),
          }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      }

      await clearLoginFailures(normalizedEmail);

      // Session is now stored in httpOnly cookies by the createServerClient adapter.
      // Tokens must never appear in the response body — they would be visible in
      // server logs, CDN logs, and browser DevTools Network captures.
      return new Response(
        JSON.stringify({ success: true, message: "Login successful" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Invalid action" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
