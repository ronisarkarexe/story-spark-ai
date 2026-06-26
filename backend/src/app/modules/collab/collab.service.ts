import { CollabRoom } from './collab.model';

/**
 * Service for persisting and retrieving the Yjs document state stored in a CollabRoom.
 */
export class CollabService {
  /**
   * Retrieve the persisted collabState (base64 string) for a given roomId.
   * Returns undefined if no state is stored.
   */
  static async getCollabState(roomId: string): Promise<string | undefined> {
    const room = await CollabRoom.findOne({ roomId }, { collabState: 1 }).lean();
    if (!room || !room.collabState) return undefined;
    // collabState is stored as a Buffer; convert to base64
    return (room.collabState as Buffer).toString('base64');
  }

  /**
   * Persist the base64‑encoded Yjs document update for a room.
   */
  static async updateCollabState(roomId: string, base64: string): Promise<void> {
    await CollabRoom.updateOne({ roomId }, { collabState: Buffer.from(base64, 'base64') });
  }
}
