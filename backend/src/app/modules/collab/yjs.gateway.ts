import { Server, Socket } from 'socket.io';
import * as Y from 'yjs';
import { debounce } from 'lodash';
import { CollabService } from './collab.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Awareness } = require('y-protocols/awareness');

/**
* Yjs gateway that syncs a Yjs document over a Socket.io namespace
 * and persists the document state to MongoDB.
 *
 * ## Initialisation protocol
 *
 * The previous implementation placed an empty Y.Doc into `this.docs`
 * immediately and fired the MongoDB load in an unawaited `.then()`.
 * This created two race conditions:
 *
 *  1. A second socket connecting while the load was in-flight found
 *     the doc in the Map (non-null), skipped the load branch entirely,
 *     and therefore never received a `sync` event.
 *
 *  2. Any `update` events that arrived before `.then()` resolved were
 *     applied to the empty doc and then silently overwritten when the
 *     persisted state was applied on top.
 *
 * Fix: replace the raw Doc with a Promise<Y.Doc> during the load phase.
 * `this.docLoaders` stores that promise for every storyId whose doc is
 * still being initialised.  Every socket — first or subsequent — awaits
 * the same promise before registering event handlers, so:
 *
 *  - All sockets receive `sync` with the fully-hydrated document state.
 *  - No `update` handler is registered until after `Y.applyUpdate` has
 *    been called, so in-flight edits cannot race with the initial load.
 */
export class YjsGateway {
  private readonly io: Server;
  private readonly docs: Map<string, Y.Doc> = new Map();
  // Holds the in-flight load promise so concurrent connections share it
  // instead of each triggering an independent DB fetch.
  private readonly docLoaders: Map<string, Promise<Y.Doc>> = new Map();
  private readonly debouncedSaves: Map<string, () => void> = new Map();
  private readonly saveDelay = 2000; // ms

  constructor(io: Server) {
    this.io = io.of('/yjs');
    this.setup();
  }

  /**
   * Returns a Promise that resolves to the fully-hydrated Y.Doc for the
   * given storyId.  If the doc is already loaded it resolves immediately.
   * If a load is in progress every caller awaits the same Promise (no
   * duplicate DB reads).  Otherwise a new load is started.
   */
  private getOrLoadDoc(storyId: string): Promise<Y.Doc> {
    // Already fully loaded — wrap in a resolved promise.
    const existing = this.docs.get(storyId);
    if (existing) return Promise.resolve(existing);

    // Load already in flight — share it.
    const inFlight = this.docLoaders.get(storyId);
    if (inFlight) return inFlight;

    // First connection for this storyId — start the load.
    const loader = CollabService.getCollabState(storyId).then(state => {
      const doc = new Y.Doc();
      if (state) {
        const update = Uint8Array.from(Buffer.from(state, 'base64'));
        Y.applyUpdate(doc, update);
      }
      // Promote to the stable docs map and retire the loader.
      this.docs.set(storyId, doc);
      this.docLoaders.delete(storyId);
      return doc;
    });

    this.docLoaders.set(storyId, loader);
    return loader;
  }

  private setup() {
    this.io.on('connection', (socket: Socket) => {
      const { storyId } = socket.handshake.query as { storyId: string };
      if (!storyId) {
        socket.disconnect(true);
        return;
      }

      // All sockets — first or concurrent — await the same loader promise.
      // No event handlers are registered until the doc is fully hydrated.
      this.getOrLoadDoc(storyId).then(doc => {
        // Send the full current state to the newly connected client.
        socket.emit('sync', Y.encodeStateAsUpdate(doc));

        // Broadcast updates from this socket to others in the room.
        socket.on('update', (update: Uint8Array) => {
          Y.applyUpdate(doc, update);
          socket.broadcast.emit('update', update);
          this.scheduleSave(storyId, doc);
        });

        // Awareness (cursors / selection).
        const awareness = new Awareness(doc);
        awareness.setLocalStateField('user', {
          name: socket.id,
          color: this.randomColor(),
        });
        socket.on('awareness', (aw: Uint8Array) => {
          awareness.applyUpdate(aw);
          socket.broadcast.emit('awareness', aw);
        });
      }).catch(err => {
        // If the DB load fails, disconnect cleanly rather than leaving
        // the client in a permanently desynced state.
        console.error(`[YjsGateway] Failed to load doc for storyId=${storyId}:`, err);
        socket.emit('error', { message: 'Failed to load document state.' });
        socket.disconnect(true);
        // Remove the failed loader so the next connection retries the load.
        this.docLoaders.delete(storyId);
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
