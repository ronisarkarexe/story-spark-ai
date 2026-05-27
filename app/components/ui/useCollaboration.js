"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  createSessionEvent,
  deserializeSessionTrace,
  replaySessionTrace,
  sanitizeSessionText,
  serializeSessionTrace,
} from "@/lib/collaboration/sessionTrace";

function createClientId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `client_${Math.random().toString(36).slice(2)}`;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
}

async function resolveSessionIdentifier(identifier) {
  const raw = sanitizeSessionText(identifier, 160);
  if (!raw) return "";

  const query = raw.includes("session=") ? raw.split("session=").pop() : raw;
  if (!query) return "";

  const candidate = query.split(/[&#?]/)[0].trim();
  if (!candidate) return "";

  try {
    const { sessions = [] } = await requestJson("/api/sessions");
    const match = sessions.find((session) => {
      const joinCode = String(session.joinCode || "").toUpperCase();
      return session.id === candidate || joinCode === candidate.toUpperCase();
    });
    return match?.id || candidate;
  } catch {
    return candidate;
  }
}

export function useCollaboration({
  displayName = "Anonymous",
  onRemoteStateDelta,
} = {}) {
  const clientId = useMemo(() => createClientId(), []);
  const [session, setSession] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("idle");
  const [participants, setParticipants] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [presenterId, setPresenterId] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedEvents, setRecordedEvents] = useState([]);
  const [error, setError] = useState(null);

  const channelRef = useRef(null);
  const broadcastRef = useRef(null);
  const sessionRef = useRef(null);
  const sequenceRef = useRef(0);
  const seenSequencesRef = useRef(new Map());
  const callbacksRef = useRef({ onRemoteStateDelta });
  const currentDisplayNameRef = useRef(displayName);

  useEffect(() => {
    callbacksRef.current.onRemoteStateDelta = onRemoteStateDelta;
  }, [onRemoteStateDelta]);

  useEffect(() => {
    currentDisplayNameRef.current = displayName;
  }, [displayName]);

  function cleanupTransport() {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    if (broadcastRef.current) {
      broadcastRef.current.close();
      broadcastRef.current = null;
    }
  }

  function updateParticipantsFromJoin(participant) {
    if (!participant?.id) return;

    setParticipants((current) => {
      const next = current.filter((entry) => entry.id !== participant.id);
      return [...next, participant];
    });
  }

  function removeParticipant(participantId) {
    setParticipants((current) => current.filter((entry) => entry.id !== participantId));
  }

  function recordIfNeeded(event) {
    if (!recording) return;
    setRecordedEvents((current) => [...current, event]);
  }

  function processEnvelope(envelope) {
    if (!envelope || typeof envelope !== "object") return;

    const lastSeen = seenSequencesRef.current.get(envelope.senderId) || 0;
    if (Number.isFinite(envelope.sequence) && envelope.sequence <= lastSeen) {
      return;
    }

    if (Number.isFinite(envelope.sequence)) {
      seenSequencesRef.current.set(envelope.senderId, envelope.sequence);
    }

    recordIfNeeded(envelope);

    switch (envelope.type) {
      case "join": {
        updateParticipantsFromJoin({
          id: envelope.senderId,
          displayName: sanitizeSessionText(envelope.senderName || "Anonymous", 80),
          role: envelope.payload?.role || "participant",
          joinedAt: envelope.timestamp,
        });
        return;
      }
      case "leave": {
        removeParticipant(envelope.senderId);
        return;
      }
      case "state:update": {
        if (envelope.payload?.delta?.presenterId !== undefined) {
          setPresenterId(envelope.payload.delta.presenterId || null);
        }

        callbacksRef.current.onRemoteStateDelta?.(envelope.payload?.delta || {}, envelope);
        return;
      }
      case "annotation:add": {
        const annotation = {
          id: envelope.payload?.id || envelope.id,
          timeIndex: Number.isFinite(Number(envelope.payload?.timeIndex))
            ? Number(envelope.payload.timeIndex)
            : 0,
          text: sanitizeSessionText(envelope.payload?.text, 240),
          author: sanitizeSessionText(envelope.payload?.author || envelope.senderName || "Anonymous", 80),
          authorId: envelope.payload?.authorId || envelope.senderId || null,
          createdAt: envelope.payload?.createdAt || envelope.timestamp,
        };

        if (annotation.text) {
          setAnnotations((current) => [...current, annotation]);
        }
        return;
      }
      case "control:grant": {
        setPresenterId(envelope.payload?.presenterId || null);
        return;
      }
      default:
        return;
    }
  }

  function sendEnvelope(type, payload = {}, options = {}) {
    const activeSession = sessionRef.current;
    if (!activeSession) {
      throw new Error("Join or create a session first.");
    }

    const envelope = createSessionEvent({
      type,
      payload,
      senderId: clientId,
      senderName: currentDisplayNameRef.current,
      sequence: ++sequenceRef.current,
    });

    processEnvelope(envelope);

    channelRef.current?.send({
      type: "broadcast",
      event: "session:event",
      payload: envelope,
    });

    if (broadcastRef.current) {
      broadcastRef.current.postMessage(envelope);
    }

    if (options.applyLocal === false) {
      return envelope;
    }

    return envelope;
  }

  async function attachSession(nextSession, sessionSecret) {
    cleanupTransport();
    seenSequencesRef.current = new Map();
    setParticipants([]);
    setAnnotations([]);
    setPresenterId(null);
    sessionRef.current = nextSession;
    setSession(nextSession);
    setError(null);
    setConnectionStatus("connecting");

    const sessionChannelName = `collab:${nextSession.id}:${sessionSecret}`;
    const channel = supabase.channel(sessionChannelName, {
      config: { broadcast: { self: true } },
    });

    channel.on("broadcast", { event: "session:event" }, ({ payload }) => {
      processEnvelope(payload);
    });

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setConnectionStatus("connected");
        sendEnvelope("join", {
          role: nextSession.presenterId ? "attendee" : "presenter",
        });
      } else if (status === "TIMED_OUT" || status === "CHANNEL_ERROR") {
        setConnectionStatus("error");
      }
    });

    channelRef.current = channel;

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const broadcastChannel = new BroadcastChannel(sessionChannelName);
      broadcastChannel.onmessage = (event) => processEnvelope(event.data);
      broadcastRef.current = broadcastChannel;
    }

    return nextSession;
  }

  async function createSession({ title, visibility, password, module, createdBy }) {
    const data = await requestJson("/api/sessions", {
      method: "POST",
      body: JSON.stringify({ title, visibility, password, module, createdBy }),
    });

    await attachSession(data.session, data.sessionSecret);
    grantControl(clientId);
    return data;
  }

  async function joinSession({ sessionCode, password, createdBy }) {
    const resolvedSessionId = await resolveSessionIdentifier(sessionCode);
    if (!resolvedSessionId) {
      throw new Error("A session code or link is required.");
    }

    const data = await requestJson(`/api/sessions/${encodeURIComponent(resolvedSessionId)}`, {
      method: "POST",
      body: JSON.stringify({ password, createdBy }),
    });

    await attachSession(data.session, data.sessionSecret);
    return data;
  }

  async function leaveSession() {
    if (sessionRef.current) {
      try {
        sendEnvelope("leave", { role: "participant" }, { applyLocal: false });
      } catch {
        // ignore shutdown errors
      }
    }

    cleanupTransport();
    sessionRef.current = null;
    setSession(null);
    setConnectionStatus("idle");
    setParticipants([]);
    setAnnotations([]);
    setPresenterId(null);
  }

  function requestControl() {
    return sendEnvelope("control:request", {
      requestedBy: clientId,
      requestedByName: currentDisplayNameRef.current,
    });
  }

  function grantControl(nextPresenterId) {
    const presenter = nextPresenterId || clientId;
    return sendEnvelope("control:grant", { presenterId: presenter });
  }

  function addAnnotation({ timeIndex, text }) {
    const annotation = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `annotation_${Date.now()}`,
      timeIndex,
      text: sanitizeSessionText(text, 240),
      author: currentDisplayNameRef.current,
      authorId: clientId,
      createdAt: new Date().toISOString(),
    };

    if (!annotation.text) return null;

    sendEnvelope("annotation:add", annotation);
    return annotation;
  }

  function updateState(delta) {
    return sendEnvelope("state:update", { delta });
  }

  function startRecording() {
    setRecordedEvents([]);
    setRecording(true);
  }

  function stopRecording() {
    setRecording(false);
  }

  function clearRecording() {
    setRecordedEvents([]);
  }

  function exportRecording() {
    return serializeSessionTrace({
      metadata: {
        session,
        presenterId,
        exportedBy: clientId,
      },
      events: recordedEvents,
    });
  }

  function importRecording(text, initialSnapshot = {}) {
    const trace = deserializeSessionTrace(text);
    return replaySessionTrace(initialSnapshot, trace.events);
  }

  return {
    session,
    connectionStatus,
    participants,
    annotations,
    presenterId,
    recording,
    recordedEvents,
    error,
    clientId,
    createSession,
    joinSession,
    leaveSession,
    sendEnvelope: updateState,
    requestControl,
    grantControl,
    addAnnotation,
    startRecording,
    stopRecording,
    clearRecording,
    exportRecording,
    importRecording,
    setError,
    setPresenterId,
  };
}
