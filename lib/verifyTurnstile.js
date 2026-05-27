/**
 * Shared Cloudflare Turnstile verification helper.
 *
 * @param {string} captchaToken
 * @param {{ ip?: string }} [opts]
 * @returns {Promise<{ ok: true } | { ok: false, error: string }>}
 */
export async function verifyTurnstile(captchaToken, opts = {}) {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    return {
      ok: false,
      error: "Server misconfigured: TURNSTILE_SECRET_KEY is not set",
    };
  }

  const token = String(captchaToken || "").trim();
  if (!token) {
    return { ok: false, error: "Captcha token missing" };
  }

  const ip = String(opts.ip || "").trim();

  let response;
  try {
    response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        ...(ip && ip !== "unknown" ? { remoteip: ip } : {}),
      }),
    });
  } catch {
    return { ok: false, error: "Captcha verification request failed" };
  }

  if (!response.ok) {
    return { ok: false, error: "Captcha verification request failed" };
  }

  const data = await response.json().catch(() => null);
  if (!data?.success) {
    return { ok: false, error: "Captcha verification failed" };
  }

  return { ok: true };
}

