import OpenAI from "openai";
import { checkRateLimit } from "@/lib/rateLimit";

const MAX_MESSAGES_PER_REQUEST = 20;
const MAX_TOTAL_CHARS = 4000;
const MAX_PER_MESSAGE_LENGTH = 2000;
const VALID_ROLES = new Set(["user", "assistant"]);

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

export async function POST(req) {
  try {
    // 1. Parse Request Body
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON request body." }, { status: 400 });
    }

    const { messages, captchaToken } = body || {};

    // 2. Turnstile Captcha Verification
    if (!captchaToken) {
      return Response.json(
        { error: "Captcha token missing." },
        { status: 403 }
      );
    }
    const captcha = await verifyTurnstile(String(captchaToken));
    if (!captcha.ok) {
      return Response.json(
        { error: captcha.message },
        { status: 403 }
      );
    }

    // 3. Validate Messages Payload
    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid or missing 'messages' array." }, { status: 400 });
    }

    if (messages.length === 0 || messages.length > MAX_MESSAGES_PER_REQUEST) {
      return Response.json(
        { error: `Messages count must be between 1 and ${MAX_MESSAGES_PER_REQUEST}.` },
        { status: 400 }
      );
    }

    for (const [i, msg] of messages.entries()) {
      if (!msg || typeof msg !== "object") {
        return Response.json({ error: `Message at index ${i} is not a valid object.` }, { status: 400 });
      }
      if (!VALID_ROLES.has(msg.role)) {
        return Response.json(
          { error: `Invalid role "${msg.role}" at index ${i}. Must be "user" or "assistant".` },
          { status: 400 }
        );
      }
      if (typeof msg.content !== "string") {
        return Response.json({ error: `Message content at index ${i} must be a string.` }, { status: 400 });
      }
      if (msg.content.length > MAX_PER_MESSAGE_LENGTH) {
        return Response.json(
          { error: `Message at index ${i} exceeds ${MAX_PER_MESSAGE_LENGTH} characters.` },
          { status: 400 }
        );
      }
    }

    const totalChars = messages.reduce((sum, m) => sum + m.content.length, 0);
    if (totalChars > MAX_TOTAL_CHARS) {
      return Response.json(
        { error: `Total message content exceeds ${MAX_TOTAL_CHARS} characters.` },
        { status: 400 }
      );
    }

    // 4. Rate Limiting Check (global via Upstash in prod, in-memory fallback locally)
    const ip = getClientIp(req.headers);
    const { allowed } = await checkRateLimit(`chatbot:${ip}`);
    if (!allowed) {
      return Response.json(
        { error: "Too many messages. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    // 5. Validate API Key
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OpenAI API Key is missing. Please add OPENAI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    // 6. Initialize OpenAI Client
    const apiKey = process.env.OPENAI_API_KEY;
    const isOpenRouter = apiKey.startsWith("sk-or-");

    const openai = new OpenAI({
      apiKey: apiKey,
      ...(isOpenRouter
        ? {
            baseURL: "https://openrouter.ai/api/v1",
            defaultHeaders: {
              "HTTP-Referer": "https://algobuddy.in",
              "X-Title": "AlgoBuddy",
            },
          }
        : {}),
    });

    const modelName = isOpenRouter ? "openai/gpt-4o-mini" : "gpt-4o-mini";

    // 7. Call Chat Completions API
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: "system",
          content: `You are the AlgoBuddy AI Assistant, an interactive helper for students and developers learning Data Structures and Algorithms (DSA). Your goal is to explain concepts in simple, easy-to-understand words, avoid jargon where possible, and provide clear step-by-step guidance.

Capabilities & Guidelines:
1. Explain concepts step-by-step (e.g., how a queue works, how quicksort partitions elements).
2. Answer user doubts in a friendly, supportive, and beginner-friendly tone.
3. Explain code line-by-line. Highlight what each variable represents and what each loop/conditional accomplishes.
4. Help beginners understand time and space complexity (Big O notation) using intuitive analogies.
5. Give simple examples and quiz help. Do not give direct answers immediately if the user is asking a quiz question; instead, guide them to the answer by explaining the underlying concept and asking leading questions.
6. Format your responses using clean Markdown. Use headings, bullet points, bold text, and code blocks with language specifiers for syntax highlighting.
7. Keep responses concise and structured. Do not overwhelm the user with walls of text.
8. If asked about something unrelated to programming, computer science, or DSA, politely redirect the conversation back to algorithms and data structures.`
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reply = response.choices[0]?.message;
    if (!reply) {
      throw new Error("No response received from OpenAI API.");
    }

    return Response.json({ message: reply });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return Response.json(
      { error: error.message || "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
