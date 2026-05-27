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

export async function POST(req) {
  try {
    const ip = getClientIp(req.headers);

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
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ message: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { name, email, subject, message, captchaToken } = body || {};

    if (!captchaToken) {
      return new Response(JSON.stringify({ message: "Captcha token missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const captcha = await verifyTurnstile(String(captchaToken), { ip });
    if (!captcha.ok) {
      return new Response(JSON.stringify({ message: captcha.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const trimmedName = String(name || "").trim().slice(0, 80);
    const trimmedEmail = String(email || "").trim().slice(0, 254);
    const trimmedSubject = String(subject || "").trim().slice(0, 140);
    const trimmedMessage = String(message || "").trim().slice(0, 4000);

    if (!trimmedName) {
      return new Response(JSON.stringify({ message: "Name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!isValidEmail(trimmedEmail)) {
      return new Response(JSON.stringify({ message: "Valid email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!trimmedSubject) {
      return new Response(JSON.stringify({ message: "Subject is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!trimmedMessage) {
      return new Response(JSON.stringify({ message: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return new Response(
        JSON.stringify({ message: "Server misconfigured: email credentials missing" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${trimmedSubject}`,
      text: `
        Name: ${trimmedName}
        Email: ${trimmedEmail}
        Subject: ${trimmedSubject}
        Message: ${trimmedMessage}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(trimmedSubject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(trimmedMessage).replaceAll("\n", "<br>")}</p>
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
    return new Response(JSON.stringify({ message: "Error sending email" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
