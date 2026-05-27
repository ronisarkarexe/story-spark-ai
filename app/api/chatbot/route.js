import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const MAX_MESSAGES_PER_REQUEST = 20;
const MAX_TOTAL_CHARS = 4000;
const MAX_PER_MESSAGE_LENGTH = 2000;
const VALID_ROLES = new Set(["user", "assistant"]);

const SYSTEM_PROMPT = `You are the AlgoBuddy AI Assistant, an interactive helper for students and developers learning Data Structures and Algorithms (DSA). Your goal is to explain concepts in simple, easy-to-understand words, avoid jargon where possible, and provide clear step-by-step guidance.

Capabilities & Guidelines:
1. Explain concepts step-by-step (e.g., how a queue works, how quicksort partitions elements).
2. Answer user doubts in a friendly, supportive, and beginner-friendly tone.
3. Explain code line-by-line. Highlight what each variable represents and what each loop/conditional accomplishes.
4. Help beginners understand time and space complexity (Big O notation) using intuitive analogies.
5. Give simple examples and quiz help. Do not give direct answers immediately if the user is asking a quiz question; instead, guide them to the answer by explaining the underlying concept and asking leading questions.
6. Format your responses using clean Markdown. Use headings, bullet points, bold text, and code blocks with language specifiers for syntax highlighting.
7. Keep responses concise and structured. Do not overwhelm the user with walls of text.
8. If asked about something unrelated to programming, computer science, or DSA, politely redirect the conversation back to algorithms and data structures.`;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function validateMessages(messages) {
  if (!messages || !Array.isArray(messages)) {
    return "Invalid or missing 'messages' array.";
  }
  if (messages.length > MAX_MESSAGES_PER_REQUEST) {
    return `Cannot send more than ${MAX_MESSAGES_PER_REQUEST} messages.`;
  }
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!msg || !VALID_ROLES.has(msg.role)) {
      return `Message at index ${i} has an invalid or missing role.`;
    }
    if (typeof msg.content !== "string") {
      return `Message content at index ${i} must be a string.`;
    }
    if (msg.content.length > MAX_PER_MESSAGE_LENGTH) {
      return `Message at index ${i} exceeds ${MAX_PER_MESSAGE_LENGTH} characters.`;
    }
  }

  const totalChars = messages.reduce((sum, message) => sum + message.content.length, 0);
  if (totalChars > MAX_TOTAL_CHARS) {
    return `Total message content exceeds ${MAX_TOTAL_CHARS} characters.`;
  }

  return null;
}
function createGeminiContents(messages) {
  return [
    {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT }],
    },
    ...messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
  ];
}

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (err) {
      return Response.json({ error: "Invalid JSON request body." }, { status: 400 });
    }

    const { messages, captchaToken } = body || {};

    // Basic payload validation
        // Basic payload validation
    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid or missing 'messages' array." }, { status: 400 });
    }
    if (messages.length === 0 || messages.length > MAX_MESSAGES_PER_REQUEST) {
      return Response.json({ error: `Messages must be between 1 and ${MAX_MESSAGES_PER_REQUEST} items.` }, { status: 400 });
    }

    // 3. Validate Messages Payload
    const validationError = validateMessages(messages);
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 });
    }

    // Captcha & IP (Required to define the 'ip' variable for rate limiting)
    if (!captchaToken) {
      return Response.json({ error: "Captcha token missing." }, { status: 403 });
    }
    const ip = getClientIp(req.headers);
    const captcha = await verifyTurnstile(String(captchaToken), { ip });
    if (!captcha.ok) {
      return Response.json({ error: captcha.error }, { status: 403 });
    }

    // Rate limiting
    const { allowed } = await checkRateLimit(`chatbot:${ip}`);
    if (!allowed) {
      return Response.json({ error: "Too many messages. Please wait a minute and try again." }, { status: 429 });
    }

    // Supabase auth check
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return Response.json({ error: "Service unavailable." }, { status: 503 });
    }
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
    });

    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "Gemini API Key is missing." }, { status: 500 });
    }

    // Call Gemini
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: createGeminiContents(messages),
          generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errData = await geminiRes.json().catch(() => ({}));
      console.error("Gemini API error", errData);
      return Response.json({ error: "Gemini API request failed." }, { status: 502 });
    }

    const geminiData = await geminiRes.json();
    const replyText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText) {
      return Response.json({ error: "No response received from Gemini API." }, { status: 502 });
    }

    return Response.json({ message: { role: "assistant", content: replyText } });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return Response.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}
