import { useEffect, useRef } from 'react';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { IndexeddbPersistence } from 'y-indexeddb';
import { io, Socket } from 'socket.io-client';
import { resolveSocketUrl } from '../../helpers/socket-url';
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from 'y-protocols/awareness';

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

    // Setup awareness for presence
    const awareness = new Awareness(ydoc);
    awarenessRef.current = awareness;
    awareness.setLocalStateField('user', {
      name: username,
      color: userColor,
      userId,
    });

    // ✅ Bind Yjs text and Awareness to Quill
    // y-quill natively handles selection changes and remote cursor rendering!
    const binding = new QuillBinding(ytext, quill, awareness);

    // Connect to backend socket.io namespace for Yjs sync
    const socketUrl = resolveSocketUrl();
    const socket = io(`${socketUrl}/yjs`, {
      transports: ['websocket', 'polling'],
      query: { storyId },
      withCredentials: true,
    });
    socketRef.current = socket;

    // Receive initial sync from server
    socket.on('sync', (update: ArrayBuffer) => {
      Y.applyUpdate(ydoc, new Uint8Array(update));
    });

    // Receive remote updates
    socket.on('update', (update: ArrayBuffer) => {
      Y.applyUpdate(ydoc, new Uint8Array(update));
    });

    // Broadcast local updates
    const sendUpdate = (update: Uint8Array) => {
      socket.emit('update', update);
    };
    ydoc.on('update', sendUpdate);

    // ✅ Correctly handle Awareness updates
    const sendAwareness = (awarenessUpdate: Uint8Array) => {
      socket.emit('awareness', awarenessUpdate);
    };
    
    awareness.on('update', ({ added, updated, removed }: any) => {
      const clients = added.concat(updated).concat(removed);
      // Use the standalone encode function
      const awUpdate = encodeAwarenessUpdate(awareness, clients);
      sendAwareness(awUpdate);
    });

    socket.on('awareness', (aw: ArrayBuffer) => {
      // Use the standalone apply function, ensuring it's a Uint8Array
      applyAwarenessUpdate(awareness, new Uint8Array(aw), socket);
    });

    return () => {
      ydoc.off('update', sendUpdate);
      binding.destroy(); // Always a good idea to clean up the binding
      socket.disconnect();
    };
  }, [storyId, userId, username, userColor]);

  return <div ref={quillRef} className="collab-editor" />;
}