import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { verifyTurnstile } from "@/lib/verifyTurnstile";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(value) {
  const email = String(value).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clampInt(value, min, max) {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  const int = Math.trunc(num);
  if (int < min || int > max) return null;
  return int;
}

export async function POST(request) {
  try {
    const ip = getClientIp(request.headers);

    // checkRateLimit uses a global Redis sliding-window counter in production
    // so the limit is enforced across all serverless instances, not just the
    // current one. Falls back to an in-memory check in local development.
    const { allowed, remaining, resetAt } =
      await checkRateLimit(`contact:${ip}`);
    if (!allowed) {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);

  return Response.json(
    { message: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": "5",
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { name, email, review, rating, captchaToken } = body || {};

    if (!captchaToken) {
      return NextResponse.json(
        { success: false, error: "Captcha token missing" },
        { status: 400 }
      );
    }

    const captcha = await verifyTurnstile(String(captchaToken), { ip });
    if (!captcha.ok) {
      return NextResponse.json(
        { success: false, error: captcha.error },
        { status: 400 }
      );
    }

    const trimmedName = String(name || "").trim().slice(0, 80);
    const trimmedEmail = String(email || "").trim().slice(0, 254);
    const trimmedReview = String(review || "").trim().slice(0, 2000);
    const safeRating = clampInt(rating, 1, 5);

    if (!trimmedName) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }
    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      );
    }
    if (!trimmedReview) {
      return NextResponse.json(
        { success: false, error: "Review is required" },
        { status: 400 }
      );
    }
    if (!safeRating) {
      return NextResponse.json(
        { success: false, error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          error: "Server misconfigured: email credentials missing",
        },
        { status: 500 }
      );
    }

    const inboxEmail = process.env.REVIEW_INBOX_EMAIL || process.env.EMAIL_USER;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      replyTo: trimmedEmail,
      to: inboxEmail,
      subject: `New Review Submission from ${trimmedName}`,
      html: `
        <h2>New Review Received</h2>
        <p><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>
        <p><strong>Rating:</strong> ${"★".repeat(safeRating)}${"☆".repeat(
          5 - safeRating
        )}</p>
        <p><strong>Review:</strong></p>
        <p>${escapeHtml(trimmedReview).replaceAll("\n", "<br>")}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return Response.json(
  { message: "Email sent successfully" },
  {
    headers: {
      "X-RateLimit-Limit": "5",
      "X-RateLimit-Remaining": remaining.toString(),
    },
  }
);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
