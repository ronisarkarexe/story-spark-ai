import crypto from "crypto";
import { Redis } from "@upstash/redis";
import { sanitizeSessionText } from "./sessionTrace";

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
const PUBLIC_VISIBILITY = new Set(["public", "unlisted", "private"]);

const memorySessions = new Map();

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

function createId(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

function normalizeVisibility(value) {
  return PUBLIC_VISIBILITY.has(value) ? value : "public";
}

function createJoinCode(sessionId) {
  return sessionId.replace(/_/g, "").slice(0, 8).toUpperCase();
}

function hashPassword(password) {
  if (!password) return null;
  return crypto.createHash("sha256").update(String(password)).digest("hex");
}

function sessionKey(sessionId) {
  return `collab:session:${sessionId}`;
}

function discoverableSessionView(session) {
  if (!session) return null;
  return {
    id: session.id,
    joinCode: session.joinCode,
    title: session.title,
    visibility: session.visibility,
    module: session.module,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    participantCount: session.participantCount || 0,
  };
}

async function readSession(sessionId) {
  if (!sessionId) return null;

  if (redis) {
    const value = await redis.get(sessionKey(sessionId));
    return value ? value : null;
  }

  return memorySessions.get(sessionId) || null;
}

async function writeSession(session) {
  const nextSession = {
    ...session,
    updatedAt: new Date().toISOString(),
  };

  if (redis) {
    await redis.set(sessionKey(nextSession.id), nextSession, {
      ex: SESSION_TTL_SECONDS,
    });
  } else {
    memorySessions.set(nextSession.id, nextSession);
  }

  return nextSession;
}

export async function createCollaborationSession(input = {}) {
  const title = sanitizeSessionText(input.title || "Untitled session", 80);
  const visibility = normalizeVisibility(input.visibility || "public");
  const passwordHash = visibility === "private" ? hashPassword(input.password) : null;
  const id = createId("session");
  const joinCode = createJoinCode(id);
  const sessionSecret = crypto.randomBytes(24).toString("base64url");
  const now = new Date().toISOString();

  const session = await writeSession({
    id,
    joinCode,
    title,
    visibility,
    module: sanitizeSessionText(input.module || "dry-run", 40),
    presenterId: null,
    createdAt: now,
    updatedAt: now,
    createdBy: sanitizeSessionText(input.createdBy || "", 80),
    passwordHash,
    sessionSecret,
    participantCount: 0,
    annotations: [],
    events: [],
  });

  return {
    session: discoverableSessionView(session),
    sessionSecret,
  };
}

export async function listCollaborationSessions() {
  if (redis) {
    const keys = await redis.keys("collab:session:*");
    const sessions = [];

    for (const key of keys) {
      const session = await redis.get(key);
      if (session && session.visibility !== "private") {
        sessions.push(discoverableSessionView(session));
      }
    }

    return sessions.filter(Boolean).sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  return [...memorySessions.values()]
    .filter((session) => session.visibility !== "private")
    .map(discoverableSessionView)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function getCollaborationSession(sessionId) {
  return readSession(sessionId);
}

export async function joinCollaborationSession(sessionId, { password } = {}) {
  const session = await readSession(sessionId);
  if (!session) {
    return { error: "Session not found", status: 404 };
  }

  if (session.visibility === "private") {
    const providedHash = hashPassword(password);
    if (!providedHash || providedHash !== session.passwordHash) {
      return { error: "Invalid session password", status: 403 };
    }
  }

  return {
    session: discoverableSessionView(session),
    sessionSecret: session.sessionSecret,
  };
}

export async function updateCollaborationSession(sessionId, patch = {}) {
  const current = await readSession(sessionId);
  if (!current) return null;

  const next = await writeSession({
    ...current,
    ...patch,
  });

  return discoverableSessionView(next);
}
