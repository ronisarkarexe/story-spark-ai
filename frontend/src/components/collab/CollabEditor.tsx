import { useEffect, useRef } from 'react';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { IndexeddbPersistence } from 'y-indexeddb';
import { io, Socket } from 'socket.io-client';
import { Awareness, applyAwarenessUpdate, encodeAwarenessUpdate } from 'y-protocols/awareness';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const awarenessRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillCursorsRef = useRef<any>(null);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (quillCursorsRef as any).current = cursors;

    // Bind Yjs text to Quill
    new QuillBinding(ytext, quill);

    // Setup awareness for presence
    const awareness = new Awareness(ydoc);
    awarenessRef.current = awareness;
    awareness.setLocalStateField('user', {
      name: username,
      color: userColor,
      userId,
    });

    // Handle local cursor changes and broadcast via awareness
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelectionChange = (range: any) => {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      states.forEach((state: any, clientId: number) => {
        if (clientId === awareness.clientID) return;
        const user = state.user;
        const cursor = state.cursor;
        if (user && cursor) {
          const cursorId = clientId.toString();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const existing = (quillCursorsRef as any).current?.cursors?.[cursorId];
          if (!existing) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (quillCursorsRef as any).current?.createCursor(cursorId, user.name, user.color);
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (quillCursorsRef as any).current?.moveCursor(cursorId, cursor);
        }
      });
    };
    awareness.on('update', renderRemoteCursors);

    // Connect to backend socket.io namespace for Yjs sync
    const socketUrl = resolveSocketUrl();
    const socket = io(`${socketUrl}/yjs`, {
      transports: ['websocket', 'polling'],
      query: { storyId },
      withCredentials: true,
    });
    socketRef.current = socket;

    // Receive initial sync from server
    socket.on('sync', (update: Uint8Array) => {
      Y.applyUpdate(ydoc, update);
    });

    // Receive remote updates
    socket.on('update', (update: Uint8Array) => {
      Y.applyUpdate(ydoc, update);
    });

    // Broadcast local updates
    const sendUpdate = (update: Uint8Array) => {
      socket.emit('update', update);
    };
    ydoc.on('update', sendUpdate);

    // Awareness updates
    const sendAwareness = (awarenessUpdate: Uint8Array) => {
      socket.emit('awareness', awarenessUpdate);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    awareness.on('update', ({ added, updated, removed }: any) => {
      const awUpdate = encodeAwarenessUpdate(awareness, added.concat(updated).concat(removed));
      sendAwareness(awUpdate);
    });
    socket.on('awareness', (aw: Uint8Array) => {
      applyAwarenessUpdate(awareness, aw, socket.id);
    });

    return () => {
      ydoc.off('update', sendUpdate);
      socket.disconnect();
    };
  }, [storyId, userId, username, userColor]);

  return <div ref={quillRef} className="collab-editor" />;
}
