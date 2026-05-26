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

    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    // 1. Parse Request Body
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON request body." }, { status: 400 });
    }

    const { messages } = body || {};

    // 2. Validate Messages Payload
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

    // 3. Rate Limiting Check
    const ip = getClientIp(req.headers);
    const { allowed } = await checkRateLimit(`chatbot:${ip}`);
    if (!allowed) {
      return Response.json(
        { error: "Too many messages. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    // 4. Validate Gemini API Key
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "Gemini API Key is missing. Please add GEMINI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    // 5. Convert messages to Gemini format
    const geminiContents = [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: "model",
        parts: [{ text: "Understood! I am the AlgoBuddy AI Assistant, ready to help you learn DSA. What would you like to know?" }],
      },
      ...messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    ];

    // 6. Call Gemini API
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: geminiContents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errData = await geminiRes.json();
      throw new Error(errData?.error?.message || "Gemini API request failed.");
    }

    const geminiData = await geminiRes.json();
    const replyText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      throw new Error("No response received from Gemini API.");
    }

    // 7. Return in the same format the frontend expects
    return Response.json({
      message: {
        role: "assistant",
        content: replyText,
      },
    });

  } catch (error) {
    console.error("Chatbot API error:", error);
    return Response.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}