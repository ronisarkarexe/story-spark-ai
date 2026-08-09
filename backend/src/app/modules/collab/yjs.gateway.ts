import { Server, Socket, Namespace } from 'socket.io';
import * as Y from 'yjs';
import { CollabService } from './collab.service';

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Yjs gateway that syncs a Yjs document over a Socket.io namespace
 * and persists the document state to MongoDB.
 */
export class YjsGateway {
  private readonly io: Namespace;
  private readonly docs: Map<string, Y.Doc> = new Map();
  private readonly debouncedSaves: Map<string, () => void> = new Map();
  private readonly connectionCounts: Map<string, number> = new Map();
  private readonly saveDelay = 2000; // ms
  private readonly docTtlMs = 30 * 60 * 1000; // 30 minutes TTL
  private readonly ttlTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  constructor(io: Server) {
    this.io = io.of('/yjs');
    this.setup();
  }

  private setup() {
    this.io.on('connection', (socket: Socket) => {
      const { storyId } = socket.handshake.query as { storyId: string };
      if (!storyId) {
        socket.disconnect(true);
        return;
      }

      // Clear any pending TTL since a new connection arrived
      const existingTtl = this.ttlTimers.get(storyId);
      if (existingTtl) {
        clearTimeout(existingTtl);
        this.ttlTimers.delete(storyId);
      }

      // Track connection count per document
      this.connectionCounts.set(storyId, (this.connectionCounts.get(storyId) || 0) + 1);

      let doc = this.docs.get(storyId);
      if (!doc) {
        doc = new Y.Doc();
        this.docs.set(storyId, doc);
        // Load persisted state if any
        CollabService.getCollabState(storyId).then(state => {

          if (state) {
            const update = Uint8Array.from(Buffer.from(state, 'base64'));
            Y.applyUpdate(doc!, update);
          }
          socket.emit('sync', Y.encodeStateAsUpdate(doc!));
        });
      } else {
        // Send current state to the newly connected client
        socket.emit('sync', Y.encodeStateAsUpdate(doc));
      }

      // Broadcast updates from this socket to others
      socket.on('update', (update: Uint8Array) => {
        Y.applyUpdate(doc!, update);
        socket.broadcast.emit('update', update);
        this.scheduleSave(storyId, doc!);
      });

      // Awareness (cursors/selection)
      const Awareness = require('y-protocols/awareness').Awareness;
      const awareness = new Awareness(doc);
      awareness.setLocalStateField('user', {
        name: socket.id,
        color: this.randomColor(),
      });
      socket.on('awareness', (aw: Uint8Array) => {
        awareness.applyUpdate(aw);
        socket.broadcast.emit('awareness', aw);
      });

      socket.on('disconnect', () => {
        this.handleDisconnect(storyId, socket, awareness, doc!);
      });
    });
  }

  private handleDisconnect(storyId: string, socket: Socket, awareness: any, doc: Y.Doc) {
    // Clean up awareness for this client
    awareness.cleanup();
    socket.removeAllListeners();

    const count = (this.connectionCounts.get(storyId) || 1) - 1;
    if (count <= 0) {
      this.connectionCounts.delete(storyId);
      // Flush any pending save
      const debouncedSave = this.debouncedSaves.get(storyId);
      if (debouncedSave) {
        debouncedSave();
        this.debouncedSaves.delete(storyId);
      }
      // Start TTL timer for garbage collection
      const ttlTimer = setTimeout(() => {
        const awarenessModule = require('y-protocols/awareness');
        const awareness = new awarenessModule.Awareness(doc);
        awareness.destroy();
        doc.destroy();
        this.docs.delete(storyId);
        this.ttlTimers.delete(storyId);
      }, this.docTtlMs);
      this.ttlTimers.set(storyId, ttlTimer);
    } else {
      this.connectionCounts.set(storyId, count);
    }
  }

  private scheduleSave(storyId: string, doc: Y.Doc) {
    if (!this.debouncedSaves.has(storyId)) {
      const fn = debounce(() => {
        const update = Y.encodeStateAsUpdate(doc);
        const base64 = Buffer.from(update).toString('base64');
        CollabService.updateCollabState(storyId, base64);
        this.debouncedSaves.delete(storyId);
      }, this.saveDelay);
      this.debouncedSaves.set(storyId, fn);
    }
    this.debouncedSaves.get(storyId)!();
  }

  private randomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

        .catch(err => console.error(err))
