import {
  createCollaborationSession,
  listCollaborationSessions,
} from "@/lib/collaboration/sessionStore";
import { checkRateLimit } from "@/lib/rateLimit";

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

export async function GET() {
  const sessions = await listCollaborationSessions();
  return Response.json({ sessions });
}

export async function POST(request) {
  try {
    const ip = getClientIp(request.headers);
    const { allowed } = await checkRateLimit(`collab:create:${ip}`);
    if (!allowed) {
      return Response.json(
        { error: "Too many collaboration sessions created. Please try again shortly." },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    const { title, visibility, password, module, createdBy } = body || {};

    if (visibility === "private" && !password) {
      return Response.json(
        { error: "A password is required for private sessions." },
        { status: 400 },
      );
    }

    const { session, sessionSecret } = await createCollaborationSession({
      title,
      visibility,
      password,
      module,
      createdBy,
    });

    return Response.json({
      session,
      sessionSecret,
      joinUrl: `/visualizer/dry-run?session=${session.id}`,
    });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Failed to create collaboration session" },
      { status: 500 },
    );
  }
}
