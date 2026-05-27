const MAX_ANNOTATION_LENGTH = 240;

export function sanitizeSessionText(value, maxLength = MAX_ANNOTATION_LENGTH) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function createSessionEvent({
  type,
  payload = {},
  senderId = "unknown",
  senderName = "Anonymous",
  sequence = 0,
  timestamp = Date.now(),
}) {
  return {
    id: `${senderId}:${sequence}:${timestamp}`,
    type,
    payload,
    senderId,
    senderName,
    sequence,
    timestamp,
  };
}

export function createSessionSnapshot(initial = {}) {
  return {
    source: "",
    language: "JavaScript",
    step: 0,
    playing: false,
    speed: 900,
    presenterId: null,
    followPresenter: true,
    annotations: [],
    currentFrameId: null,
    ...initial,
  };
}

export function normalizeSessionEvents(events = []) {
  return [...events].sort((left, right) => {
    if (left.sequence !== right.sequence) return left.sequence - right.sequence;
    return left.timestamp - right.timestamp;
  });
}

export function applySessionEvent(snapshot, event) {
  const next = {
    ...snapshot,
    annotations: [...(snapshot.annotations || [])],
  };

  switch (event?.type) {
    case "state:update": {
      const delta = event.payload?.delta || {};
      if (typeof delta.source === "string") next.source = delta.source;
      if (typeof delta.language === "string") next.language = delta.language;
      if (typeof delta.step === "number") next.step = delta.step;
      if (typeof delta.playing === "boolean") next.playing = delta.playing;
      if (typeof delta.speed === "number") next.speed = delta.speed;
      if (typeof delta.presenterId === "string" || delta.presenterId === null) {
        next.presenterId = delta.presenterId;
      }
      if (typeof delta.followPresenter === "boolean") {
        next.followPresenter = delta.followPresenter;
      }
      if (typeof delta.currentFrameId === "string" || delta.currentFrameId === null) {
        next.currentFrameId = delta.currentFrameId;
      }
      return next;
    }
    case "annotation:add": {
      const text = sanitizeSessionText(event.payload?.text, 240);
      if (!text) return next;
      const annotation = {
        id: event.payload?.id || event.id,
        timeIndex: Number.isFinite(Number(event.payload?.timeIndex))
          ? Number(event.payload.timeIndex)
          : 0,
        text,
        author: sanitizeSessionText(event.payload?.author || event.senderName || "Anonymous", 80),
        authorId: event.payload?.authorId || event.senderId || null,
        createdAt: event.payload?.createdAt || event.timestamp,
      };
      next.annotations.push(annotation);
      return next;
    }
    case "control:grant": {
      next.presenterId = event.payload?.presenterId || null;
      return next;
    }
    case "control:request": {
      next.lastControlRequest = {
        requestedBy: event.payload?.requestedBy || event.senderId || null,
        requestedAt: event.timestamp,
      };
      return next;
    }
    default:
      return next;
  }
}

export function replaySessionTrace(initialSnapshot, events = []) {
  return normalizeSessionEvents(events).reduce(
    (snapshot, event) => applySessionEvent(snapshot, event),
    createSessionSnapshot(initialSnapshot),
  );
}

export function serializeSessionTrace({ metadata = {}, events = [] }) {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      metadata,
      events: normalizeSessionEvents(events),
    },
    null,
    2,
  );
}

export function deserializeSessionTrace(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid session trace payload");
  }

  const events = Array.isArray(parsed.events) ? parsed.events : [];
  return {
    version: parsed.version || 1,
    exportedAt: parsed.exportedAt || null,
    metadata: parsed.metadata && typeof parsed.metadata === "object" ? parsed.metadata : {},
    events: normalizeSessionEvents(events),
  };
}
