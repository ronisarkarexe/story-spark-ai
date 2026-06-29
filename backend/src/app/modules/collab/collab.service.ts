import { ICollabRoom } from './collab.interface';
import { CollabRoom } from './collab.model';

/**
 * Service to manage collaborative editing sessions.
 * Interacts with MongoDB.
 */
export class CollabService {
  /**
   * Returns the current collab state of a room as a base64 string, if any.
   */
  static async getCollabState(roomId: string): Promise<string | undefined> {
    const room = await CollabRoom.findOne({ roomId }, { collabState: 1 }).lean();
    if (!room || !room.collabState) return undefined;
    // collabState is stored as a Buffer; convert to base64
    return (room.collabState as unknown as Buffer).toString('base64');
  }

  /**
   * Updates the collab state for a room using a base64 string.
   */
  static async updateCollabState(roomId: string, base64: string): Promise<void> {
    await CollabRoom.updateOne({ roomId }, { collabState: Buffer.from(base64, 'base64') });
  }

  /**
   * Dynamically update room visibility status parameters
   */
  static async updatePrivacyStatus(roomId: string, isPublic: boolean): Promise<ICollabRoom | null> {
    return await CollabRoom.findOneAndUpdate(
      { roomId },
      { isPublic },
      { new: true }
    );
  }
}
