import { Server, Socket, Namespace } from 'socket.io';
import * as Y from 'yjs';
import { CollabService } from './collab.service';

const debounce = <T extends () => void>(fn: T, delayMs: number): T => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return ((...args: unknown[]) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => fn(...(args as [])), delayMs);
  }) as unknown as T;
};

/**
 * Yjs gateway that syncs a Yjs document over a Socket.io namespace
 * and persists the document state to MongoDB.
 */
export class YjsGateway {
  private readonly io: Namespace;
  private readonly docs: Map<string, Y.Doc> = new Map();
  private readonly debouncedSaves: Map<string, () => void> = new Map();
  private readonly saveDelay = 2000; // ms

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
      }
      // Broadcast updates from this socket to others
      socket.on('update', (update: Uint8Array) => {
        Y.applyUpdate(doc!, update);
        socket.broadcast.emit('update', update);
        this.scheduleSave(storyId, doc!);
      });
      // Awareness (cursors/selection)
      const awareness = new (require('y-protocols/awareness')).Awareness(doc);
      awareness.setLocalStateField('user', {
        name: socket.id,
        color: this.randomColor(),
      });
      socket.on('awareness', (aw: Uint8Array) => {
        awareness.applyUpdate(aw);
        socket.broadcast.emit('awareness', aw);
      });
    });
  }

  private scheduleSave(storyId: string, doc: Y.Doc) {
    if (!this.debouncedSaves.has(storyId)) {
      const fn = debounce(() => {
        const update = Y.encodeStateAsUpdate(doc);
        const base64 = Buffer.from(update).toString('base64');
        CollabService.updateCollabState(storyId, base64);
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
