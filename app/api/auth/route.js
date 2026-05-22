import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_KEY || "placeholder-key",
);

export async function POST(req) {
  try {
    // Parse JSON body safely
    const body = await req.json();
    const { email, password, captchaToken, action, name } = body || {};

    // Validate required fields
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email and password are required",
        }),
        { status: 400 },
      );
    }
    if (!captchaToken) {
      return new Response(
        JSON.stringify({ success: false, message: "Captcha token missing" }),
        { status: 400 },
      );
    }

    // Verify Turnstile token for both signup and login
    const verifyRes = await fetch(
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
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Captcha verification failed",
        }),
        { status: 400 },
      );
    }

    if (action === "signup") {
      // Create Supabase user with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name },
        },
      });
      if (error) {
        return new Response(
          JSON.stringify({ success: false, message: error.message }),
          { status: 400 },
        );
      }
      return new Response(
        JSON.stringify({
          success: true,
          message: "Signup successful. Verification email sent.",
          trigger: true,
        }),
        { status: 200 },
      );
    } else if (action === "login") {
      // Verify captcha, then perform login server-side
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key",
      );

      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return new Response(
          JSON.stringify({ success: false, message: error.message }),
          { status: 401 },
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Login successful",
          session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          },
        }),
        { status: 200 },
      );
    }

    // Invalid action
    else {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid action" }),
        { status: 400 },
      );
    }
  } catch (err) {
    console.error("API Error:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 },
    );
  }
}
