import {
  getCollaborationSession,
  joinCollaborationSession,
  updateCollaborationSession,
} from "@/lib/collaboration/sessionStore";

export async function GET(_request, { params }) {
  const session = await getCollaborationSession(params.sessionId);
  if (!session) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  return Response.json({ session });
}

export async function POST(request, { params }) {
  const body = await request.json().catch(() => ({}));
  const session = await joinCollaborationSession(params.sessionId, {
    password: body.password,
  });

  if (session.error) {
    return Response.json({ error: session.error }, { status: session.status || 400 });
  }

  await updateCollaborationSession(params.sessionId, {
    participantCount: Math.max(0, (session.session?.participantCount || 0) + 1),
  });

  return Response.json(session);
}
