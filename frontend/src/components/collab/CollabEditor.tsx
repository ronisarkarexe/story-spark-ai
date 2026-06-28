import { useEffect, useRef } from 'react';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { IndexeddbPersistence } from 'y-indexeddb';
import { io, Socket } from 'socket.io-client';
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from 'y-protocols/awareness';
import { resolveSocketUrl } from '../../helpers/socket-url';

interface CollabEditorProps {
  storyId: string;
  userId: string;
  username: string;
  userColor: string;
}

export default function CollabEditor({ storyId, userId, username, userColor }: CollabEditorProps) {
  const quillRef = useRef<HTMLDivElement>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const awarenessRef = useRef<Awareness | null>(null);
  const quillCursorsRef = useRef<unknown>(null);

  useEffect(() => {
    if (!quillRef.current) return;

    // Initialize Yjs document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;
    const ytext = ydoc.getText('quill');

    // IndexedDB persistence for offline support
    const persistence = new IndexeddbPersistence(storyId, ydoc);
    persistence.once('synced', () => {
      // Document is loaded from IndexedDB or empty
    });

    // Register QuillCursors module
    Quill.register('modules/cursors', QuillCursors);
    // Setup Quill editor with cursors module
    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      placeholder: 'Start collaborating...',
      modules: {
        cursors: true,
        toolbar: true,
      },
    });
    const cursors = quill.getModule('cursors');
    // Store cursors manager reference
    (quillCursorsRef as { current: unknown }).current = cursors;

    // Bind Yjs text to Quill
    const binding = new QuillBinding(ytext, quill);

    // Setup awareness for presence
    const awareness = new Awareness(ydoc);
    awarenessRef.current = awareness;
    awareness.setLocalStateField('user', {
      name: username,
      color: userColor,
      userId,
    });

    // Handle local cursor changes and broadcast via awareness
    const handleSelectionChange = (range: { index: number; length: number } | null) => {
      if (!range) {
        awareness.setLocalStateField('cursor', null);
        return;
      }
      awareness.setLocalStateField('cursor', {
        index: range.index,
        length: range.length,
      });
    };
    quill.on('selection-change', handleSelectionChange);

    // Render remote cursors from awareness updates
    const renderRemoteCursors = () => {
      const states = awareness.getStates();
      states.forEach((state: Record<string, unknown>, clientId: number) => {
        if (clientId === awareness.clientID) return;
        const user = state.user;
        const cursor = state.cursor;
        if (user && cursor) {
          const cursorId = clientId.toString();
          const qC = quillCursorsRef.current as { 
            cursors: () => Record<string, unknown>; 
            createCursor: (id: string, name: string, color: string) => void;
            moveCursor: (id: string, cursor: unknown) => void;
          } | null;
          
          if (qC) {
            const existing = qC.cursors?.()?.[cursorId];
            if (!existing) {
              qC.createCursor(cursorId, (user as {name: string}).name, (user as {color: string}).color);
            }
            qC.moveCursor(cursorId, cursor);
          }
        }
      });
    };
    awareness.on('update', renderRemoteCursors);

    // Connect to backend socket.io namespace for Yjs sync.
    // If VITE_SOCKET_URL is unconfigured, resolveSocketUrl() returns "".
    // Skip the socket entirely so we don't attempt a doomed connection to
    // the app's own origin (which has no Socket.IO server) and retry forever.
    // The editor still works locally via Yjs + IndexedDB persistence.
    const socketUrl = resolveSocketUrl();
    let socket: Socket | null = null;
    let sendUpdate: ((update: Uint8Array) => void) | null = null;

    if (socketUrl) {
      socket = io(`${socketUrl}/yjs`, {
        transports: ['websocket', 'polling'],
        query: { storyId },
        withCredentials: true,
      });
      socketRef.current = socket;

      socket.on('connect_error', (err: Error) => {
        console.warn('[Story Spark] Collab editor socket connection error:', err.message);
      });

      // Receive initial sync from server
      socket.on('sync', (update: Uint8Array) => {
        Y.applyUpdate(ydoc, update);
      });

      // Receive remote updates
      socket.on('update', (update: Uint8Array) => {
        Y.applyUpdate(ydoc, update);
      });

      // Broadcast local updates
      sendUpdate = (update: Uint8Array) => {
        socket!.emit('update', update);
      };
      ydoc.on('update', sendUpdate);

      // Awareness updates
      const sendAwareness = (awarenessUpdate: Uint8Array) => {
        socket!.emit('awareness', awarenessUpdate);
      };
      awareness.on('update', ({ added, updated, removed }: { added: number[], updated: number[], removed: number[] }) => {
        const awUpdate = encodeAwarenessUpdate(awareness, added.concat(updated).concat(removed));
        sendAwareness(awUpdate);
      });
      socket.on('awareness', (aw: Uint8Array) => {
        applyAwarenessUpdate(awareness, aw, 'remote');
      });
    } else {
      console.warn(
        '[Story Spark] Real-time sync disabled: VITE_SOCKET_URL is not configured. ' +
        'The collaborative editor will work locally only (no live sync between users).'
      );
    }

    return () => {
      if (sendUpdate) ydoc.off('update', sendUpdate);
      socket?.disconnect();
      awareness.off('update', renderRemoteCursors);
      awareness.destroy();
      binding.destroy();
      persistence.destroy();
      ydoc.destroy();
    };
  }, [storyId, userId, username, userColor]);

  return <div ref={quillRef} className="collab-editor" />;
}
